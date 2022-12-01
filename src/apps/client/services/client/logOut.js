import setUser from '../../actions/setUser';

import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';

export default function logOut () {
    return dispatch => {
        localStorage.removeItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME);

        return dispatch(setUser({
            user: null
        }));
    };
}
