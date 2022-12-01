import request from 'superagent';
import base from './base';

import setUsersAction from '../actions/setUsers';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveProduct (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .delete('/api/admin/user/delete-few')
                .send({ ids })
                .query({ token })
        )
            .then(users => {
                return dispatch(setUsersAction(users));
            });
    };
}
