import { COOKIE_AGREEMENT_NAME } from '../../constants/constants';

import setCookiesAgreement from '../../actions/setCookiesAgreement';

export default function getEvents (req) {
    return dispatch => {
        const agreement = req.cookies[COOKIE_AGREEMENT_NAME];

        return Promise.resolve(dispatch(setCookiesAgreement(!!agreement)));
    };
}
