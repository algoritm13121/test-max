import request from 'superagent';
import base from '../base';

import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';

import setUser from '../../actions/setUser';

export default function uploadDoc (file) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/client/user/upload-doc')
                .query({ token })
                .send(file)
        )
            .then(payload => {
                return dispatch(setUser(payload));
            });
    };
}
