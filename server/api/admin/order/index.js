import express from 'express';

import verification from '../../../middlewares/verification';

import getTransactions from './services/getOrders';
import saveTransaction from './services/saveOrder';
import editTransaction from './services/editOrder';
import deleteByIds from './services/deleteByIds';
import closeOrder from './services/closeOrder';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getTransactions);

router.route('/save')
    .post(saveTransaction);

router.route('/edit')
    .put(editTransaction);

router.route('/delete-few')
    .delete(deleteByIds);

router.route('/close')
    .put(closeOrder);

export default router;
