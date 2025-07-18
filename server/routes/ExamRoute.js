import express from "express";
import { addExam, deleteExam, getExamById, getExams, handleUpdateFiles, updateExam } from "../controller/ExamController.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const examRouter = express.Router();

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

examRouter.get("/exam", getExams);
examRouter.post("/exam", addExam);
examRouter.get("/exam/:Id", getExamById);
examRouter.put("/exam/:Id", updateExam);
examRouter.delete("/exam/:Id", deleteExam);
examRouter.put("/update-files/:Id", upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'featured_image', maxCount: 1 }, { name: 'podcast_hindi', maxCount: 1 }, { name: 'podcast_english', maxCount: 1 }]), handleUpdateFiles);

export default examRouter;