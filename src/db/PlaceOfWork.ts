import Base from './Base';
import { WorkAbout } from './schema/PlaceOfWork.Schema';

export default class extends Base {
   protected getSchema() {
      return WorkAbout;
   }
   protected getName() {
      return 'WorkAbout';
   }
}
