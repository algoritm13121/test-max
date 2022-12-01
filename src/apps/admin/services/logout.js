import authenticateAction from '../actions/authenticate';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function logout () {
    return dispatch => {
        localStorage.setItem(TOKEN_LOCAL_STORAGE_NAME, '');

        return dispatch(authenticateAction(false));
    };
}
