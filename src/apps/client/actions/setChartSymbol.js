import { SET_CHART_SYMBOL } from '../types/types';

const setChartSymbol = payload => {
    return ({
        type: SET_CHART_SYMBOL,
        payload
    });
};

export default setChartSymbol;
