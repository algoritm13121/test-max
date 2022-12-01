import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareTransaction from '../utils/prepareTransaction';

import editTransactionQuery from '../../../client/transaction/queries/editTransaction';
import getTransactionById from '../../../client/transaction/queries/getTransactionById';
import editUser from '../../../client/user/queries/editUser';
import checkBalance from '../utils/checkBalance';
import getStatus from '../../../../helpers/getStatus';
import getAllUsers from '../../../client/user/queries/getAllUsers';
import getAllTransactions from '../../../client/transaction/queries/getAllTransactions';
import getUserById from '../../../client/user/queries/getUserById';

export default function editTransaction (req, res) {
    const updatedTransaction = prepareTransaction(req.body.transaction);
    const { user } = req.body;

    getTransactionById(updatedTransaction.id)
        .then(transaction => {
            getUserById(user.id)
                .then(user => {
                    const diff = +updatedTransaction.value - transaction[0].value;
                    const balance = user.balance + diff;
                    const mainBalance = user.mainBalance + diff;
                    const bonuses = user.bonuses + diff;
                    const credFacilities = user.credFacilities + diff;
                    const info = { id: user.id };

                    if (updatedTransaction.type === 'deposit') {
                        info.balance = checkBalance(balance);
                        info.mainBalance = checkBalance(mainBalance);
                    }
                    if (updatedTransaction.type === 'bonuses') {
                        info.bonuses = checkBalance(bonuses);
                    }
                    if (updatedTransaction.type === 'credFacilities') {
                        info.credFacilities = checkBalance(credFacilities);
                    }

                    info.accountStatus = getStatus(info.balance, user.isVipStatus);

                    editTransactionQuery(updatedTransaction)
                        .then(() => {
                            editUser(info)
                                .then(() => {
                                    getAllUsers()
                                        .then((users) => {
                                            getAllTransactions()
                                                .then(transactions => {
                                                    res.status(OKEY_STATUS_CODE).send({ transactions, users });
                                                })
                                                .catch(() => {
                                                    res.status(SERVER_ERROR_STATUS_CODE).end();
                                                });
                                        })
                                        .catch(() => {
                                            res.status(SERVER_ERROR_STATUS_CODE).end();
                                        });
                                })
                                .catch(() => {
                                    res.status(SERVER_ERROR_STATUS_CODE).end();
                                });
                        })
                        .catch(() => {
                            res.status(SERVER_ERROR_STATUS_CODE).end();
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
