import request from 'superagent';
import base from './base';

import setMoneyOutput from '../actions/setMoneyOutput';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getMoneyOutput () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/output')
                .query({ token })
        )
            .then(transactions => {
                return dispatch(setMoneyOutput(transactions));
            });
    };
}
