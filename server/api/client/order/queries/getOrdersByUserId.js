import Order from '../model';

export default function getOrdersByUserId (userId) {
    return Order.find({ userId });
}
