import { Schema } from 'mongoose'
import { CommentSchema } from './CommentSchema'
import { SubscriberSchema } from './SubscriberSchema'

export const Region = {
    country: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
}

export const Contact = {
    type: Map,
    of: String
}

export const Profile = {
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    fullName: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"],
        default: "MALE"
    },
    birth: {
        type: Date,
        default: ""
    },
    region: Region,
    phone: {
        type: String,
        default: ""
    }
}

export const WorkProject = {
    startTime: Date,
    endTime: Date,
    description: String,
    name: String
}

export const WorkAbout = {
    status: String, // employed, student, etc
    employment: String, // company if employed / school if student
    skill: [String],
    project: [WorkProject],
    resume: String,

    notes: String // private internal notes visible only to admin/council
}

// amount is ELA * 1000
export const ELA = {
    address: String,
    amount: Schema.Types.Number
}

export const VotePower = {
    amount: Number,
    expired: Date
}

const did = {
    id: String,
    expirationDate: Date,
    active: Boolean,
    mark: Boolean,
    _id: false
}

export const User = {
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    // let's keep this on the root object
    email: {
        type: String,
        default: "",
        required: true
    },
    profile: Profile,
    defaultLanguage: String,
    workAbout: WorkAbout,

    // resetToken, ensure this is never returned
    resetToken: String,

    // constants.USER_ROLE
    role: String,
    notes: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: false
    },
    logins: [Date]
}
