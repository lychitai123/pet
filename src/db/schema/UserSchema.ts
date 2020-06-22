import { Schema } from 'mongoose';

export const Region = {
   country: {
      type: String,
      default: '',
   },
   state: {
      type: String,
      default: '',
   },
   city: {
      type: String,
      default: '',
   },
   postCode: {
      type: String,
      default: '',
   },
};

export const Profile = {
   firstName: {
      type: String,
      default: '',
   },
   lastName: {
      type: String,
      default: '',
   },
   fullName: {
      type: String,
      default: '',
   },
   avatar: {
      type: String,
      default: '',
   },
   gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
      default: 'MALE',
   },
   birth: {
      type: Date,
      default: '',
   },
   phone: {
      type: String,
      default: '',
   },
   address: {
      type: String,
      default: '',
   },
   parentsName: {
      type: String,
      default: '',
   },
};

export const WorkProject = {
   startTime: {
      type: Date,
      default: null,
   },
   endTime: {
      type: Date,
      default: null,
   },
   description: {
      type: String,
      default: '',
   },
   name: {
      type: String,
      default: '',
   },
};

export const User = {
   username: {
      type: String,
      required: true,
      index: true,
   },
   password: {
      type: String,
      required: true,
   },
   salt: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      default: '',
      required: true,
   },
   // let's keep this on the root object
   profile: Profile,
   defaultLanguage: {
      type: String,
      default: '',
   },
   workAbout: [
      {
         type: Schema.Types.ObjectId,
         ref: 'PlaceOfWork',
         index: true,
      },
   ],
   // resetToken, ensure this is never returned
   resetToken: String,
   role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      index: true,
   },
   notes: {
      type: String,
      default: '',
   },
   type: {
      type: String,
      required: true,
   },
   logins: [Date],
   isDeleted: {
      type: Boolean,
      default: false,
   },
   region: Region,
};
