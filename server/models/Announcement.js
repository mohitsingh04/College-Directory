import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const AnnouncementSchema = new mongoose.Schema({
    uniqueId: {
        type: Number
    },
    userId: {
        type: Number
    },
    propertyId: {
        type: Number
    },
    announcement: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Announcement = db1.model('Announcement', AnnouncementSchema);
export default Announcement;