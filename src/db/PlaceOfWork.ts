import Base from './Base';
import { PlaceOfWork } from './schema/PlaceOfWork.Schema';

export default class extends Base {
   protected getSchema() {
      return PlaceOfWork;
   }
   protected getName() {
      return 'PlaceOfWork';
   }
}
