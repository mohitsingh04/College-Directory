import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const AdmissionProcessSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    userId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    process: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AdmissionProcess = db1.model('AdmissionProcess', AdmissionProcessSchema);
export default AdmissionProcess;