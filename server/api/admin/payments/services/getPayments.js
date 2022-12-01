import getPaymentsQuery from '../queries/getPayments';

import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

export default function getPayments (req, res) {
    getPaymentsQuery()
        .then(payments => {
            res.status(OKEY_STATUS_CODE).send(payments);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
