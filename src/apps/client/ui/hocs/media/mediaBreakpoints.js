import bp from '../../../constants/bp';

export default {
    phoneS: `(max-width: ${bp.PHONE_S}px)`,
    phoneL: `(min-width: ${bp.PHONE_L}px) and (max-width: ${bp.PHONE}px)`,
    phone: `(max-width: ${bp.PHONE}px)`,
    tablet: `(min-width: ${bp.TABLET_S}px) and (max-width: ${bp.MOBILE}px)`,
    tabletS: `(min-width: ${bp.TABLET_S}px) and (max-width: ${bp.TABLET_L}px)`,
    tabletL: `(min-width: ${bp.TABLET_L}px) and (max-width: ${bp.MOBILE}px)`,
    mobile: `(max-width: ${bp.MOBILE}px)`,
    desktop: `(min-width: ${bp.DESKTOP_S}px)`,
    desktopS: `(min-width: ${bp.DESKTOP_S}px) and (max-width: ${bp.DESKTOP_M}px)`,
    desktopM: `(min-width: ${bp.DESKTOP_M}px) and (max-width: ${bp.DESKTOP_L}px)`,
    desktopL: `(min-width: ${bp.DESKTOP_L}px) and (max-width: ${bp.DESKTOP_XL}px)`,
    desktopXL: `(min-width: ${bp.DESKTOP_XL}px)`,
    fullScreen: '(display-mode: fullscreen)',
    retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
    smallHeight: '(max-height: 480px)'
};
