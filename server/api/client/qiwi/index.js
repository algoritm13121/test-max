import express from 'express';

import getPayUrl from './service/getPayUrl';

const router = express.Router();

router.route('/url')
    .post(getPayUrl);

export default router;
