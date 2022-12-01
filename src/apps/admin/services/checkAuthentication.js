import request from 'superagent';
import base from './base';

import authenticateAction from '../actions/authenticate';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function authenticate () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        base(
            request
                .get('/api/admin/authentication/check')
                .query({ token })
        )
            .then(() => {
                return dispatch(authenticateAction(true));
            })
            .catch(() => {
                return dispatch(authenticateAction(false));
            });
    };
}
