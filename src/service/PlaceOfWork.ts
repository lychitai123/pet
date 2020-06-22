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
}
