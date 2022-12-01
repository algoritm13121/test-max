import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Output = new Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: String, required: true },
    createdAtDate: { type: Number, required: true },
    id: { type: String, required: true },
    visited: { type: Boolean, required: true }
});

export default mongoose.model('Output', Output);
