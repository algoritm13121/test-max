import request from 'superagent';
import base from './base';

import setTransactionsAction from '../actions/setTransactions';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getTransactions () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/transaction/all')
                .query({ token })
        )
            .then(transactions => {
                return dispatch(setTransactionsAction(transactions));
            });
    };
}
