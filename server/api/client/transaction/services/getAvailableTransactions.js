import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllTransactions from '../queries/getAllTransactions';

export default function getAvailableTransactions (req, res) {
    getAllTransactions()
        .then(transactions => {
            const availableTransactions = transactions
                .sort((prev, next) => next.createdAt - prev.createdAt);
            res.status(OKEY_STATUS_CODE).send(availableTransactions);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
