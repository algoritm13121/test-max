import express from 'express';

import saveUser from './services/saveUser';

import verification from '../../../middlewares/verificationClient';
import editUser from './services/editUser';
import uploadDoc from './services/uploadDoc';
import removeDoc from './services/removeDoc';
import removeOtherDoc from './services/removeOtherDoc';
import resetPassword from './services/resetUserPassword';

const router = express.Router();

router.route('/signup')
    .post(saveUser);

router.route('/reset')
    .post(resetPassword);

router.use(verification);

router.route('/edit')
    .post(editUser);

router.route('/upload-doc')
    .post(uploadDoc);

router.route('/remove-doc')
    .post(removeDoc);

router.route('/remove-other-doc')
    .post(removeOtherDoc);

export default router;
