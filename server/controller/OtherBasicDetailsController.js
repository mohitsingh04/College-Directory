import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";
import OtherBasicDetails from "../models/OtherBasicDetails.js";
import fs from "fs";

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

export const getOtherBasicDetails = async (req, res) => {
    try {
        const otherBasicDetails = await OtherBasicDetails.find();
        return res.status(200).json(otherBasicDetails);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getOtherBasicDetailsById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const otherBasicDetails = await OtherBasicDetails.findOne({ uniqueId });
        return res.status(200).json(otherBasicDetails);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getOtherBasicDetailsByPropertyId = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const otherBasicDetails = await OtherBasicDetails.findOne({ propertyId: uniqueId });
        return res.status(200).json(otherBasicDetails);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const addOtherBasicDetails = async (req, res) => {
    try {
        const { propertyId, youtube_link, bitly_link, website_url, short_description, full_description } = req.body;

        const otherBasicDetails = await OtherBasicDetails.findOne({ propertyId });
        if (otherBasicDetails) {
            return res.status(400).json({ error: "Details already exists" });
        }

        const lastOtherBasicDetails = await OtherBasicDetails.findOne().sort({ _id: -1 }).limit(1);
        const x = lastOtherBasicDetails ? lastOtherBasicDetails.uniqueId + 1 : 1;

        const propertyPath = `./media/property/${propertyId}/`;
        ensureDirectoryExistence(propertyPath + "brochure/");
        ensureDirectoryExistence(propertyPath + "podcast/hindi/");
        ensureDirectoryExistence(propertyPath + "podcast/english/");

        let updatePropertyBrochurePath = "brochure.pdf";
        let updatePropertyPodcastHindiPath = "music.mp3";
        let updatePropertyPodcastEnglishPath = "music.mp3";

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        if (req.files && req.files.brochure) {
            const brochureFile = req.files.brochure[0];
            const newBrochurePath = `${propertyPath}brochure/${brochureFile.filename}`;
            fs.renameSync(brochureFile.path, newBrochurePath);
            updatePropertyBrochurePath = newBrochurePath;
        }

        if (req.files && req.files.hindi_podcast) {
            const podcastHindiFile = req.files.hindi_podcast[0];
            const newPodcastHindiPath = `${propertyPath}podcast/hindi/${podcastHindiFile.filename}`;
            fs.renameSync(podcastHindiFile.path, newPodcastHindiPath);
            updatePropertyPodcastHindiPath = newPodcastHindiPath;
        }

        if (req.files && req.files.english_podcast) {
            const podcastEnglishFile = req.files.english_podcast[0];
            const newPodcastEnglishPath = `${propertyPath}podcast/english/${podcastEnglishFile.filename}`;
            fs.renameSync(podcastEnglishFile.path, newPodcastEnglishPath);
            updatePropertyPodcastEnglishPath = newPodcastEnglishPath;
        }

        const newOtherBasicDetails = new OtherBasicDetails({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            youtube_link,
            bitly_link,
            website_url,
            brochure: updatePropertyBrochurePath,
            hindi_podcast: updatePropertyPodcastHindiPath,
            english_podcast: updatePropertyPodcastEnglishPath,
            short_description,
            full_description,
        })

        const savedOtherBasicDetails = newOtherBasicDetails.save();
        return res.status(200).json({ message: "Added successfully", savedOtherBasicDetails });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
};

export const updateOtherBasicDetails = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "ID is required!" });
        }

        const otherBasicDetails = await OtherBasicDetails.findOne({ uniqueId });
        if (!otherBasicDetails) {
            return res.status(404).json({ error: "Details not found!" });
        }

        const { youtube_link, bitly_link, website_url, short_description, full_description } = req.body;

        const propertyPath = `./media/property/${otherBasicDetails?.propertyId}/`;
        ensureDirectoryExistence(propertyPath + "brochure/");
        ensureDirectoryExistence(propertyPath + "podcast/hindi/");
        ensureDirectoryExistence(propertyPath + "podcast/english/");

        let updatePropertyBrochurePath = otherBasicDetails.brochure;
        let updatePropertyPodcastHindiPath = otherBasicDetails.hindi_podcast;
        let updatePropertyPodcastEnglishPath = otherBasicDetails.english_podcast;

        if (req.files && req.files.brochure) {
            const brochureFile = req.files.brochure[0];
            const newBrochurePath = `${propertyPath}brochure/${brochureFile.filename}`;
            fs.renameSync(brochureFile.path, newBrochurePath);
            updatePropertyBrochurePath = newBrochurePath;
        }

        if (req.files && req.files.hindi_podcast) {
            const podcastHindiFile = req.files.hindi_podcast[0];
            const newPodcastHindiPath = `${propertyPath}podcast/hindi/${podcastHindiFile.filename}`;
            fs.renameSync(podcastHindiFile.path, newPodcastHindiPath);
            updatePropertyPodcastHindiPath = newPodcastHindiPath;
        }

        if (req.files && req.files.english_podcast) {
            const podcastEnglishFile = req.files.english_podcast[0];
            const newPodcastEnglishPath = `${propertyPath}podcast/english/${podcastEnglishFile.filename}`;
            fs.renameSync(podcastEnglishFile.path, newPodcastEnglishPath);
            updatePropertyPodcastEnglishPath = newPodcastEnglishPath;
        }

        const updatedOtherBasicDetails = await OtherBasicDetails.findOneAndUpdate({ uniqueId }, {
            $set: {
                youtube_link,
                bitly_link,
                website_url,
                brochure: updatePropertyBrochurePath,
                hindi_podcast: updatePropertyPodcastHindiPath,
                english_podcast: updatePropertyPodcastEnglishPath,
                short_description,
                full_description,
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully", updatedOtherBasicDetails });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
};