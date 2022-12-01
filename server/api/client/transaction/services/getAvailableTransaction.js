import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getTransactionById from '../queries/getTransactionById';
import editTransaction from '../queries/editTransaction';

import getTransactionValues from '../utils/getTransactionValues';

export default function getAvailableTransaction (req, res) {
    const { id } = req.query;

    getTransactionById(id)
        .then(([transaction]) => {
            if (!transaction) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            editTransaction(transaction)
                .then((transaction) => {
                    res.status(OKEY_STATUS_CODE).send(...getTransactionValues(transaction));
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
