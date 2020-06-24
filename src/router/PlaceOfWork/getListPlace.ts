import Base from '../Base';
import WorkAboutService from '../../service/PlaceOfWork';

export default class extends Base {
    async action() {
        const param = this.getParam();
        const workAbout = this.buildService(WorkAboutService);
        const result = await workAbout.getPlace(param);
        return this.result(1, result);
    }
}