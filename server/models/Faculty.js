import mongoose from "mongoose";
import { db1, db2 } from "../mongoose/index.js";

const FacultySchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    userId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    name: {
        type: String,
    },
    designation: {
        type: String,
    },
    department: {
        type: String,
    },
    profile: {
        type: String,
        default: "image.png"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Faculty = db1.model('Faculty', FacultySchema);
export default Faculty;