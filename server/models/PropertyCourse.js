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
    course_id: {
        type: Number,
        ref:"Course"
    },
    course_fees: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PropertyCourse = db1.model('PropertyCourse', PropertyCourseSchema);
export default PropertyCourse;