import express from 'express';

import verification from '../../../middlewares/verificationClient';

import saveOrder from './services/saveOrder';
import closeOrder from './services/closeOrder';
import getOrders from './services/getOrders';
import getAllOpenOrders from './services/getAllOpenOrders';

const router = express.Router();

router.use(verification);

router.route('/new')
    .post(saveOrder);

router.route('/all')
    .get(getOrders);

router.route('/all-open')
    .get(getAllOpenOrders);

router.route('/close/:id')
    .get(closeOrder);

router.route('/close-all/:id')
    .get(closeOrder);

export default router;
