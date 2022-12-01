import { BAD_REQUEST_STATUS_CODE, OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getStatus from '../../../../helpers/getStatus';

import deleteByIdsQuery from '../../../client/transaction/queries/deleteByIds';
import getTransactionsByIds from '../../../client/transaction/queries/getTransactionsByIds';
import getAllTransactions from '../../../client/transaction/queries/getAllTransactions';

import editUser from '../../../client/user/queries/editUser';
import getAllUsers from '../../../client/user/queries/getAllUsers';

export default function deleteByIds (req, res) {
    const { ids, user } = req.body;

    getTransactionsByIds(ids)
        .then(transactions => {
            const transactionsByType = {};
            for (const transaction of transactions) {
                !transactionsByType[transaction.type]
                    ? transactionsByType[transaction.type] = transaction.value : transactionsByType[transaction.type] += transaction.value;
            }

            if (user.balance > 0 && transactionsByType.deposit && transactionsByType.deposit > 0) {
                user.balance -= transactionsByType.deposit;
            }
            if (user.mainBalance > 0 && transactionsByType.deposit && transactionsByType.deposit > 0) {
                user.mainBalance -= transactionsByType.deposit;
            }
            if (user.bonuses > 0 && transactionsByType.bonuses && transactionsByType.bonuses > 0) {
                user.bonuses -= transactionsByType.bonuses;
            }
            if (user.credFacilities > 0 && transactionsByType.credFacilities && transactionsByType.credFacilities > 0) {
                user.credFacilities -= transactionsByType.credFacilities;
            }

            if ((user.balance < 0 || user.mainBalance < 0 || user.bonuses < 0 || user.credFacilities < 0)) {
                return res.status(BAD_REQUEST_STATUS_CODE).send({ error: 'Значение не может быть отрицательным' });
            }

            user.accountStatus = getStatus(user.balance, user.isVipStatus);

            deleteByIdsQuery(ids)
                .then(() => {
                    console.log('save', {
                        id: user.id,
                        balance: user.balance,
                        mainBalance: user.mainBalance,
                        accountStatus: user.accountStatus,
                        bonuses: user.bonuses,
                        credFacilities: user.credFacilities
                    });
                    editUser({
                        id: user.id,
                        balance: user.balance,
                        mainBalance: user.mainBalance,
                        accountStatus: user.accountStatus,
                        bonuses: user.bonuses,
                        credFacilities: user.credFacilities
                    })
                        .then(() => {
                            getAllUsers()
                                .then(users => {
                                    getAllTransactions()
                                        .then(transactions => {
                                            res.status(OKEY_STATUS_CODE).send({ transactions, users });
                                        });
                                })
                                .catch(() => {
                                    res.status(SERVER_ERROR_STATUS_CODE).end();
                                });
                        });
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
