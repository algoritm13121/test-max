import express from 'express';

import verification from '../../../middlewares/verification';
import getHistory from './services/getHistory';
import getUnvisitedHistory from './services/getUnvisitedHistory';
import editHistory from './services/editHistory';

const router = express.Router();

router.use(verification);

router.route('/history')
    .get(getHistory);

router.route('/unvisited')
    .get(getUnvisitedHistory);

router.route('/visit')
    .put(editHistory);

export default router;
