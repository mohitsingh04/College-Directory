import mongoose from "mongoose";
import { db1, db2 } from "../mongoose/index.js";

const EnquirySchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile_no: {
        type: String,
    },
    city: {
        type: String,
    },
    course: {
        type: String,
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Enquiry = db1.model('Enquiry', EnquirySchema);
export default Enquiry;