const pattern = /^\d+$/;

export default (value, options = {}) => {
    const isValid = pattern.test(value);
    if (!isValid) {
        return options.text;
    } else if (!isValid && value) {
        return options.text;
    }
};
