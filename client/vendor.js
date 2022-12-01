import '../utils/polyfill';

import '../node_modules/react-datepicker/dist/react-datepicker.css';

import smoothscroll from 'smoothscroll-polyfill';

if (typeof window !== 'undefined') {
    smoothscroll.polyfill();
}
