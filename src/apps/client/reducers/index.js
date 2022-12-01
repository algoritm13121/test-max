import { combineReducers } from 'redux';

import application from './application';
import charts from './charts';
import data from './data';

const reducers = combineReducers({
    application,
    charts,
    data
});

export default reducers;
