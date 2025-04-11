import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const CitySchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
    },
    state_id: {
        type: Number,
    },
    state_code: {
        type: String,
    },
    country_id: {
        type: Number,
    },
    state_code: {
        type: String,
    },
});

const City = db1.model('City', CitySchema);
export default City;