import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import saveTransactionQuery from '../../../client/transaction/queries/saveTransaction';
import editUserQuery from '../../../client/user/queries/editUser';
import getStatus from '../../../../helpers/getStatus';
import checkBalance from '../../../admin/transaction/utils/checkBalance';
import getAllTransactionsByUserId from '../queries/getTransactionsByUserId';

export default function saveTransaction (req, res) {
    try {
        const id = uniqid();
        const { amount } = req.body;
        const { id: userId } = res.locals.user;
        const { user } = res.locals;

        saveTransactionQuery({ value: -amount, userId, id, createdAt: Date.now(), content: 'Вывод' })
            .then(transaction => {
                const balance = user.balance;

                user.balance = checkBalance(balance + transaction.value);
                user.accountStatus = getStatus(checkBalance(user.balance, user.isVipStatus));

                editUserQuery(user)
                    .then((user) => {
                        getAllTransactionsByUserId(userId)
                            .then(transactions => {
                                res.status(OKEY_STATUS_CODE).send({ user, transactions });
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
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
