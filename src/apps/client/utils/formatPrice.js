import numeral from 'numeral';

export default number => {
    return +numeral(number).format('0.000000');
};
