import { SET_FILTERED_PRODUCTS } from '../types/types';

const setFilteredProducts = payload => ({
    type: SET_FILTERED_PRODUCTS,
    payload
});

export default setFilteredProducts;
