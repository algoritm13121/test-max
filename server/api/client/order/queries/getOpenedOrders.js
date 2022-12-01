import Order from '../model';

export default function getOpenedOrders () {
    return Order.find({ isClosed: false });
}
