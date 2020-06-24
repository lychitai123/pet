import Base from '../Base';

// Routes
import savePlace from './insertPlace';
import getPlace from './getListPlace'

export default Base.setRouter([
   {
      path: '/insert_place',
      router: savePlace,
      method: 'post',
   },
   {
      path: '/get_place',
      router: getPlace,
      method: 'get',
   },
]);
