import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllTransactions from '../../../client/transaction/queries/getAllTransactions';

export default function getTransactions (req, res) {
    getAllTransactions()
        .then(transactions => {
            res.status(OKEY_STATUS_CODE).send(transactions.sort((prev, next) => next.createdAt - prev.createdAt));
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
