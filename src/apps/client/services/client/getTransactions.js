import request from 'superagent';
import base from '../base';

import setTransactions from '../../actions/setTransactions';

export default function getTransactions () {
    return dispatch => {
        return base(
            request
                .get('/api/client/transaction/all')
        )
            .then(transactions => {
                dispatch(setTransactions(transactions));
            })
            .catch((e) => {
                return dispatch(setTransactions([]));
            });
    };
}
