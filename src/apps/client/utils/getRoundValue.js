export default (value, roundedValue) => {
    return Math.round((value) * 10 ** roundedValue) / 10 ** roundedValue;
};
