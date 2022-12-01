import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getPaymentsQuery from '../queries/getPayments';

export default function getPayments (req, res) {
    try {
        getPaymentsQuery()
            .then(payments => {
                res.status(OKEY_STATUS_CODE).send(payments);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
