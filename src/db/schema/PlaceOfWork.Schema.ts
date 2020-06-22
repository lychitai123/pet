import { Schema } from 'mongoose';

export const Location = {
   city: {
      type: String,
      default: '',
   },
   province: {
      type: String,
      default: '',
   },
   ward: {
      type: String,
      default: '',
   },
   country: {
      type: String,
      default: '',
   },
   branch: [
      {
         type: String,
         default: '',
      },
   ],
   street: {
      type: String,
      default: '',
   },
   address: {
      type: String,
      default: '',
   },
};

export const Profile = {
   phoneContact: {
      type: String,
      default: '',
   },
   email: {
      type: String,
      default: '',
   },
   classmate: {
      type: String,
      default: '',
   },
   fax: {
      type: String,
      default: '',
   },
};

export const PlaceOfWork = {
   name: {
      type: String,
      default: '',
   },
   description: {
      type: String,
      default: '',
   },
   isDeleted: {
      type: Boolean,
      default: false,
   },
   location: Location,
   profile: Profile,
};
