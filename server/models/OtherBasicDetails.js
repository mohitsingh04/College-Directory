import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const OtherBasicDetailsSchema = new mongoose.Schema({
    uniqueId: {
        type: Number,
    },
    userId: {
        type: Number,
    },
    propertyId: {
        type: Number,
    },
    youtube_link: {
        type: String,
    },
    bitly_link: {
        type: String,
    },
    website_url: {
        type: String,
    },
    brochure: {
        type: String,
    },
    hindi_podcast: {
        type: String,
    },
    english_podcast: {
        type: String,
    },
    short_description: {
        type: String,
    },
    full_description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OtherBasicDetails = db1.model("OtherBasicDetails", OtherBasicDetailsSchema);
export default OtherBasicDetails;