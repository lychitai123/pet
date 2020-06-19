import Base from './Base';

// Library
import * as mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId

export default class extends Base {

    private db_user;
    private db_user_manage

    protected init() {
        this.db_user = this.getDBModel('User');
        this.db_user_manage = this.getDBModel('UserManage')
    }

    
}