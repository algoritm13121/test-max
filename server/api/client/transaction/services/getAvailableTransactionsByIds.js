import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getTransactionsByIds from '../queries/getTransactionsByIds';

export default function getAvailableTransactionsByIds (req, res) {
    const ids = req.body;

    getTransactionsByIds(ids)
        .then(transactions => {
            const availableTransaction = transactions
                .sort((prev, next) => next.createdAt - prev.createdAt);
            res.status(OKEY_STATUS_CODE).send(availableTransaction);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
