import Order from '../model';

import { getOptions } from '../../utils/mongo';

export default function getOrdersByInfo (info) {
    const options = getOptions(info);
    info.page ? delete info.page : '';
    info.perPage ? delete info.perPage : '';
    return Order.find(info, null, options);
}
