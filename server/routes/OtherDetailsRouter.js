import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addOtherDetails, getOtherDetails, updateOtherDetails } from "../controller/OtherDetailsController.js";

const otherDetailsRouter = express.Router();

otherDetailsRouter.get("/other-details", getOtherDetails);
otherDetailsRouter.post("/other-details", addOtherDetails);
otherDetailsRouter.put("/other-details/:uniqueId", updateOtherDetails);

export default otherDetailsRouter;