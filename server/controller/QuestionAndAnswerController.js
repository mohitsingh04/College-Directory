import QuestionAndAnswer from "../models/QuestionAndAnswer.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getQuestionAndAnswer = async (req, res) => {
    try {
        const questionandanswer = await QuestionAndAnswer.find();
        return res.json(questionandanswer);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getQuestionAndAnswerById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const questionandanswer = await QuestionAndAnswer.findOne({ uniqueId });
        return res.json(questionandanswer);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addQuestionAndAnswer = async (req, res) => {
    try {
        const { propertyId, question, answer } = req.body;

        const questionandanswer = await QuestionAndAnswer.findOne({ question, propertyId });
        if (questionandanswer) {
            return res.status(400).json({ error: "This Faq is already exist." });
        }

        const lastQuestionAndAnswer = await QuestionAndAnswer.findOne().sort({ _id: -1 }).limit(1);
        const x = lastQuestionAndAnswer ? lastQuestionAndAnswer.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newQuestionAndAnswer = new QuestionAndAnswer({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            question,
            answer
        });

        const savedQuestionAndAnswer = await newQuestionAndAnswer.save();
        return res.json({ message: "Added Successfully.", savedQuestionAndAnswer });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateQuestionAndAnswer = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Faq ID is required!" });
        }

        const questionandanswerId = await QuestionAndAnswer.findOne({ uniqueId });
        if (!questionandanswerId) {
            return res.status(404).json({ error: "QuestionAndAnswer not found!" });
        }

        const { question, answer } = req.body;

        const updatedQuestionAndAnswer = await QuestionAndAnswer.findOneAndUpdate({ uniqueId }, {
            $set: {
                question,
                answer
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedQuestionAndAnswer });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteQuestionAndAnswer = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const questionandanswer = await QuestionAndAnswer.findOne({ uniqueId });
        if (!questionandanswer) {
            return res.json({ error: "QuestionAndAnswer Not Found." });
        }

        const deletedQuestionAndAnswer = await QuestionAndAnswer.findOneAndDelete({ uniqueId });
        return res.json({ message: "Deleted Sucessfully.", deletedQuestionAndAnswer });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};