import Base from '../Base';

// Client

// CMS
import insert_profile from './cms/insert_profile';
import view_profile from './cms/view_profile';
import edit_profile from './cms/edit_profile';

export default Base.setRouter([
    {
        path: "/cms/insert_profile",
        router: insert_profile,
        method: "post"
    },
    {
        path: "/cms/view_profile/:userId",
        router: view_profile,
        method: "get"
    },
    {
        path: "/cms/edit_profile/:userId",
        router: edit_profile,
        method: "put"
    }
])