import express from "express";
import { addOtherBasicDetails, getOtherBasicDetails, getOtherBasicDetailsById, getOtherBasicDetailsByPropertyId, updateOtherBasicDetails } from "../controller/OtherBasicDetailsController.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const otherBasicDetailsRouter = express.Router();

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

otherBasicDetailsRouter.get("/otherBasicDetails", getOtherBasicDetails);
otherBasicDetailsRouter.get("/otherBasicDetails/:uniqueId", getOtherBasicDetailsById);
otherBasicDetailsRouter.get("/other-basic-details-property/:uniqueId", getOtherBasicDetailsByPropertyId);
otherBasicDetailsRouter.post("/otherBasicDetails", upload.fields([{ name: 'brochure', maxCount: 1 }, { name: 'hindi_podcast', maxCount: 1 }, { name: 'english_podcast', maxCount: 1 }]), addOtherBasicDetails);
otherBasicDetailsRouter.put("/otherBasicDetails/:uniqueId", upload.fields([{ name: 'brochure', maxCount: 1 }, { name: 'hindi_podcast', maxCount: 1 }, { name: 'english_podcast', maxCount: 1 }]), updateOtherBasicDetails);

export default otherBasicDetailsRouter;