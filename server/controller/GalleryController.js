import Gallery from "../models/Gallery.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

export const getGallery = async (req, res) => {
    try {
        const gallery = await Gallery.find();
        return res.json(gallery);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getGalleryById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const gallery = await Gallery.findOne({ uniqueId });
        return res.json(gallery);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addGallery = async (req, res) => {
    try {
        const { propertyId, title } = req.body;
        let gallery = [];

        if (!req.files || !req.files.gallery || req.files.gallery.length > 8) {
            return res.status(400).json({ error: "You can upload 8 images only." });
        }

        if (req?.files?.gallery && req.files.gallery.length > 0) {
            gallery = req.files.gallery.map(file => file.path);
        }

        // Check if gallery already exists
        const existGallery = await Gallery.findOne({ propertyId, title });
        if (existGallery) {
            return res.status(400).json({ error: "Gallery already exists." });
        }

        // Get last uniqueId and increment it
        const lastGallery = await Gallery.findOne().sort({ _id: -1 });
        const x = lastGallery && lastGallery.uniqueId ? lastGallery.uniqueId + 1 : 1;

        // Get user details
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;
        const galleryPath = `./media/property/${propertyId}/gallery/${x}`;
        ensureDirectoryExistence(galleryPath);

        // Move files to the correct directory and update gallery paths
        let updatedGalleryPaths = [];
        if (req.files && req.files.gallery) {
            req.files.gallery.forEach(file => {
                const newGalleryPath = path.join(galleryPath, file.filename);
                fs.renameSync(file.path, newGalleryPath);
                updatedGalleryPaths.push(newGalleryPath);
            });
        }

        // Save gallery details
        const newGallery = new Gallery({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            title,
            gallery: updatedGalleryPaths,
        });

        const savedGallery = await newGallery.save();
        return res.status(200).json({ message: "Added Successfully.", savedGallery });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateGallery = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Gallery ID is required!" });
        }

        // Find existing gallery
        const existGallery = await Gallery.findOne({ uniqueId });
        if (!existGallery) {
            return res.status(404).json({ error: "Gallery not found!" });
        }

        if (req.files.gallery !== undefined) {
            if (!req.files || !req.files.gallery || req.files.gallery.length > 8) {
                return res.status(400).json({ error: "You can upload 8 images only." });
            }
        }

        // Parse incoming fields
        const { title } = req.body;

        let existingGallery = [];
        if (req.body.existingGallery) {
            // Ensure it's parsed as an array
            existingGallery = Array.isArray(req.body.existingGallery)
                ? req.body.existingGallery
                : [req.body.existingGallery];
        }

        const propertyId = existGallery.propertyId; // Get propertyId from existing gallery
        const galleryPath = `./media/property/${propertyId}/gallery/${existGallery?.uniqueId}`;
        ensureDirectoryExistence(galleryPath);

        let newGallery = [];
        if (req.files?.gallery && req.files.gallery.length > 0) {
            req.files.gallery.forEach((file) => {
                const newGalleryFilePath = path.join(galleryPath, file.filename);
                fs.renameSync(file.path, newGalleryFilePath);
                newGallery.push(newGalleryFilePath);
            });
        }

        // Merge existing and new gallery images
        const updatedImages = [...existingGallery, ...newGallery];
        existGallery.title = title;
        existGallery.gallery = updatedImages;

        await existGallery.save();

        return res.status(200).json({ message: "Gallery updated successfully.", updatedGallery: existGallery });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export const deleteGallery = async (req, res) => {
    try {
        const uniqueId = req.params.uniqueId;

        const gallery = await Gallery.findOne({ uniqueId });
        if (!gallery) {
            return res.json({ error: "Gallery Not Found." });
        }

        const deletedGallery = await Gallery.findOneAndDelete({ uniqueId });
        return res.json({ message: "Deleted Sucessfully.", deletedGallery });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error." })
    }
};