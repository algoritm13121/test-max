import express from 'express';

import verification from '../../../middlewares/verificationClient';
import getHistory from './services/getHistory';
import editHistory from './services/editHistory';

const router = express.Router();

router.use(verification);

router.route('/history')
    .get(getHistory);

router.route('/visit')
    .put(editHistory);

export default router;
