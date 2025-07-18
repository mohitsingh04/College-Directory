import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const GallerySchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    userId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    title: {
        type: String,
    },
    gallery: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Gallery = db1.model('Gallery', GallerySchema);
export default Gallery;