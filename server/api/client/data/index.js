import express from 'express';

import getPrices from './services/getPrices';

const router = express.Router();

router.route('/prices')
    .get(getPrices);

export default router;
