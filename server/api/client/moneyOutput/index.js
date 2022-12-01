import express from 'express';

import verification from '../../../middlewares/verificationClient';
import saveMoneyOutput from './services/saveMoneyOutput';

const router = express.Router();

router.use(verification);

router.route('/new')
    .post(saveMoneyOutput);

export default router;
