import Base from '../Base';
import PlaceOfWorkService from '../../service/PlaceOfWork';

export default class extends Base {
   async action() {
      const param = this.getParam();
      const placeOfWork = this.buildService(PlaceOfWorkService);
      const result = await placeOfWork.savePlace(param);
      return this.result(1, result);
   }
}
