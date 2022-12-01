import request from 'superagent';
import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';
import base from '../base';

import setUser from '../../actions/setUser';

export default function editUser (user) {
    const token = localStorage.getItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME);

    return (dispatch) => base(
        request
            .post('/api/client/user/edit')
            .query({ token })
            .send(user)
    ).then(payload => {
        return dispatch(setUser({ user: payload }));
    });
}
