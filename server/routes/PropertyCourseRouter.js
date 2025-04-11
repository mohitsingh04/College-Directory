import express from "express";
import { addPropertyCourse, deletePropertyCourse, getPropertyCourse, getPropertyCourseById, updatePropertyCourse } from "../controller/PropertyCourseController.js";

const propertyCourseRouter = express.Router();

propertyCourseRouter.get("/property-course", getPropertyCourse);
propertyCourseRouter.get("/property-course/:uniqueId", getPropertyCourseById);
propertyCourseRouter.post("/property-course", addPropertyCourse);
propertyCourseRouter.put("/property-course/:uniqueId", updatePropertyCourse);
propertyCourseRouter.delete("/property-course/:uniqueId", deletePropertyCourse);

export default propertyCourseRouter;