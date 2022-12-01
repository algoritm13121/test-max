import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareTransaction from '../utils/prepareTransaction';

import saveTransactionQuery from '../../../client/transaction/queries/saveTransaction';
import getUserByIdQuery from '../../../client/user/queries/getUserById';
import editUserQuery from '../../../client/user/queries/editUser';
import getAllUsers from '../../../client/user/queries/getAllUsers';
import getStatus from '../../../../helpers/getStatus';
import checkBalance from '../utils/checkBalance';
import getAllTransactions from '../../../client/transaction/queries/getAllTransactions';

export default function saveTransaction (req, res) {
    const transaction = prepareTransaction(req.body);
    const id = uniqid();

    saveTransactionQuery({ ...transaction, id, createdAt: Date.now() })
        .then(transaction => {
            getUserByIdQuery(transaction.userId)
                .then(user => {
                    const balance = user.balance;
                    const bonuses = user.bonuses || 0;
                    const credFacilities = user.credFacilities || 0;
                    const mainBalance = user.mainBalance || 0;

                    const info = { id: user.id };
                    if (transaction.type === 'deposit') {
                        info.balance = checkBalance(balance + transaction.value);
                        info.mainBalance = checkBalance(mainBalance + transaction.value);
                    }
                    if (transaction.type === 'bonuses') {
                        info.bonuses = checkBalance(bonuses + transaction.value);
                    }
                    if (transaction.type === 'credFacilities') {
                        info.credFacilities = checkBalance(credFacilities + transaction.value);
                    }

                    info.accountStatus = getStatus(checkBalance(user.balance, user.isVipStatus));

                    editUserQuery(info)
                        .then(() => {
                            getAllUsers()
                                .then(users => {
                                    getAllTransactions()
                                        .then(transactions => {
                                            res.status(OKEY_STATUS_CODE).send({ users, transactions });
                                        });
                                })
                                .catch(() => {
                                    res.status(SERVER_ERROR_STATUS_CODE).end();
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
}
