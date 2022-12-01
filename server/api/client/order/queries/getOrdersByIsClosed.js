import Order from '../model';

export default function getOrdersByUserId () {
    return Order.find({ isClosed: false, autoClose: true });
}
