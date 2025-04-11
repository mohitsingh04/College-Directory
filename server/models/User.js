import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const UserSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    googleId: String,
    thumbnail: String,
    name: {
        type: String,
        required: [true, "Please provide a user name."]
    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a strong password."]
    },
    phone: {
        type: String,
        unique: true,
    },
    pincode: {
        type: Number,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    role: {
        type: String,
        default: "Property Manager"
    },
    permission: {
        type: Array,
    },
    profile_image: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "Pending"
    },
    otp: {
        type: Number,
    },
    otpExpiresAt: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const User = db1.model('User', UserSchema);
export default User;