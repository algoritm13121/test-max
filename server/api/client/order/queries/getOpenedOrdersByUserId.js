import Order from '../model';

export default function getOpenedOrdersByUserId (userId) {
    return Order.find({ isClosed: false, userId });
}
