import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addGallery, deleteGallery, getGallery, getGalleryById, updateGallery } from "../controller/GalleryController.js";

const galleryRouter = express.Router();

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const tempStoragePath = "./media/temp/";
ensureDirectoryExistence(tempStoragePath)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempStoragePath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

galleryRouter.get("/gallery", getGallery);
galleryRouter.get("/gallery/:uniqueId", authMiddleware, getGalleryById);
galleryRouter.post("/gallery", upload.fields([{ name: 'gallery', maxCount: 8 }]), addGallery);
galleryRouter.put("/gallery/:uniqueId", upload.fields([{ name: 'gallery', maxCount: 8 }]), updateGallery);
galleryRouter.delete("/gallery/:uniqueId", deleteGallery);

export default galleryRouter;