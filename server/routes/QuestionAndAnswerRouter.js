import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addQuestionAndAnswer, getQuestionAndAnswer, getQuestionAndAnswerById, updateQuestionAndAnswer, deleteQuestionAndAnswer } from "../controller/QuestionAndAnswerController.js";

const questionandanswerRouter = express.Router();

questionandanswerRouter.get("/questionandanswer", getQuestionAndAnswer);
questionandanswerRouter.get("/questionandanswer/:uniqueId", getQuestionAndAnswerById);
questionandanswerRouter.post("/questionandanswer", addQuestionAndAnswer);
questionandanswerRouter.put("/questionandanswer/:uniqueId", updateQuestionAndAnswer);
questionandanswerRouter.delete("/questionandanswer/:uniqueId", deleteQuestionAndAnswer);

export default questionandanswerRouter;