import mongoose from "mongoose";
import { db1, db2 } from "../mongoose/index.js";

const HostelSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    userId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    boys_hostel_fees: {
        type: String,
    },
    boys_hostel_description: {
        type: String,
    },
    girls_hostel_fees: {
        type: String,
    },
    girls_hostel_description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Hostel = db1.model('Hostel', HostelSchema);
export default Hostel;