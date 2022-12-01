import { AMOUNT } from '../constants/constants';

export default function (balance, vip) {
    if (vip) {
        return AMOUNT[3].name;
    }

    return balance >= AMOUNT[2].value
        ? AMOUNT[2].name
        : balance >= AMOUNT[1].value
            ? AMOUNT[1].name
            : balance >= AMOUNT[0].value
                ? AMOUNT[0].name
                : '';
}
