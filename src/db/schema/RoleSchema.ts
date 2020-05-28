import { Schema } from 'mongoose'

export const Role = {
    name: {
      type: String,
      uppercase: true,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    permissions: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  };