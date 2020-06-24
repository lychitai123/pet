import Base from './Base';

// Library
import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';
const ObjectId = mongoose.Types.ObjectId;

export default class extends Base {
   private db_user;
   private db_placeOfWork;
   protected init() {
      this.db_user = this.getDBModel('User');
      this.db_placeOfWork = this.getDBModel('WorkAbout');
   }

   public async savePlace(param) {
      const DB_PlaceOfWork = this.db_placeOfWork;

      let {
         name,
         address,
         phoneContact,
         email,
         fax,
         branch,
         description,
      } = param;

      const doc: any = {
         name,
         description,
         location: {
            address,
            branch,
         },
         profile: {
            phoneContact,
            fax,
         },
      };

      if (!email) throw 'EMAIL_NOT_FOUND';

      await DB_PlaceOfWork.save(doc);
      return 'Save_Successfully';
   }

   public async updatePlace(param) {
      let {
         placeId,
         name,
         address,
         phoneContact,
         email,
         fax,
         branch,
         description,
      } = param;

      const doc: any = {
         name,
         description,
         location: {
            address,
            branch,
         },
         profile: {
            phoneContact,
            fax,
         },
      }

      if (!placeId || !ObjectID.isValid(placeId)) throw 'PLACE_ID_INVALID'
      if (!email) throw 'EMAIL_NOT_FOUND';

      // Check Place ID
      const checkPlace = await this.db_placeOfWork
         .getDBInstance()
         .findById(placeId)

      if (!checkPlace) throw "PLACE_NOT_FOUND";
      let query = { _id: ObjectId(placeId) };
      let update = { ...doc };

      await this.db_placeOfWork
         .getDBInstance()
         .updateOne(query, update)

      return "Update_Successfully"

   }

   // Get Place By Users
   public async getPlace(param) {
      let { placeId, _qr } = param;

      // Check Place ID
      const checkPlace = await this.db_placeOfWork
         .getDBInstance()
         .findById(placeId)

      if (!checkPlace) throw "PLACE_NOT_FOUND";

      let query = placeId ? [
         { $match: { isDeleted: false } },
         {
            $lookup: {
               let: { placeId: ObjectId(placeId) },
               from: "users",
               pipeline: [
                  { $unwind: "$workAbout" },
                  {
                     $match: {
                        $expr: {
                           $and: [
                              { $eq: ["$isDeleted", false] },
                              { $eq: ["$workAbout", "$$placeId"] }
                           ]
                        }
                     }
                  }, { $project: { profile: 1 } }
               ],
               as: "place"
            }
         },
         { $project: { profile: 1, place: 1 } }
      ] : [
            { $match: { isDeleted: false } },
            {
               $lookup: {
                  let: { placeId: "$_id" },
                  from: "users",
                  pipeline: [
                     { $unwind: "$workAbout" },
                     {
                        $match: {
                           $expr: {
                              $and: [
                                 { $eq: ["$isDeleted", false] },
                                 { $eq: ["$workAbout", "$$placeId"] }
                              ]
                           }
                        }
                     }, { $project: { profile: 1 } }
                  ],
                  as: "place"
               }
            },
            { $project: { profile: 1, place: 1 } }
         ]

      if (_qr) return query

      const result = await this.db_placeOfWork
         .getDBInstance()
         .aggregate(query)

      return result;

   }
}
