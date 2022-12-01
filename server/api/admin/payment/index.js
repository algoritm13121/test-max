import express from 'express';

import verification from '../../../middlewares/verification';

import getPayments from './services/getPayments';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getPayments);

export default router;
