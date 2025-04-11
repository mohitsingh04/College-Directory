import Reviews from "../models/Reviews.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getReviews = async (req, res) => {
    try {
        const reviews = await Reviews.find();
        return res.json(reviews);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getReviewsById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const reviews = await Reviews.find({ uniqueId });
        return res.json(reviews);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addReviews = async (req, res) => {
    try {
        const { propertyId, name, email, phone_number, gender, rating, review } = req.body;

        const lastReviews = await Reviews.findOne().sort({ _id: -1 }).limit(1);
        const x = lastReviews ? lastReviews.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newReviews = new Reviews({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            name,
            email,
            phone_number,
            gender,
            rating,
            review
        })

        const savedReviews = newReviews.save();
        return res.status(200).json({ message: "Added successfully.", savedReviews });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateReviews = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Reviews ID is required!" });
        }

        const reviews = await Reviews.findOne({ uniqueId });
        if (!reviews) {
            return res.status(404).json({ error: "Reviews not found!" });
        }

        const { name, email, phone_number, gender, rating, review } = req.body;

        const updatedReviews = await Reviews.findOneAndUpdate({ uniqueId }, {
            $set: {
                name,
                email,
                phone_number,
                gender,
                rating,
                review
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully", updatedReviews });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteReviews = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const reviews = await Reviews.findOne({ uniqueId });
        if (!reviews) {
            return res.json({ error: "Reviews Not Found." });
        }

        const deletedReviews = await Reviews.findOneAndDelete({ uniqueId });
        return res.json({ message: "Deleted Sucessfully.", deletedReviews });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};