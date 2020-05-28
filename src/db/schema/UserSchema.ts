import { Schema } from 'mongoose'

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
    postCode: {
        type: String,
        default: ""
    },
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
    },
    personalDescription: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    }
}

export const WorkProject = {
    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    },
    description: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    }
}

export const WorkAbout = {
    company: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    },
    employment: {
        type: String,
        default: ""
    },
    skill: [
        {
            type: String,
            default: ""
        }
    ],
    project: [WorkProject],
    notes: {
        type: String,
        default: ""
    }
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
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role"
    },
    notes: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        required: true
    },
    logins: [Date]
}
