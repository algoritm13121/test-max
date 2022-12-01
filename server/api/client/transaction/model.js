import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Transaction = new Schema({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    dirName: { type: String, required: false },
    value: { type: Number, required: true },
    type: { type: String, required: true },
    content: { type: String, required: false },
    createdAt: { type: Number }
});

export default mongoose.model('Transaction', Transaction);
