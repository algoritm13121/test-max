import request from 'superagent';
import base from './base';

import setMoneyOutput from '../actions/setMoneyOutput';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function deleteOutput (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .delete('/api/admin/output/delete')
                .send({ ids })
                .query({ token })
        )
            .then(outputs => {
                return dispatch(setMoneyOutput(outputs));
            });
    };
}
