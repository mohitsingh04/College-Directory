import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const ExamSchema = new mongoose.Schema({
    uniqueId: {
        type: Number,
    },
    userId: {
        type: Number,
    },
    name: {
        type: String,
        required: [true, "Provide a valid name."]
    },
    short_name: {
        type: String,
        required: [true, "Provide a valid short name."]
    },
    description: {
        type: String,
    },
    upcoming_exam_date: {
        type: String,
    },
    result_date: {
        type: String,
    },
    application_form_date: {
        type: String,
    },
    youtube_link: {
        type: String,
    },
    application_form_link: {
        type: String,
    },
    exam_form_link: {
        type: String,
    },
    exam_mode: {
        type: Array,
    },
    podcast_hindi: {
        type: String,
    },
    podcast_english: {
        type: String,
    },
    logo: {
        type: String,
        default: "image.png"
    },
    featured_image: {
        type: String,
        default: "image.png"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Exam = db1.model("Exam", ExamSchema);
export default Exam;