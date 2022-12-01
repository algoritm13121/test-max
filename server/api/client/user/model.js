import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    balance: { type: Number, required: true },
    mainBalance: { type: Number, required: false },
    password: { type: String, required: false },
    phone: { type: String, required: true },
    date: { type: Number, required: true },
    city: { type: String, required: false },
    address: { type: String, required: false },
    gender: { type: String, required: false },
    country: { type: String, required: false },
    accountNumber: { type: String, required: false },
    accountStatus: { type: String, required: false },
    docs: { type: Object, required: false },
    blocked: { type: Boolean, required: false },
    isActive: { type: String, required: false },
    isVipStatus: { type: Boolean, required: false },
    newPassword: { type: String },
    confirmPassword: { type: String },
    bonuses: { type: Number, required: false },
    credFacilities: { type: Number, required: false },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number }
});

export default mongoose.model('User', User);
