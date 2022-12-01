import request from 'superagent';
import base from '../base';

import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';
import setUser from '../../actions/setUser';

export default function authenticate () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME);

        base(
            request
                .get('/api/client/authentication/check')
                .query({ token })
        )
            .then(payload => {
                return dispatch(setUser(payload));
            });
    };
}
