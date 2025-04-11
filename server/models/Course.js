import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const CourseSchema = new mongoose.Schema({
    userId: {
        type: Number,
    },
    uniqueId: {
        type: Number
    },
    name: {
        type: String,
        required: [true, "Please provide a course name."]
    },
    short_name: {
        type: String,
        required: [true, "Please provide a short name."]
    },
    eligibility: {
        type: String,
    },
    duration: {
        type: String,
    },
    course_type: {
        type: Array,
    },
    program_type: {
        type: String,
    },
    specialization: {
        type: String,
    },
    category: {
        type: Array,
    },
    sub_category: {
        type: Array,
    },
    stream: {
        type: Array,
    },
    description: {
        type: String,
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

const Course = db1.model('Course', CourseSchema);
export default Course;