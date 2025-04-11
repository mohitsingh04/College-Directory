import mongoose from "mongoose";
import { db1, db2 } from "../mongoose/index.js";

const StatusSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    status_name: {
        type: String,
        required: [true, "Please provide a status name."]
    },
    parent_status: {
        type: String,
        required: [true, "Please provide a parent status."]
    },
    description: {
        type: String,
        required: [true, "Please provide a description."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Status = db1.model('Status', StatusSchema);
export default Status;