import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addSeo, getSeo, updateSeo } from "../controller/SeoController.js";

const seoRouter = express.Router();

seoRouter.get("/seo", getSeo);
seoRouter.post("/seo", addSeo);
seoRouter.put("/seo/:uniqueId", updateSeo);

export default seoRouter;