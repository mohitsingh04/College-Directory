import mongoose from "mongoose";
import { db1, db2 } from "../mongoose/index.js";

const SeoSchema = new mongoose.Schema({
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
    slug: {
        type: String,
    },  
    primary_focus_keywords: {
        type: Array,
    },
    json_schema: {
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

const Seo = db1.model('Seo', SeoSchema);
export default Seo;