import express from 'express';

import getAvailableArticles from './services/getAvailableArticles';
import availableArticlesSearch from './services/availableArticlesSearch';

const router = express.Router();

router.route('/')
    .get(getAvailableArticles);

router.route('/search')
    .get(availableArticlesSearch);

export default router;
