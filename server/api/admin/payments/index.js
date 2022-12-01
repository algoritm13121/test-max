import express from 'express';

import verification from '../../../middlewares/verification';

import getPayments from './services/getPayments';
import updatePayments from './services/updatePayments';

const router = express.Router();

router.use(verification);

router.route('/')
    .get(getPayments);

router.route('/update')
    .put(updatePayments);

export default router;
