import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addFaqs, deleteFaqs, getFaqs, getFaqsById, updateFaqs } from "../controller/FaqsController.js";

const faqsRouter = express.Router();

faqsRouter.get("/faqs", authMiddleware, getFaqs);
faqsRouter.get("/faqs/:uniqueId", getFaqsById);
faqsRouter.post("/faqs", addFaqs);
faqsRouter.put("/faqs/:uniqueId", updateFaqs);
faqsRouter.delete("/faqs/:uniqueId", deleteFaqs);

export default faqsRouter;