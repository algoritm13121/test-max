import request from 'superagent';
import base from './base';

import setOrdersAction from '../actions/setOrders';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveOrder (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .delete('/api/admin/order/delete-few')
                .send({ ids })
                .query({ token })
        )
            .then(orders => {
                return dispatch(setOrdersAction(orders));
            });
    };
}
