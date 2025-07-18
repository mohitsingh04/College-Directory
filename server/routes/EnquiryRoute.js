import express from "express";
import { addEnquiry, getEnquiry, deleteEnquiry, updateEnquiryStatus, getEnquiryById } from "../controller/EnquiryController.js";

const enquiryRouter = express.Router();

enquiryRouter.get("/enquiry", getEnquiry);
enquiryRouter.get("/enquiry/:uniqueId", getEnquiryById);
enquiryRouter.post("/enquiry", addEnquiry);
enquiryRouter.put("/enquiry-update/:uniqueId", updateEnquiryStatus);
enquiryRouter.delete("/enquiry/:uniqueId", deleteEnquiry);

export default enquiryRouter;