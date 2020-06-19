import Base from './Base'
import { UserManage } from './schema/UserManagement';

export default class extends Base {
    protected getSchema() {
        return UserManage
    }
    protected getName() {
        return 'UserManage'
    }
    protected rejectFields() {
        return {
            password: false,
            salt: false
        }
    }
}
