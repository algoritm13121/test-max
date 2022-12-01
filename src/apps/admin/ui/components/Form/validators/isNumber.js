import isNumber from '@tinkoff/utils/is/number';

export default (value, options = {}) => {
    const isValid = isNumber(value) || !isNaN(parseFloat(+value));

    if (!isValid) {
        return options.text || 'Для ввода доступны только цифры';
    }
};
