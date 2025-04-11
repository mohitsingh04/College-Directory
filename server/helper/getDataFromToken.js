import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getDataFromToken = async (req) => {
    try {
        const token = req.cookies?.token || "";

        if (!token) {
            throw new Error("Token not found");
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        return decodedToken.id;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
}