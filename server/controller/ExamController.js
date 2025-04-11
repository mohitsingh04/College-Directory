import { getDataFromToken } from "../helper/getDataFromToken.js";
import Exam from "../models/Exam.js";
import User from "../models/User.js";
import fs from "fs";

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

export const getExams = async (req, res) => {
    try {
        const exam = await Exam.find();
        return res.status(200).json(exam);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getExamById = async (req, res) => {
    try {
        const { Id } = req.params;
        const exam = await Exam.findOne({ _id: Id });
        return res.status(200).json(exam);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const addExam = async (req, res) => {
    try {
        const { name, short_name, description, upcoming_exam_date, result_date, youtube_link, podcast_hindi, podcast_english, application_form_date, application_form_link, exam_form_link, exam_mode } = req.body;

        const exam = await Exam.findOne({ name, short_name });
        if (exam) {
            return res.status(400).json({ error: "Exam already exists" });
        }

        const lastExam = await Exam.findOne().sort({ _id: -1 }).limit(1);
        const x = lastExam ? lastExam.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newExam = new Exam({
            uniqueId: x,
            userId: userUniqueId,
            name,
            short_name,
            description,
            upcoming_exam_date,
            result_date,
            youtube_link,
            podcast_hindi,
            podcast_english,
            application_form_date,
            application_form_link,
            exam_form_link,
            exam_mode
        })

        const savedExam = newExam.save();
        return res.status(200).json({ message: "Exam added successfully", savedExam });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateExam = async (req, res) => {
    try {
        const { Id } = req.params;

        if (!Id) {
            return res.status(400).json({ error: "Exam ID is required!" });
        }

        const examId = await Exam.findOne({ _id: Id });
        if (!examId) {
            return res.status(404).json({ error: "Exam not found!" });
        }

        const { name, short_name, description, upcoming_exam_date, result_date, youtube_link, podcast_hindi, podcast_english, application_form_date, application_form_link, exam_form_link, exam_mode, status } = req.body;

        const updatedExam = await Exam.findOneAndUpdate({ _id: Id }, {
            $set: {
                name,
                short_name,
                description,
                upcoming_exam_date,
                result_date,
                youtube_link,
                podcast_hindi,
                podcast_english,
                application_form_date,
                application_form_link,
                exam_form_link,
                exam_mode,
                status
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Exam updated successfully", updatedExam });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const { Id } = req.params;

        const exam = await Exam.findOne({ _id: Id });
        if (!exam) {
            return res.json({ error: "Exam Not Found." });
        }

        const deletedExam = await Exam.findOneAndDelete({ _id: Id });
        return res.json({ message: "Exam Deleted Sucessfully.", deletedExam });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const handleUpdateFiles = async (req, res) => {
    try {
        const { Id } = req.params;

        if (!Id) {
            return res.status(400).json({ error: "Exam ID is required!" });
        }

        const exam = await Exam.findOne({ _id: Id });
        if (!exam) {
            return res.status(404).json({ error: "Exam details not found." })
        }

        const examId = exam?.uniqueId;

        const examPath = `./media/exam/${examId}/`;
        ensureDirectoryExistence(examPath + "logo/");
        ensureDirectoryExistence(examPath + "featured/");
        ensureDirectoryExistence(examPath + "podcast/hindi/");
        ensureDirectoryExistence(examPath + "podcast/english/");

        let updateExamLogoImagePath = exam.logo;
        let updateExamFeaturedImagePath = exam.featured_image;
        let updateExamPodcastHindiImagePath = exam.podcast_hindi;
        let updateExamPodcastEnglishImagePath = exam.podcast_english;

        if (req.files && req.files.logo) {
            const logoFile = req.files.logo[0];
            const newLogoPath = `${examPath}logo/${logoFile.filename}`;
            fs.renameSync(logoFile.path, newLogoPath);
            updateExamLogoImagePath = newLogoPath;
        }

        if (req.files && req.files.featured_image) {
            const featuredFile = req.files.featured_image[0];
            const newFeaturedPath = `${examPath}featured/${featuredFile.filename}`;
            fs.renameSync(featuredFile.path, newFeaturedPath);
            updateExamFeaturedImagePath = newFeaturedPath;
        }

        if (req.files && req.files.podcast_hindi) {
            const podcastHindiFile = req.files.podcast_hindi[0];
            const newPodcastHindiPath = `${examPath}podcast/hindi/${podcastHindiFile.filename}`;
            fs.renameSync(podcastHindiFile.path, newPodcastHindiPath);
            updateExamPodcastHindiImagePath = newPodcastHindiPath;
        }

        if (req.files && req.files.podcast_english) {
            const podcastEnglishFile = req.files.podcast_english[0];
            const newPodcastEnglishPath = `${examPath}podcast/english/${podcastEnglishFile.filename}`;
            fs.renameSync(podcastEnglishFile.path, newPodcastEnglishPath);
            updateExamPodcastEnglishImagePath = newPodcastEnglishPath;
        }

        const updatedExam = await Exam.findOneAndUpdate({ _id: Id }, {
            $set: {
                logo: updateExamLogoImagePath,
                featured_image: updateExamFeaturedImagePath,
                podcast_hindi: updateExamPodcastHindiImagePath,
                podcast_english: updateExamPodcastEnglishImagePath
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedExam });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};