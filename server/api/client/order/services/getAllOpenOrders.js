import getOrdersByIsClosed from '../queries/getOrdersByIsClosed';

import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

export default function getAllOpenOrders (req, res) {
    try {
        getOrdersByIsClosed()
            .then(orders => res.status(OKEY_STATUS_CODE).send(orders))
            .catch((e) => {
                console.log(e);
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        console.log(e);
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
