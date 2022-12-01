import setUser from '../../actions/setUser';
import _uniqBy from 'lodash.uniqby';

export default function autoCloseOrder (payload) {
    return dispatch => {
        if (payload.closedOrdersList.length) {
            payload.closedOrders = _uniqBy(payload.closedOrders.concat(payload.closedOrdersList), (item) => item.id);
            delete payload.closedOrdersList;
        }

        dispatch(setUser(payload));
    };
}
