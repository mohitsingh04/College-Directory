import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const RoleSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    name: {
        type: String,
        required: [true, "Please provide a name."]
    },
    status: {
        type: String,
        required: [true, "Please provide a status."]
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

const Role = db1.model('Role', RoleSchema);
export default Role;