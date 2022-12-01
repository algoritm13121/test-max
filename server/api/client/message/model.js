import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Message = new Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Number, required: true },
    visited: { type: Boolean, required: true }
});

export default mongoose.model('Message', Message);
