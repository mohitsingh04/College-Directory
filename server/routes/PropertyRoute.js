import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { addProperty, deleteProperty, getProperty, getPropertyById, handleUpdateFiles, updateProperty } from "../controller/PropertyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const propertyRouter = express.Router();

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

propertyRouter.get("/get-property-list", getProperty);
propertyRouter.get("/property", authMiddleware, getProperty);
propertyRouter.get("/property/:uniqueId", authMiddleware, getPropertyById);
propertyRouter.post("/property", addProperty);
propertyRouter.put("/property/:uniqueId", updateProperty);
propertyRouter.put("/property-files/:uniqueId", upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'featured_image', maxCount: 1 }]), handleUpdateFiles);
propertyRouter.delete("/property/:uniqueId", deleteProperty);

export default propertyRouter;