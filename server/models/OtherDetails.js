import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const OtherDetailsSchema = new mongoose.Schema({
    uniqueId: {
        type: Number,
    },
    userId: {
        type: Number,
    },
    propertyId: {
        type: Number,
    },
    bengal_credit_card: {
        type: Boolean,
        default: false
    },
    cuet: {
        type: Boolean,
        default: false
    },
    naac: {
        type: String,
    },
    nirf: {
        type: String,
    },
    nba: {
        type: String,
    },
    aj_ranking: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OtherDetails = db1.model("OtherDetails", OtherDetailsSchema);
export default OtherDetails;