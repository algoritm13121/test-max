import {
    SET_LANG,
    SET_LANG_MAP,
    SET_LANG_ROUTE,
    SET_MEDIA_INFO,
    SET_DOMAIN,
    SET_COOKIES_AGREEMENT
} from '../types/types';
import { DEFAULT_LANG_ROUTE } from '../constants/constants';

const initialState = {
    media: {
        width: 0,
        height: 0
    },
    langMap: {},
    langRoute: DEFAULT_LANG_ROUTE,
    cookiesAgreement: false
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_MEDIA_INFO:
        return { ...state, media: action.payload };
    case SET_LANG:
        return { ...state, lang: action.payload };
    case SET_LANG_MAP:
        return { ...state, langMap: action.payload };
    case SET_LANG_ROUTE:
        return { ...state, langRoute: action.payload };
    case SET_DOMAIN:
        return { ...state, domain: action.payload };
    case SET_COOKIES_AGREEMENT:
        return { ...state, cookiesAgreement: action.payload };
    default:
        return state;
    }
}
