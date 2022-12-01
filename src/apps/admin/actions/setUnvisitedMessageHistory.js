import { SET_UNVISITED_MESSAGE_HISTORY } from '../types/types';

const setUnvisitedMessageHistory = payload => ({
    type: SET_UNVISITED_MESSAGE_HISTORY,
    payload
});

export default setUnvisitedMessageHistory;
