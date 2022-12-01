import { SET_AUTHENTICATION_POPUP } from '../types/types';

const setAuthenticationPopup = payload => ({
    type: SET_AUTHENTICATION_POPUP,
    payload
});

export default setAuthenticationPopup;
