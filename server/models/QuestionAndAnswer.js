import mongoose from "mongoose";
import { db1, db2 } from "../mongoose/index.js";

const QuestionAndAnswerSchema = new mongoose.Schema({
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

const QuestionAndAnswer = db1.model('QuestionAndAnswer', QuestionAndAnswerSchema);
export default QuestionAndAnswer;