import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addAnnouncement, getAnnouncement, updateAnnouncement } from "../controller/AnnouncementController.js";

const announcementRouter = express.Router();

announcementRouter.get("/announcement", authMiddleware, getAnnouncement);
announcementRouter.post("/announcement", addAnnouncement);
announcementRouter.put("/announcement/:uniqueId", updateAnnouncement);

export default announcementRouter;