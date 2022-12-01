import mongoose from 'mongoose';

import { ordersEvents } from '../../../controllers/ordersController';

const Schema = mongoose.Schema;

const Order = new Schema({
    id: { type: String, required: true, unique: true },
    assetName: { type: String, required: true },
    amount: { type: Number, required: true },
    pledge: { type: Number, required: true },
    openingPrice: { type: Number, required: true },
    type: { type: String, required: true, enum: ['buy', 'sell'] },
    userId: { type: String, required: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number },
    isClosed: { type: Boolean, required: true },
    closedAt: { type: Number },
    closedPrice: { type: Number },
    takeProfit: { type: Number },
    stopLoss: { type: Number },
    autoClose: { type: Boolean }
});

Order.post('save', () => ordersEvents.emit('dbUpdate'));
Order.post('findOneAndUpdate', () => ordersEvents.emit('dbUpdate'));

export default mongoose.model('Order', Order);
