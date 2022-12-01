import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllArticles from '../../../client/article/queries/getAllArticles';
import deleteByIdsQuery from '../../../client/article/queries/deleteByIds';
import getArticlesByIds from '../../../client/article/queries/getArticlesByIds';
import removeFilesDir from '../../files/utils/removeFilesDir';

export default function deleteByIds (req, res) {
    try {
        const { ids } = req.body;

        getArticlesByIds(ids)
            .then((articles) => {
                articles.forEach(({ dirName }) => {
                    removeFilesDir(dirName);
                });

                return deleteByIdsQuery(ids)
                    .then(() => {
                        getAllArticles()
                            .then(articles => {
                                res.status(OKEY_STATUS_CODE).send(articles);
                            });
                    });
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
