import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addHostel, getHostel, getHostelByProperty, updateHostel } from "../controller/HostelController.js";

const hostelRouter = express.Router();

hostelRouter.get("/hostel", getHostel);
hostelRouter.get("/hostel-by-property/:uniqueId", getHostelByProperty);
hostelRouter.post("/hostel", addHostel);
hostelRouter.put("/hostel/:uniqueId", updateHostel);

export default hostelRouter;