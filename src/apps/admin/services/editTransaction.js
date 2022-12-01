import request from 'superagent';
import base from './base';
import setUsers from '../actions/setUsers';
import setTransactionsAction from '../actions/setTransactions';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveTransaction ({ transaction, user }) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .put('/api/admin/transaction/edit')
                .send({ transaction, user })
                .query({ token })
        )
            .then(payload => {
                dispatch(setTransactionsAction(payload.transactions));
                dispatch(setUsers(payload.users));
            });
    };
}
