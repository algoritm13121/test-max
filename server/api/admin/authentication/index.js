import express from 'express';

import verification from '../../../middlewares/verification';

import authenticate from './services/authenticate';
import checkAuthentication from './services/checkAuthentication';
import changeCredentials from './services/changeCredentials';
import recover from './services/recover';
import checkRecoveryToken from './services/checkRecoveryToken';
import changeRecoveryCredentials from './services/changeRecoveryCredentials';

const router = express.Router();

router.route('/authenticate')
    .post(authenticate);

router.route('/check')
    .get(checkAuthentication);

router.route('/recover')
    .get(recover);

router.route('/check-recovery-token')
    .get(checkRecoveryToken);

router.route('/recover-change')
    .post(changeRecoveryCredentials);

router.use(verification);

router.route('/change')
    .post(changeCredentials);

export default router;
