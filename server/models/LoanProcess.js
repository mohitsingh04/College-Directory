import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const LoanProcessSchema = new mongoose.Schema({
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

const LoanProcess = db1.model('LoanProcess', LoanProcessSchema);
export default LoanProcess;