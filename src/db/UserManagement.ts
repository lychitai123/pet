import Base from './Base';
import { UserManage } from './schema/UserManagement.Schema';

export default class extends Base {
   protected getSchema() {
      return UserManage;
   }
   protected getName() {
      return 'UserManage';
   }
}
