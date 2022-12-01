import express from 'express';

import getPayments from './services/getPayments';

const router = express.Router();

router.route('/')
    .get(getPayments);

export default router;
