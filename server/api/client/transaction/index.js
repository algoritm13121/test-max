import express from 'express';

import verification from '../../../middlewares/verificationClient';
import getAvailableTransaction from './services/getAvailableTransaction';
import getAvailableTransactions from './services/getAvailableTransactions';
import getAvailableTransactionsByIds from './services/getAvailableTransactionsByIds';

const router = express.Router();

router.use(verification);

router.route('/')
    .get(getAvailableTransaction);

router.route('/all')
    .get(getAvailableTransactions);

router.route('/by-ids')
    .post(getAvailableTransactionsByIds);

export default router;
