import { SET_USERS } from '../types/types';

const setUsers = payload => ({
    type: SET_USERS,
    payload
});

export default setUsers;
