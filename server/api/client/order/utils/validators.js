import isUndefined from '@tinkoff/utils/is/undefined';
import includes from '@tinkoff/utils/array/includes';

export const requiredValidator = value => !isUndefined(value);

export const typeValidator = value => {
    return includes(value, ['buy', 'sell']);
};
