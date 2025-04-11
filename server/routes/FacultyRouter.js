import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { addFaculty, deleteFaculty, getFaculty, getFacultyById, updateFaculty } from "../controller/FacultyController.js";

const facultyRouter = express.Router();

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

facultyRouter.get("/faculty", getFaculty);
facultyRouter.get("/faculty/:uniqueId", getFacultyById);
facultyRouter.post("/faculty", upload.fields([{ name: 'profile', maxCount: 1 }]), addFaculty);
facultyRouter.put("/faculty/:uniqueId", upload.fields([{ name: 'profile', maxCount: 1 }]), updateFaculty);
facultyRouter.delete("/faculty/:uniqueId", deleteFaculty);

export default facultyRouter;