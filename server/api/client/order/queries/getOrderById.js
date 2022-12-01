import Order from '../model';

export default function getOrderById (id) {
    return Order.findOne({ id });
}
