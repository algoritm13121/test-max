import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareOrder from '../utils/prepareOrder';

import saveOrderQuery from '../../../client/order/queries/saveOrder';

export default function saveOrder (req, res) {
    const order = prepareOrder(req.body);
    const id = uniqid();

    saveOrderQuery({ ...order, id, createdAt: Date.now() })
        .then(order => {
            res.status(OKEY_STATUS_CODE).send(order);
        })
        .catch((e) => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
