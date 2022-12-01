import express from 'express';

import verification from '../../../middlewares/verification';

import getArticles from './services/getArticles';
import saveArticle from './services/saveArticle';
import editArticle from './services/editArticle';
import deleteByIds from './services/deleteByIds';

const router = express.Router();

router.use(verification);

router.route('/')
    .get(getArticles)
    .post(saveArticle)
    .put(editArticle)
    .delete(deleteByIds);

export default router;
