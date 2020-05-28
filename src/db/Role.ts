import Base from './Base'
import {Role} from './schema/RoleSchema'

export default class extends Base {
    protected getSchema(){
        return Role
    }
    protected getName(){
        return 'role'
    }
}