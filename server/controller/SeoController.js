import Seo from "../models/Seo.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getSeo = async (req, res) => {
    try {
        const seo = await Seo.find();
        return res.json(seo);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addSeo = async (req, res) => {
    try {
        const { propertyId, title, slug, primary_focus_keywords, json_schema, description } = req.body;
        const converted_slug = slug.toLowerCase().replace(/\s+/g, "-");

        const seo = await Seo.findOne({ propertyId });
        if (seo) {
            return res.status(400).json({ error: "Seo is already exist." });
        }

        const lastSeo = await Seo.findOne().sort({ _id: -1 }).limit(1);
        const x = lastSeo ? lastSeo.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newSeo = new Seo({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            title,
            slug: converted_slug,
            primary_focus_keywords,
            json_schema,
            description
        });

        const savedSeo = await newSeo.save();
        return res.json({ message: "Added Successfully.", savedSeo });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateSeo = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Seo ID is required!" });
        }

        const seoId = await Seo.findOne({ uniqueId });
        if (!seoId) {
            return res.status(404).json({ error: "Seo not found!" });
        }

        const { title, slug, primary_focus_keywords, json_schema, description } = req.body;
        const converted_slug = slug.toLowerCase().replace(/\s+/g, "-");

        const updatedSeo = await Seo.findOneAndUpdate({ uniqueId }, {
            $set: {
                title,
                slug: converted_slug,
                primary_focus_keywords,
                json_schema,
                description
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedSeo });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};