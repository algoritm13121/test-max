import express from 'express';

import verification from '../../../middlewares/verification';

import getUsers from './services/getUsers';
import saveUser from './services/saveUser';
import editUser from './services/editUser';
import deleteByIds from './services/deleteByIds';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getUsers);

router.route('/save')
    .post(saveUser);

router.route('/edit')
    .put(editUser);

router.route('/delete-few')
    .delete(deleteByIds);

export default router;
