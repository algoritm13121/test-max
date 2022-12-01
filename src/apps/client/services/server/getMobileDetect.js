import device from 'device';

import setMediaInfo from '../../actions/setMediaInfo';

export default function getLangFromCookie ({ headers = {} } = {}) {
    return dispatch => {
        const deviceType = device(headers['user-agent']).type;
        let media;

        switch (deviceType) {
        case 'desktop':
            media = {
                phoneS: false,
                phoneL: false,
                phone: false,
                tablet: false,
                tabletS: false,
                tabletL: false,
                mobile: false,
                desktop: true,
                desktopS: true,
                desktopM: true,
                desktopL: true,
                desktopXL: true,
                width: 1024,
                height: 768
            };
            break;
        case 'tablet':
            media = {
                phoneS: false,
                phoneL: false,
                phone: false,
                tablet: true,
                tabletS: true,
                tabletL: true,
                mobile: true,
                desktop: false,
                desktopS: false,
                desktopM: false,
                desktopL: false,
                desktopXL: false,
                width: 768,
                height: 1024
            };
            break;
        case 'phone':
            media = {
                phoneS: true,
                phoneL: true,
                phone: true,
                tablet: false,
                tabletS: false,
                tabletL: false,
                mobile: true,
                desktop: false,
                desktopS: false,
                desktopM: false,
                desktopL: false,
                desktopXL: false,
                width: 375,
                height: 667
            };
            break;
        default:
            media = {
                phoneS: false,
                phoneL: false,
                phone: false,
                tablet: false,
                tabletS: false,
                tabletL: false,
                mobile: false,
                desktop: true,
                desktopS: true,
                desktopM: true,
                desktopL: true,
                desktopXL: true,
                width: 1024,
                height: 768
            };
        }

        return Promise.resolve(dispatch(setMediaInfo(media)));
    };
}
