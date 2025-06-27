import mongoose from "mongoose";
import { db1, db2 } from "../mongoose/index.js";

const LocationSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    userId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    address: {
        type: String,
        required: [true, "Address is required."]
    },
    pincode: {
        type: Number,
        required: [true, "Pincode is required."]
    },
    country: {
        type: String,
        required: [true, "country is required."]
    },
    city: {
        type: String,
        required: [true, "City is required."]
    },
    state: {
        type: String,
        required: [true, "State is required."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Location = db1.model('Location', LocationSchema);
export default Location;