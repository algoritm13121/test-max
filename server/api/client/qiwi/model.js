import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Qiwi = new Schema({
    token: { type: String, required: true },
    createdAt: { type: Number, required: true }
});

export default mongoose.model('Qiwi', Qiwi);
