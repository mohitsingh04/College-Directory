import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const ReviewsSchema = new mongoose.Schema({
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
        required: [true, "Please Provide a valid name."]
    },
    email: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    rating: {
        type: Number,
        required: [true, "Please Provide a rating."]
    },
    review: {
        type: String,
        required: [true, "Please Provide a review."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Reviews = db1.model('Reviews', ReviewsSchema);
export default Reviews;