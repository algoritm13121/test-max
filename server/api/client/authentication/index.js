import express from 'express';

import logIn from './services/logIn';
import check from './services/checkAuthentication';

const router = express.Router();

router.route('/login')
    .post(logIn);

router.route('/check')
    .get(check);

export default router;
