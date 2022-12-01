import { SET_PAYMENTS } from '../types/types';

const setPayments = payload => ({
    type: SET_PAYMENTS,
    payload
});

export default setPayments;
