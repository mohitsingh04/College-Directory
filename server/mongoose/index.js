import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const db1 = mongoose.createConnection(process.env.MONGO_URI1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export const db2 = mongoose.createConnection(process.env.MONGO_URI2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});