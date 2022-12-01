import request from 'superagent';
import base from '../base';

import setUser from '../../actions/setUser';

export default function logIn (credentials) {
    return dispatch => base(
        request
            .post('/api/client/user/update')
            .send(credentials)
    )
        .then(payload => {
            dispatch(setUser(payload.user));
            return payload;
        });
}
