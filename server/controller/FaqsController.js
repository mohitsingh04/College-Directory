import Faqs from "../models/Faqs.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getFaqs = async (req, res) => {
    try {
        const faqs = await Faqs.find();
        return res.json(faqs);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getFaqsById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const faqs = await Faqs.findOne({ uniqueId });
        return res.json(faqs);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addFaqs = async (req, res) => {
    try {
        const { propertyId, question, answer } = req.body;

        const faqs = await Faqs.findOne({ question, propertyId });
        if (faqs) {
            return res.status(400).json({ error: "This Faq is already exist." });
        }

        const lastFaqs = await Faqs.findOne().sort({ _id: -1 }).limit(1);
        const x = lastFaqs ? lastFaqs.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newFaqs = new Faqs({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            question,
            answer
        });

        const savedFaqs = await newFaqs.save();
        return res.json({ message: "Added Successfully.", savedFaqs });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateFaqs = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Faq ID is required!" });
        }

        const faqsId = await Faqs.findOne({ uniqueId });
        if (!faqsId) {
            return res.status(404).json({ error: "Faqs not found!" });
        }

        const { question, answer } = req.body;

        const updatedFaqs = await Faqs.findOneAndUpdate({ uniqueId }, {
            $set: {
                question,
                answer
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedFaqs });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteFaqs = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const faqs = await Faqs.findOne({ uniqueId });
        if (!faqs) {
            return res.json({ error: "Faqs Not Found." });
        }

        const deletedFaqs = await Faqs.findOneAndDelete({ uniqueId });
        return res.json({ message: "Deleted Sucessfully.", deletedFaqs });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};