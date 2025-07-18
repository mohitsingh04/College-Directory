import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const PropertySchema = new mongoose.Schema({
    uniqueId: {
        type: Number,
    },
    userId: {
        type: Number,
    },
    property_type: {
        type: String,
        required: [true, "Provide a property type."]
    },
    property_name: {
        type: String,
        required: [true, "Provide a valid name."]
    },
    short_name: {
        type: String,
        required: [true, "Provide a valid short name."]
    },
    phone_number: {
        type: String,
    },
    alt_phone_number: {
        type: String,
    },
    email: {
        type: String,
    },
    affiliated_by: {
        type: Array,
    },
    college_or_university_type: {
        type: Array,
    },
    established_year: {
        type: String,
    },
    logo: {
        type: String,
        default: "image.png"
    },
    logo_compressed: String,
    featured_image: {
        type: String,
        default: "image.png"
    },
    featured_image_compressed: String,
    status: {
        type: String,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Property = db1.model("Property", PropertySchema);
export default Property;