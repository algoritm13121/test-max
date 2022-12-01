import verifyTokenClient from '../helpers/verifyTokenClient';
import url from 'url';

import { FORBIDDEN_STATUS_CODE, NOT_FOUND_STATUS_CODE } from '../constants/constants';

import getUserByIdQuery from '../api/client/user/queries/getUserById';

export default function verification (req, res, next) {
    const { token } = req.query;

    if (req.originalUrl === '/api/client/order/all-open' || req.originalUrl.match(/\/api\/client\/order\/close-all\/(.*?)/)) {
        return next();
    }

    if (token) {
        verifyTokenClient(token)
            .then(({ id }) => {
                if (!id) {
                    return res.status(FORBIDDEN_STATUS_CODE).end();
                }

                getUserByIdQuery(id)
                    .then(user => {
                        if (!user) {
                            return res.status(NOT_FOUND_STATUS_CODE).end();
                        }

                        res.locals.user = user;
                        next();
                    });
            })
            .catch(() => {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            });
    } else {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }
}
