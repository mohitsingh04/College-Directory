import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addHostel, getHostel, updateHostel } from "../controller/HostelController.js";

const hostelRouter = express.Router();

hostelRouter.get("/hostel", authMiddleware, getHostel);
hostelRouter.post("/hostel", addHostel);
hostelRouter.put("/hostel/:uniqueId", updateHostel);

export default hostelRouter;