import express from "express";
import { addStatus, deleteStatus, getStatus, getStatusById, updateStatus } from "../controller/StatusController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const statusRouter = express.Router();

statusRouter.get("/status", authMiddleware, getStatus);
statusRouter.post("/status", addStatus);
statusRouter.get("/status/:Id", authMiddleware, getStatusById);
statusRouter.put("/status/:Id", updateStatus);
statusRouter.delete("/status/:Id", deleteStatus);

export default statusRouter;