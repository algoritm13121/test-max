import { FORBIDDEN_STATUS_CODE } from '../constants/constants';

import verifyTokenAdmin from '../helpers/verifyTokenAdmin';

export default function verification (req, res, next) {
    const { token } = req.query;

    if (token) {
        verifyTokenAdmin(token)
            .then(() => {
                next();
            })
            .catch(() => {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            });
    } else {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }
}
