import express from "express";
import { getAdmissionProcess, addAdmissionProcess, updateAdmissionProcess } from "../controller/AdmissionProcessController.js";

const admissionProcessRouter = express.Router();

admissionProcessRouter.get("/admission-process", getAdmissionProcess);
admissionProcessRouter.post("/admission-process", addAdmissionProcess);
admissionProcessRouter.put("/admission-process/:uniqueId", updateAdmissionProcess);

export default admissionProcessRouter;