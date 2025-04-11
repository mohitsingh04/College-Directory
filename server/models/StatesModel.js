import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const StatesSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
    },
    country_id: {
        type: Number,
    },
    state_code: {
        type: String,
    },
    state_name: {
        type: String,
    },
});

const States = db1.model('States', StatesSchema);
export default States;