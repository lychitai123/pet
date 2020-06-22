import Base from '../../../Base';
import UserService from '../../../../service/UserService';

export default class extends Base {
    async action() {
        const param = this.getParam();
        const userService = this.buildService(UserService);
        const result = await userService.getListUser(param);
        return this.result(1, result)
    }
}