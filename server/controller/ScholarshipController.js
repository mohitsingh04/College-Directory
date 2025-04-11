import Scholarship from "../models/Scholarship.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getScholarship = async (req, res) => {
    try {
        const scholarship = await Scholarship.find();
        return res.json(scholarship);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addScholarship = async (req, res) => {
    try {
        const { propertyId, scholarship } = req.body;

        const exist = await Scholarship.findOne({ propertyId });
        if (exist) {
            return res.status(400).json({ error: "This scholarship is already exist." });
        }

        const lastScholarship = await Scholarship.findOne().sort({ _id: -1 }).limit(1);
        const x = lastScholarship ? lastScholarship.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newScholarship = new Scholarship({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            scholarship,
        });

        const savedScholarship = await newScholarship.save();
        return res.json({ message: "Added Successfully.", savedScholarship });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateScholarship = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Faq ID is required!" });
        }

        const scholarshipId = await Scholarship.findOne({ uniqueId });
        if (!scholarshipId) {
            return res.status(404).json({ error: "Scholarship not found!" });
        }

        const { scholarship } = req.body;

        const updatedScholarship = await Scholarship.findOneAndUpdate({ uniqueId }, {
            $set: {
                scholarship
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedScholarship });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};