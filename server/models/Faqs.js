import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const FaqsSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    userId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Faqs = db1.model('Faqs', FaqsSchema);
export default Faqs;