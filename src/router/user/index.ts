import Base from '../Base';

// Client

// CMS
import insert_profile from './cms/insert_profile';

export default Base.setRouter([
    {
        path: "/cms/insert_profile",
        router: insert_profile,
        method: "post"
    }
])