import Base from '../Base';

// Routes
import savePlace from './insertPlace';

export default Base.setRouter([
   {
      path: '/insert_place',
      router: savePlace,
      method: 'post',
   },
]);
