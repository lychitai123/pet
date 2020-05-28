import {Schema} from 'mongoose'
import {constant} from '../../constant'

export const PictureSchema = {
    thumbUrl: String,
    name: String,
    url: String,
    uid: String
}
