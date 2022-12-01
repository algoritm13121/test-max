import request from 'superagent';
import base from './base';

import setTransactionsAction from '../actions/setTransactions';
import setUsers from '../actions/setUsers';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveTransaction ({ transaction: ids, user }) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .delete('/api/admin/transaction/delete-few')
                .send({ ids, user })
                .query({ token })
        )
            .then(payload => {
                dispatch(setTransactionsAction(payload.transactions));
                dispatch(setUsers(payload.users));
            });
    };
}
