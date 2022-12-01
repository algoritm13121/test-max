import { LANG_REGEX } from '../constants/constants';

const langsRegex = new RegExp(`^/(${LANG_REGEX})`);

export default function getLangRouteParts (route) {
    return {
        langRoute: (route.match(langsRegex, '') || [''])[0],
        routeWithoutLang: route.replace(langsRegex, '')
    };
}
