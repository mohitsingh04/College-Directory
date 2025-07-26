import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addLocation, getCity, getCountry, getLocation, getLocationById, getLocationByPropertyId, getStates, updateLocation } from "../controller/LocationController.js";

const locationRouter = express.Router();

locationRouter.get("/get-property-location", getLocation);
locationRouter.get("/location", getLocation);
locationRouter.post("/location", addLocation);
locationRouter.get("/location/:uniqueId", getLocationById);
locationRouter.get("/location-by-property/:uniqueId", getLocationByPropertyId);
locationRouter.put("/location/:uniqueId", updateLocation);
// locationRouter.delete("/location/:uniqueId", deleteLocation);
locationRouter.get("/fetch-country", getCountry);
locationRouter.get("/fetch-states", getStates);
locationRouter.get("/fetch-city", getCity);

export default locationRouter;