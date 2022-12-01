import { SET_TRANSACTIONS } from '../types/types';

const setTransactions = payload => ({
    type: SET_TRANSACTIONS,
    payload
});

export default setTransactions;
