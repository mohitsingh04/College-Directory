import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const PropertyCourseSchema = new mongoose.Schema({
    userId: {
        type: Number,
    },
    uniqueId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    name: {
        type: Array,
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
    course_fees: {
        type: String,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PropertyCourse = db1.model('PropertyCourse', PropertyCourseSchema);
export default PropertyCourse;