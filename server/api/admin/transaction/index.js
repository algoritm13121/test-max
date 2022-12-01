import express from 'express';

import verification from '../../../middlewares/verification';

import getTransactions from './services/getTransactions';
import saveTransaction from './services/saveTransaction';
import editTransaction from './services/editTransaction';
import deleteByIds from './services/deleteByIds';

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

export default router;
