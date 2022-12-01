import getOrdersByInfo from '../queries/getOrdersByInfo';
import Order from '../model';

import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

export default function getOrders (req, res) {
    try {
        (async () => {
            const { id } = res.locals.user;
            const { page, perPage } = req.query;
            const openOrders = await getOrdersByInfo({ userId: id, isClosed: false });
            const closedOrders = await getOrdersByInfo({ userId: id, page, perPage, isClosed: true });
            const countClosedOrders = await Order.countDocuments({ userId: id, isClosed: true });

            res.status(OKEY_STATUS_CODE).send({ openOrders, closedOrders, countClosedOrders });
        })();
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
