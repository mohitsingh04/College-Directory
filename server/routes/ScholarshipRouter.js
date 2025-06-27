import express from "express";
import { addScholarship, getScholarship, updateScholarship } from "../controller/ScholarshipController.js";

const scholarshipRouter = express.Router();

scholarshipRouter.get("/scholarship", getScholarship);
scholarshipRouter.post("/scholarship", addScholarship);
scholarshipRouter.put("/scholarship/:uniqueId", updateScholarship);

export default scholarshipRouter;