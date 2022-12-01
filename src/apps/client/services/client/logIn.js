import request from 'superagent';
import base from '../base';

import setUser from '../../actions/setUser';

import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';

export default function logIn (credentials) {
    return dispatch => base(
        request
            .post('/api/client/authentication/login')
            .send(credentials)
    )
        .then(payload => {
            localStorage.setItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME, payload.token);
            dispatch(setUser(payload.user));

            return payload;
        });
}
