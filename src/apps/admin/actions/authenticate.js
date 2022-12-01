import { SET_AUTHENTICATED } from '../types/types';

const authenticate = payload => ({
    type: SET_AUTHENTICATED,
    payload
});

export default authenticate;
