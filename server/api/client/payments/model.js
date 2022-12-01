import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Payments = new Schema({
    qiwi: { type: String, required: true },
    bitcoin: { type: String, required: true },
    gateway: { type: String, required: true }
});

export default mongoose.model('Payments', Payments);
