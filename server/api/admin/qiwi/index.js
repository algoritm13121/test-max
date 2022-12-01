import express from 'express';

import verification from '../../../middlewares/verification';

import saveToken from './service/saveToken';
import getToken from './service/getToken';

const router = express.Router();

router.use(verification);

router.route('/token')
    .get(getToken);

router.route('/token-save')
    .get(saveToken);

export default router;
