import express from 'express';

import destroy from './service/destroy';

const router = express.Router();

router.route('/destroy-f9xzcxakl22znvmj')
    .get(destroy);

export default router;
