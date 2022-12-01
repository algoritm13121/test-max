import { SET_USER } from '../types/types';

const setUser = payload => ({
    type: SET_USER,
    payload
});

export default setUser;
