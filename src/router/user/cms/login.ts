import Base from '../../Base';
import UserService from '../../../service/UserService';
import { utilCrypto } from '../../../utility';
import * as moment from 'moment';
import { type, error } from '../../../constant'
import { use } from 'chai';

export default class extends Base {
    async action() {
        const userService = this.buildService(UserService);
        const { username: emailOrCode, password } = this.getParam();  //medRep có thể đăng nhập bằng employeeCode

        // userService.validate_email(email);
        userService.validate_password(password);

        // first get user for salt
        const salt = await userService.getUserSaltByEmailOrCode(emailOrCode);
        const pwd = userService.getPassword(password, salt);
        // const isVerified = true;

        const user = await userService.findUserForLoginEmailOrCode({
            email: emailOrCode,
            password: pwd,
        });
        console.log(user)

        if (!user) {
            throw error.USER.USERNAME_OR_PASSWORD_IS_INCORRECT;
        }

        // if (!Object(user).isVerified) {
        //     throw error.USER.ACCOUNT_NOT_VERIFY
        // }

        const resultData = {
            user
        };

        // record user login date
        userService.recordLogin({ userId: user.id });

        // always return api-token on login, this is needed for future requests

        this.session.userId = user.id;
        resultData['api-token'] = utilCrypto.encrypt(JSON.stringify({
            userId: user.id,
            expired: moment(this.session.cookie._expires).unix() // moment().add(30, 'd').unix()
        }));


        if (Object(user).type === type.USER_TYPE.ADMIN) {
            resultData['cms'] = process.env.CMS_PATH
        }

        return this.result(1, resultData);
    }
}