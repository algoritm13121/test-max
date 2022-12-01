import {
    SET_TIMING_SCALE,
    SET_CHART_LINE,
    SET_CHART_SYMBOL_GROUP,
    SET_CHART_SYMBOL
} from '../types/types';
import { CHART_SYMBOL_GROUPS } from '../../../../server/constants/symbols';
import { CHART_TYPES, CHART_TIMEFRAMES } from '../constants/constants';

const initialState = {
    chartTimeframe: CHART_TIMEFRAMES[0],
    chartType: CHART_TYPES[0],
    chartSymbolGroup: CHART_SYMBOL_GROUPS[0],
    chartSymbol: CHART_SYMBOL_GROUPS[0].symbols[0]
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_TIMING_SCALE:
        return { ...state, chartTimeframe: action.payload };
    case SET_CHART_LINE:
        return { ...state, chartType: action.payload };
    case SET_CHART_SYMBOL_GROUP:
        return { ...state, chartSymbolGroup: action.payload };
    case SET_CHART_SYMBOL:
        return { ...state, chartSymbol: action.payload };
    default:
        return state;
    }
}
