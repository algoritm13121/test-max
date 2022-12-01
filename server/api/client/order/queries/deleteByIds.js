import Order from '../model';

export default function deleteByIds (ids) {
    return Order.deleteMany({ id: { $in: ids } });
}
