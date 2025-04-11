import OtherDetails from "../models/OtherDetails.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getOtherDetails = async (req, res) => {
    try {
        const otherDetails = await OtherDetails.find();
        return res.json(otherDetails);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addOtherDetails = async (req, res) => {
    try {
        const { propertyId, bengal_credit_card, cuet, naac, nirf, nba, aj_ranking } = req.body;

        const otherDetails = await OtherDetails.findOne({ propertyId });
        if (otherDetails) {
            return res.status(400).json({ error: "Details is already exist." });
        }

        const lastOtherDetails = await OtherDetails.findOne().sort({ _id: -1 }).limit(1);
        const x = lastOtherDetails ? lastOtherDetails.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newOtherDetails = new OtherDetails({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            bengal_credit_card,
            cuet,
            naac,
            nirf,
            nba,
            aj_ranking
        });

        const savedOtherDetails = await newOtherDetails.save();
        return res.json({ message: "Added Successfully.", savedOtherDetails });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateOtherDetails = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Details ID is required!" });
        }

        const otherDetailsId = await OtherDetails.findOne({ uniqueId });
        if (!otherDetailsId) {
            return res.status(404).json({ error: "Details not found!" });
        }

        const { bengal_credit_card, cuet, naac, nirf, nba, aj_ranking } = req.body;

        const updatedOtherDetails = await OtherDetails.findOneAndUpdate({ uniqueId }, {
            $set: {
                bengal_credit_card,
                cuet,
                naac,
                nirf,
                nba,
                aj_ranking
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedOtherDetails });
    } catch (error) {
        return res.json({ error: error.message });
    }
};