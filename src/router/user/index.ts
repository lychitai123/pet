import Base from '../Base';

// Login
import login from './cms/login';
// CMS
import insert_profile from './cms/insert_profile';
import view_profile from './cms/view_profile';
import edit_profile from './cms/edit_profile';

// Camera Ricoh
import getListUserRC from './cms/camera/getListUser'

export default Base.setRouter([
    {
        path: "/login",
        router: login,
        method: "post"
    },
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
    },

    // ======= Ricoh ========= //
    {
        path: "/ricoh/get_list_user",
        router: getListUserRC,
        method: "get"
    }
])