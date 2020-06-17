import Base from './Base'
import { Document } from 'mongoose'
import * as _ from 'lodash'
import { constant } from '../constant'
import { geo } from '../utility/geo'
import * as uuid from 'uuid'
import { validate, utilCrypto, mail, permissions, getDidPublicKey, logger, user } from '../utility'
import * as jwt from 'jsonwebtoken'
import { ObjectID } from 'bson'

import * as mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId

const selectFields = '-logins -salt -password -elaBudget -elaOwed -votePower -resetToken'
const strictSelectFields = selectFields + ' -email -profile.walletAddress'

const restrictedFields = {
    update: [
        '_id',
        'username',
        'role',
        'profile',
        'salt'
    ]
}

export default class extends Base {

    private db_user;

    protected init() {
        this.db_user = this.getDBModel('User');
    }

    /**
     * On registration we also add them to the country community,
     * if it doesn't exist yet we will create it as well
     *
     * @param param
     * @returns {Promise<"mongoose".Document>}
     */
    public async registerNewUser(param): Promise<Document> {

        const db_user = this.getDBModel('User');

        let {
            username,
            email,
            country,
            state,
            city,
            fullName,
            avatar,
            gender,
            birth,
            phone
        } = param

        username = param.username.toLowerCase()
        email = param.email.toLowerCase()

        this.validate_username(username)
        // this.validate_password(param.password)
        this.validate_email(email)

        // check username and email unique
        if (await db_user.findOne({ username })) {
            throw 'USERNAME_HAS_EXISTED'
        }
        if (await db_user.findOne({ email: email })) {
            throw 'EMAIL_HAS_EXISTED'
        }

        const salt = uuid.v4()

        const doc: any = {
            username,
            password: this.getPassword(constant.PASSWORD_DEFAULT, salt),
            email,
            salt,
            profile: {
                avatar: avatar,
                fullName: fullName,
                gender: gender,
                birth: birth,
                phone: phone
            },
            role: constant.USER_ROLE.MEMBER,
            active: true
        }

        const newUser = await db_user.save(doc)

        return newUser
    }

    // record user login date
    public async recordLogin(param) {
        const db_user = this.getDBModel('User')
        await db_user.update({ _id: param.userId }, { $push: { logins: new Date() } })
    }

    public async getUserSalt(username): Promise<String> {
        const isEmail = validate.email(username)
        username = username.toLowerCase()

        const query = { [isEmail ? 'email' : 'username']: username }

        const db_user = this.getDBModel('User')
        const user = await db_user.db.findOne(query)

        if (!user) {
            throw 'invalid username or email'
        }
        return user.salt
    }

    /**
     * TODO: ensure we have a test to ensure param.admin is checked properly (currently true)
     * @param param
     * @returns {Promise<"mongoose".DocumentQuery<T extends "mongoose".Document, T extends "mongoose".Document>>}
     */
    public async show(param) {
        const { userId } = param
        const db_user = this.getDBModel('User')
        const userRole = _.get(this.currentUser, 'role')
        const isUserAdmin = permissions.isAdmin(userRole)
        const isSelf = _.get(this.currentUser, '_id') === userId
        let fields = (isUserAdmin || isSelf) ? selectFields : strictSelectFields

        if (param.admin && !isUserAdmin && !isSelf) {
            throw 'Access Denied'
        }

        const user = await db_user.getDBInstance().findOne({
            _id: userId,
            $or: [
                { banned: { $exists: false } },
                { banned: false }
            ]
        })
            .select(fields)
            .populate('circles')

        if (!user) {
            throw `userId: ${userId} not found`
        }

        if (user.comments) {
            for (let comment of user.comments) {
                for (let thread of comment) {
                    await db_user.getDBInstance().populate(thread, {
                        path: 'createdBy',
                        select: fields
                    })
                }
            }

            for (let subscriber of user.subscribers) {
                await db_user.getDBInstance().populate(subscriber, {
                    path: 'user',
                    select: fields
                })
            }
        }
        const did = user.dids && user.dids.find(el => el.active === true)
        const temp = { ...user._doc }
        delete temp.dids
        temp.did = did
        return temp
    }

    public async updateRole(param) {
        const { userId, role } = param
        const db_user = this.getDBModel('User')
        const userRole = _.get(this.currentUser, 'role')
        const isUserAdmin = permissions.isAdmin(userRole)

        if (!isUserAdmin) {
            throw 'Access Denied'
        }

        if (Object.keys(constant.USER_ROLE).indexOf(role) === -1) {
            throw 'invalid role'
        }
        return await db_user.update({ _id: userId }, { role })
    }

    public async findUser(query): Promise<Document> {
        const db_user = this.getDBModel('User')
        const isEmail = validate.email(query.username)
        return await db_user.getDBInstance().findOne({
            [isEmail ? 'email' : 'username']: query.username.toLowerCase(),
            password: query.password,
            $or: [
                { banned: { $exists: false } },
                { banned: false }
            ]
        }).select(selectFields).populate('circles')
    }

    public async findUserByDid(did: string): Promise<Document> {
        const db_user = this.getDBModel('User')
        const query = {
            dids: { $elemMatch: { id: did, active: true } }
        }
        return await db_user.getDBInstance().findOne(query, selectFields)
    }

    public async findUsers(query): Promise<Document[]> {
        const db_user = this.getDBModel('User')

        return await db_user.getDBInstance().find({
            '_id': {
                $in: query.userIds
            }
        }).select(strictSelectFields)
    }

    /*
    ************************************************************************************
    * Find All Users
    * - be very restrictive here, careful to not select sensitive fields
    * - TODO: may need sorting by full name for Empower 35? Or something else?
    ************************************************************************************
     */
    public async findAll(query): Promise<Object> {
        const db_user = this.getDBModel('User')

        const finalQuery: any = {
            active: true,
            archived: { $ne: true }
        }

        if (query.search) {
            finalQuery.$and = _.map(_.trim(query.search).split(' '), (part) => {
                return {
                    $or: [
                        { 'profile.firstName': { $regex: part, $options: 'i' } },
                        { 'profile.lastName': { $regex: part, $options: 'i' } },
                        { username: { $regex: part, $options: 'i' } }
                    ]
                }
            })
        }

        if (query.skillset) {
            const skillsets = query.skillset.split(',')
            finalQuery['profile.skillset'] = { $in: skillsets }
        }

        if (query.profession) {
            const professions = query.profession.split(',')
            finalQuery['profile.profession'] = { $in: professions }
        }

        if (query.empower) {
            finalQuery.empower = JSON.parse(query.empower)
        }

        const cursor = db_user.getDBInstance().find(finalQuery)
        const totalCursor = db_user.getDBInstance().find(finalQuery).count()

        if (query.results) {
            const results = parseInt(query.results, 10)
            const page = parseInt(query.page, 10)
            cursor.skip(results * (page - 1)).limit(results)
        }

        cursor.select(strictSelectFields).sort({ username: 1 })

        const users = await cursor
        const total = await totalCursor

        if (users.length) {
            const db_team = this.getDBModel('Team')

            for (let user of users) {
                await db_team.getDBInstance().populate(user, {
                    path: 'circles'
                })
            }
        }

        return {
            list: users,
            total
        }
    }

    public async getCouncilMembers(): Promise<Object> {
        const db_user = this.getDBModel('User')
        const query = { role: constant.USER_ROLE.COUNCIL }
        const councilMembers = await db_user.getDBInstance().find(query)
            .select(constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL)
        return {
            list: councilMembers,
        }
    }

    public async changePassword(param): Promise<boolean> {
        const db_user = this.getDBModel('User')

        const { oldPassword, password } = param
        const username = param.username.toLowerCase()
        const userRole = _.get(this.currentUser, 'role')
        const isUserAdmin = permissions.isAdmin(userRole)
        const isSelf = _.get(this.currentUser, 'username') === username

        this.validate_password(oldPassword)
        this.validate_password(password)
        this.validate_username(username)

        if (!isUserAdmin && !isSelf) {
            throw 'Access Denied'
        }

        let user = await db_user.findOne({ username }, { reject: false })
        if (!user) {
            throw 'user does not exist'
        }

        if (user.password !== this.getPassword(oldPassword, user.salt)) {
            throw 'old password is incorrect'
        }

        const res = await db_user.update({ username }, {
            $set: {
                password: this.getPassword(password, user.salt)
            }
        })

        user = db_user.getDBInstance().findOne({ username })
            .populate('circles')

        return user
    }

    /*
    ******************************************************************************************
    * Forgot/Reset Password
    *
    * The idea here is to ensure that the user gets no hint the email exists
    ******************************************************************************************
     */
    public async forgotPassword(param) {

        const { email } = param

        console.log(`forgotPassword called on email: ${email}`)

        const db_user = this.getDBModel('User')

        const userEmailMatch = await db_user.findOne({
            email: email,
            active: true
        })

        if (!userEmailMatch) {
            console.error('no user matched')
            return
        }

        // add resetToken
        const resetToken = await utilCrypto.randomHexStr(8)

        await userEmailMatch.update({
            resetToken
        })

        // send email
        await mail.send({
            to: userEmailMatch.email,
            toName: `${userEmailMatch.profile.firstName} ${userEmailMatch.profile.lastName}`,
            subject: 'Cyber Republic - Password Reset',
            body: `For your convenience your username is ${userEmailMatch.username}
                <br/>
                <br/>
                Please click this link to reset your password:
                <a href="${process.env.SERVER_URL}/reset-password?token=${resetToken}">${process.env.SERVER_URL}/reset-password?token=${resetToken}</a>`
        })

    }

    public async resetPassword(param) {

        const db_user = this.getDBModel('User')
        const { resetToken, password } = param

        this.validate_password(password)

        const userMatchedByToken = await db_user.db.findOne({
            resetToken: resetToken,
            active: true
        })

        if (!userMatchedByToken) {
            console.error(`resetToken ${resetToken} did not match user`)
            throw 'token invalid'
        }

        const result = await db_user.update({ _id: userMatchedByToken._id }, {
            $set: {
                password: this.getPassword(password, userMatchedByToken.salt)
            },
            $unset: {
                resetToken: 1
            }
        })

        if (!result.nModified) {
            console.error(`resetToken ${resetToken} password update failed`)
            throw 'password update failed'
        }

        return 1
    }

    /*
    * return ela budget sum amount.
    *
    * param : user's elaBudget
    * */
    public getSumElaBudget(ela) {
        let total = 0
        _.each(ela, (item) => {
            total += item.amount
        })

        return total
    }

    /*
    * return user password
    * password is built with sha512 to (password + salt)
    *
    * */
    public getPassword(password, salt) {
        return utilCrypto.sha512(password + salt)
    }

    public validate_username(username) {
        if (!validate.valid_string(username, 6)) {
            throw 'invalid username'
        }
    }
    public validate_password(password) {
        if (!validate.valid_string(password, 8)) {
            throw 'invalid password'
        }
    }
    public validate_email(email) {
        if (!validate.email(email)) {
            throw 'invalid email'
        }
    }

    /**
     * Send an Email
     *
     * @param param {Object}
     * @param param.fromUserId {String}
     * @param param.toUserId {String}
     * @param param.subject {String}
     * @param param.message {String}
     */
    public async sendEmail(param) {

        const { fromUserId, toUserId, subject, message } = param

        // ensure fromUser is logged in
        if (this.currentUser._id.toString() !== fromUserId) {
            throw 'User mismatch - from user must = sender'
        }

        const db_user = this.getDBModel('User')

        const fromUser = await db_user.findById(fromUserId)
        const toUser = await db_user.findById(toUserId)

        const formattedSubject = subject || 'New Cyber Republic private message'

        const body = `
            New message from <a href="${process.env.SERVER_URL}/member/${fromUserId}">${fromUser.username}</a>
            <br/>
            <br/>
            ${message}
        `

        if (!fromUser) {
            throw 'From user not found'
        }

        if (!toUser) {
            throw 'From user not found'
        }

        // we assume users must have entered an email

        await mail.send({
            to: toUser.email,
            toName: `${toUser.profile.firstName} ${toUser.profile.lastName}`,
            subject: formattedSubject,
            body,
            replyTo: {
                name: `${fromUser.profile.firstName} ${fromUser.profile.lastName}`,
                email: fromUser.email
            }
        })

        return true
    }

    public async sendRegistrationCode(param) {
        const { email, code } = param
        await mail.send({
            to: email,
            toName: email,
            subject: 'Your Cyber Republic registration code',
            body: `Your code: ${code}`
        })
        return true
    }

    public async sendConfirmation(param) {
        const { email } = param

        await mail.send({
            to: email,
            toName: email,
            subject: 'Welcome to Cyber Republic',
            body: `
                Your registration is complete, your login is automatically linked to the CR forums.<br/>
                <br/>
                <a href="https://forum.cyberrepublic.org">Click here to join us on the forums</a>
            `
        })

        return true
    }



    public async checkEmail(param) {
        const db_user = this.getDBModel('User')

        const email = param.email.toLowerCase()

        this.validate_email(email)

        if (await db_user.findOne({ email: email })) {
            return { isExist: true }
        }

        return { isExist: false }
    }

    public async getElaUrl() {
        try {
            const userId = _.get(this.currentUser, '_id')
            const db_user = this.getDBModel('User')
            const user = await db_user.findById({ _id: userId })
            if (_.isEmpty(user)) {
                return { success: false }
            }
            // for reassociating DID
            if (user && !_.isEmpty(user.dids)) {
                const dids = user.dids.map(el => {
                    // the mark field will be removed after reassociated DID 
                    if (el.active === true) {
                        return {
                            id: el.id,
                            expirationDate: el.expirationDate,
                            active: true,
                            mark: true
                        }
                    }
                    return el
                })
                await db_user.update({ _id: userId }, { $set: { dids } })
            }
            const jwtClaims = {
                iss: process.env.APP_DID,
                userId: this.currentUser._id,
                callbackurl: `${process.env.API_URL}/api/user/did-callback-ela`,
                claims: {},
                website: {
                    domain: process.env.SERVER_URL,
                    logo: `${process.env.SERVER_URL}/assets/images/logo.svg`
                }
            }
            const jwtToken = jwt.sign(
                jwtClaims,
                process.env.APP_PRIVATE_KEY,
                { expiresIn: '7d', algorithm: 'ES256' }
            )
            const url = `elastos://credaccess/${jwtToken}`
            return { success: true, url }
        } catch (err) {
            logger.error(err)
            return { success: false }
        }
    }

    public async didCallbackEla(param: any) {
        try {
            const jwtToken = param.jwt
            const claims: any = jwt.decode(jwtToken)
            if (!claims) {
                return {
                    code: 400,
                    success: false,
                    message: 'Problems parsing jwt token.'
                }
            }
            const rs: any = await getDidPublicKey(claims.iss)
            if (!rs) {
                return {
                    code: 400,
                    success: false,
                    message: 'Can not get public key.'
                }
            }

            // verify response data from ela wallet
            return jwt.verify(jwtToken, rs.publicKey, async (err: any, decoded: any) => {
                if (err) {
                    return {
                        code: 401,
                        success: false,
                        message: 'Verify signatrue failed.'
                    }
                } else {
                    if (!decoded.req) {
                        return {
                            code: 400,
                            success: false,
                            message: 'The payload of jwt token is not correct.'
                        }
                    }
                    try {
                        // get user id to find the specific user and save DID
                        const result: any = jwt.decode(decoded.req.slice('elastos://credaccess/'.length))
                        if (!result || (result && !result.userId)) {
                            return {
                                code: 400,
                                success: false,
                                message: 'Problems parsing jwt token of CR website.'
                            }
                        }
                        const db_user = this.getDBModel('User')

                        const doc = await this.findUserByDid(decoded.iss)
                        if (doc && !doc._id.equals(result.userId)) {
                            return {
                                code: 400,
                                success: false,
                                message: 'This DID had been used by other user.'
                            }
                        }

                        const user = await db_user.findById({ _id: result.userId })
                        if (user) {
                            let dids: object[]
                            const matched = user.dids.find(el => el.id === decoded.iss)
                            // associate the same DID
                            if (matched) {
                                dids = user.dids.map(el => {
                                    if (el.id === decoded.iss) {
                                        return {
                                            id: el.id,
                                            active: true,
                                            expirationDate: rs.expirationDate
                                        }
                                    }
                                    return {
                                        id: el.id,
                                        expirationDate: el.expirationDate,
                                        active: false
                                    }
                                })
                            } else {
                                // associate different DID
                                const inactiveDids = user.dids.map(el => {
                                    if (el.active === true) {
                                        return {
                                            id: el.id,
                                            expirationDate: el.expirationDate,
                                            active: false
                                        }
                                    }
                                    return el
                                })
                                dids = [...inactiveDids, { id: decoded.iss, active: true, expirationDate: rs.expirationDate }]
                            }
                            await db_user.update(
                                { _id: result.userId },
                                { $set: { dids } }
                            )
                            return {
                                code: 200,
                                success: true, message: 'Ok'
                            }
                        } else {
                            return {
                                code: 400,
                                success: false,
                                message: 'User ID does not exist.'
                            }
                        }
                    } catch (err) {
                        logger.error(err)
                        return {
                            code: 500,
                            success: false,
                            message: 'Something went wrong'
                        }
                    }
                }
            })
        } catch (err) {
            logger.error(err)
            return {
                code: 500,
                success: false,
                message: 'Something went wrong'
            }
        }
    }

    public async getDid() {
        const userId = this.currentUser._id
        const db_user = this.getDBModel('User')
        const user = await db_user.findById({ _id: userId })
        if (user && user.dids) {
            const did = user.dids.find(el => el.active === true)
            if (did && !did.mark) {
                return { success: true, did }
            } else {
                return { success: false }
            }
        } else {
            return { success: false }
        }
    }

    public async loginElaUrl() {
        try {
            const jwtClaims = {
                iss: process.env.APP_DID,
                callbackurl: `${process.env.API_URL}/api/user/login-callback-ela`,
                nonce: uuid.v4(),
                claims: {},
                website: {
                    domain: process.env.SERVER_URL,
                    logo: `${process.env.SERVER_URL}/assets/images/logo.svg`
                }
            }
            const jwtToken = jwt.sign(
                jwtClaims,
                process.env.APP_PRIVATE_KEY,
                { expiresIn: '7d', algorithm: 'ES256' }
            )
            const url = `elastos://credaccess/${jwtToken}`
            return { success: true, url }
        } catch (err) {
            logger.error(err)
            return { success: false }
        }
    }

    public async loginCallbackEla(param: any) {
        try {
            const jwtToken = param.jwt
            const claims: any = jwt.decode(jwtToken)
            if (!claims) {
                return {
                    code: 400,
                    success: false,
                    message: 'Problems parsing jwt token.'
                }
            }
            const rs: any = await getDidPublicKey(claims.iss)
            if (!rs) {
                return {
                    code: 400,
                    success: false,
                    message: 'Can not get public key.'
                }
            }

            // verify response data from ela wallet
            return jwt.verify(jwtToken, rs.publicKey, async (err: any, decoded: any) => {
                if (err) {
                    return {
                        code: 401,
                        success: false,
                        message: 'Verify signatrue failed.'
                    }
                } else {
                    try {
                        const payload: any = jwt.decode(decoded.req.slice('elastos://credaccess/'.length))
                        if (!payload || (payload && !payload.nonce)) {
                            return {
                                code: 400,
                                success: false,
                                message: 'Problems parsing jwt token of CR website.'
                            }
                        }

                        const db_did = this.getDBModel('Did')
                        const didDoc = await db_did.findOne({ nonce: payload.nonce })
                        if (!_.isEmpty(didDoc)) {
                            return {
                                code: 200,
                                success: true, message: 'Ok'
                            }
                        }

                        const doc = {
                            did: decoded.iss,
                            expirationDate: rs.expirationDate,
                            number: payload.nonce
                        }
                        await db_did.save(doc)
                        return {
                            code: 200,
                            success: true, message: 'Ok'
                        }
                    } catch (err) {
                        logger.error(err)
                        return {
                            code: 500,
                            success: false,
                            message: 'Something went wrong'
                        }
                    }
                }
            })
        } catch (err) {
            logger.error(err)
            return {
                code: 500,
                success: false,
                message: 'Something went wrong'
            }
        }
    }

    public async checkElaAuth(param: any) {
        try {
            if (!param.req) {
                return { success: false }
            }
            const jwtToken = param.req.slice('elastos://credaccess/'.length)
            if (!jwtToken) {
                return { success: false }
            }
            return jwt.verify(jwtToken, process.env.APP_PUBLIC_KEY, async (err: any, decoded: any) => {
                if (err) {
                    return { success: false }
                }
                try {
                    const db_did = this.getDBModel('Did')
                    const doc = await db_did.findOne({ number: decoded.nonce })
                    if (doc) {
                        return { success: true, did: doc.did }
                    } else {
                        return { success: false }
                    }
                } catch (err) {
                    return { success: false }
                }
            })

        } catch (err) {
            return { success: false }
        }
    }

    // Start for Login
    public async getUserSaltByEmailOrCode(emailOrCode): Promise<String> {
        const query = { 'email': { $eq: emailOrCode } };
        const db_user = this.getDBModel('User');
        const user = await db_user.db
            .findOne({ email: emailOrCode });

        if (!user) {
            throw "USERNAME_OR_PASSWORD_IS_INCORRECT";
        }
        return user.salt;
    }

    public async findUserForLoginEmailOrCode(query): Promise<Document> {
        const emailOrCode = query.email;
        const db_user = this.getDBModel('User');
        return await db_user.getDBInstance()
            .findOne(
                {
                    email: emailOrCode,
                    password: query.password,
                }
            )
    }
    // End for Login


    // ======== CMS ========== //
    // Information Of Myself
    public async insertInformation(param) {

        const DB_USER = this.getDBModel('User')

        let {
            username,
            email,
            avatar,
            skill,
            description,
            name,
            firstName,
            lastName,
            company,
            personalDescription,
            employment,
            address,
            city,
            country,
            postCode
        } = param

        if (!username)
            throw "USERNAME_INVALID"

        if (!email)
            throw "EMAIL_INVALID"

        // Covert Email
        email = email.toLowerCase()
        // Randon Salt
        const salt = uuid.v4()
        // Create_Fullname
        let fullName = firstName.concat(lastName)

        const doc: any = {
            username: username,
            email: email,
            password: this.getPassword(constant.PASSWORD_DEFAULT, salt),
            salt,
            profile: {
                fullName: fullName,
                firstName: firstName,
                lastName: lastName,
                personalDescription: personalDescription,
                address: address,
                region: {
                    city: city,
                    country: country,
                    postCode: postCode
                },
            },
            type: "ADMIN"
        }

        await DB_USER
            .save(doc)

        return "SAVE_SUCCESSFULLY"

    }

    public async getProfile(param) {

        const DB_USER = this.getDBModel('User').getDBInstance();

        const {
            userId
        } = param

        const checkUser = await DB_USER
            .findById(userId)

        if (!checkUser)
            throw "USER_NOT_FOUND"

        let query: any = [
            {
                $match: {
                    active: true,
                    _id: ObjectId(userId)
                }
            },
            {
                $addFields: {
                    country: "$profile.region.country",
                    city: "$profile.region.city",
                    postCode: "$profile.region.postCode"
                }
            },
            {
                $project: {
                    username: { $ifNull: ["$username", ""] },
                    email: { $ifNull: ["$email", ""] },
                    profile: {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        gender: 1,
                        address: 1,
                        personalDescription: 1
                    },
                    country: 1,
                    city: 1,
                    postCode: 1,
                    type: { $ifNull: ["$type", ""] }
                }
            }
        ]

        const rs = await DB_USER
            .aggregate(query)

        return rs[0] ? rs[0] : []

    }

    public async editProfile(param) {

        const DB_USER = this.getDBModel('User').getDBInstance();

        const {
            userId,
            username,
            email,
            avatar,
            skill,
            description,
            name,
            firstName,
            lastName,
            company,
            personalDescription,
            employment,
            address,
            city,
            country,
            postCode
        } = param

        let fullName = firstName.concat(lastName);

        // CheckUser
        const checkUser = await DB_USER
            .findById(userId)

        if (!checkUser)
            throw "USER_NOT_FOUND"

        const doc: any = {
            username: username,
            email: email,
            profile: {
                fullName: fullName,
                firstName: firstName,
                lastName: lastName,
                personalDescription: personalDescription,
                address: address,
                region: {
                    city: city,
                    country: country,
                    postCode: postCode
                },
            },
            type: "ADMIN"
        }

        await DB_USER
            .updateOne(
                {
                    _id: ObjectId(userId)
                },
                {
                    $set: { ...doc }
                }
            )

        return "UPDATE_PROFILE_SUCCESSFULLY"

    }

    public async aboutMe(param) {

        const DB_USER = this.getDBModel('User').getDBInstance();

        const {
            about
        } = param



    }

}
