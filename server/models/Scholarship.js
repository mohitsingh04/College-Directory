import mongoose from "mongoose";
import { db1, db2 } from "../mongoose/index.js";

const ScholarshipSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    userId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    scholarship: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Scholarship = db1.model('Scholarship', ScholarshipSchema);
export default Scholarship;