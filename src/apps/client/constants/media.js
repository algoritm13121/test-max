const bp = require('./bp');

module.exports = {
    '--media-phone-s': `(max-width: ${bp.PHONE_S}px)`,
    '--media-phone': `(max-width: ${bp.PHONE}px)`,
    '--media-only-tablet': `(min-width: ${bp.TABLET_S}px) and (max-width: ${bp.MOBILE}px)`,
    '--media-tablet-s': `(max-width: ${bp.TABLET_L}px)`,
    '--media-tablet-l': `(max-width: ${bp.MOBILE}px)`,
    '--media-mobile': `(max-width: ${bp.MOBILE}px)`,
    '--media-desktop': `(min-width: ${bp.DESKTOP_S}px)`,
    '--media-desktop-s': `(min-width: ${bp.DESKTOP_S}px)`,
    '--media-desktop-m': `(min-width: ${bp.DESKTOP_M}px)`,
    '--media-desktop-l': `(min-width: ${bp.DESKTOP_L}px)`,
    '--media-desktop-xl': `(min-width: ${bp.DESKTOP_XL}px)`
};
