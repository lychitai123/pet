import Base from '../Base';

// Routes
import view_base from './view_base';
import insert_base from './insert';
import update_base from './update';

export default Base.setRouter([
    {
        path: "/view_base/:_id",
        router: view_base,
        method: "get"
    },
    {
        path: "/insert_base",
        router: insert_base,
        method: "post"
    },
    {
        path: "/update_base/:_id",
        router: update_base,
        method: "put"
    },
])