import request from 'superagent';
import base from '../base';
import _uniqBy from 'lodash.uniqby';

import setUser from '../../actions/setUser';
import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';

export default function closeOrder ({ id, closedOrdersList }) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME);

        return base(
            request
                .get(`/api/client/order/close/${id}`)
                .query({ token })
        )
            .then(payload => {
                if (closedOrdersList.length) {
                    payload.closedOrders = _uniqBy(payload.closedOrders.concat(closedOrdersList), (item) => item.id);
                }

                console.log('payload', payload);

                dispatch(setUser(payload));
            });
    };
}
