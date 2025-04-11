import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addLocation, getCity, getCountry, getLocation, getLocationById, getStates, updateLocation } from "../controller/LocationController.js";

const locationRouter = express.Router();

locationRouter.get("/get-property-location", getLocation);
locationRouter.get("/location", getLocation);
locationRouter.post("/location", addLocation);
locationRouter.get("/location/:uniqueId", authMiddleware, getLocationById);
locationRouter.put("/location/:uniqueId", updateLocation);
// locationRouter.delete("/location/:uniqueId", deleteLocation);
locationRouter.get("/fetch-country", authMiddleware, getCountry);
locationRouter.get("/fetch-states", authMiddleware, getStates);
locationRouter.get("/fetch-city", authMiddleware, getCity);

export default locationRouter;