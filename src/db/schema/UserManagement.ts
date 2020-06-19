import { Schema } from 'mongoose';


export const UserManage = {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        default: ""
    },
    aprovalTime: {
        type: Date,
        default: null
    },
    leavingTime: {
        type: Date,
        default: null
    },
    location: [{
        type: String,
        default: ""
    }],
    company: {
        type: String,
        default: ""
    }
}