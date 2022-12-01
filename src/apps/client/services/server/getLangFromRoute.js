import setLang from '../../actions/setLang';

import getLangFromRouteUtil from '../../utils/getLangFromRoute';

export default function getLangFromRoute (req) {
    return dispatch => {
        const lang = getLangFromRouteUtil(req.path);

        return Promise.resolve(dispatch(setLang(lang)));
    };
}
