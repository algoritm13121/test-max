import express from 'express';

import verification from '../../../middlewares/verification';

import getMoneyOutput from './services/getMoneyOutput';
import editMoneyOutput from './services/editMoneyOutput';
import getUnvisitedMoneyOutput from './services/getUnvisitedMoneyOutput';
import deleteMoneyOutput from './services/deleteByIds';

const router = express.Router();

router.use(verification);

router.route('/')
    .get(getMoneyOutput);

router.route('/unvisited')
    .get(getUnvisitedMoneyOutput);

router.route('/edit')
    .put(editMoneyOutput);

router.route('/delete')
    .delete(deleteMoneyOutput);

export default router;
