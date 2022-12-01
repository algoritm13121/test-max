import Order from '../model';

export default function saveOrder (order) {
    return Order.create(order);
}
