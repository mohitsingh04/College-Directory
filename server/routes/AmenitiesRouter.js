import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addAmenities, getAmenities, updateAmenities } from "../controller/AmenitiesController.js";

const amenitiesRouter = express.Router();

amenitiesRouter.get("/amenities", getAmenities);
amenitiesRouter.post("/amenities", addAmenities);
amenitiesRouter.put("/amenities/:uniqueId", updateAmenities);

export default amenitiesRouter;