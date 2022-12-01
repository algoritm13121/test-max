import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllOrders from '../../../client/order/queries/getAllOrders';
import deleteByIdsQuery from '../../../client/order/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllOrders()
                .then(order => {
                    res.status(OKEY_STATUS_CODE).send(order);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
