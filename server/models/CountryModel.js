import mongoose from "mongoose";
import { db1 } from "../mongoose/index.js";

const CountrySchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
    },
    phone_code: {
        type: String,
    },
    region: {
        type: String,
    },
    nationality: {
        type: String,
    }
});

const Country = db1.model('Country', CountrySchema);
export default Country;