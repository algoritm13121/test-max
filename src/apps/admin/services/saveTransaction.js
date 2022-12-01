import request from 'superagent';
import base from './base';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';
import setUsers from '../actions/setUsers';
import setTransactionsAction from '../actions/setTransactions';

export default function saveTransaction (transaction) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/transaction/save')
                .send(transaction)
                .query({ token })
        )
            .then(payload => {
                dispatch(setTransactionsAction(payload.transactions));
                dispatch(setUsers(payload.users));
            });
    };
}
