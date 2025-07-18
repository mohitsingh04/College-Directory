import express from "express";
import { addCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controller/CategoryController.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const categoryRouter = express.Router();

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

const upload = multer({ storage: storage })

categoryRouter.get("/category", getCategory);
categoryRouter.post("/category", upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'featured_image', maxCount: 1 }]), addCategory);
categoryRouter.get("/category/:Id", getCategoryById);
categoryRouter.put("/category/:Id", upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'featured_image', maxCount: 1 }]), updateCategory);
categoryRouter.delete("/category/:Id", deleteCategory);
categoryRouter.delete("/category/:Id", deleteCategory);

export default categoryRouter;