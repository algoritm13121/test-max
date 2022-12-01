import trim from '@tinkoff/utils/string/trim';
import cond from '@tinkoff/utils/function/cond';
import T from '@tinkoff/utils/function/T';

import isString from '@tinkoff/utils/is/string';
import isNumber from '@tinkoff/utils/is/number';

const isEmptyValue = cond([
    [isString, value => !trim(value)],
    [isNumber, value => isNaN(value)],
    [T, value => !value]
]);

export default function required (value, options = {}) {
    const isValid = !isEmptyValue(value);

    if (!isValid) {
        return options.text;
    }
}
