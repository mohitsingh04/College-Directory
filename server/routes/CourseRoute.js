import express from "express";
import { addCourse, deleteCourse, getCourse, getCourseById, updateCourse } from "../controller/CourseController.js";

const courseRouter = express.Router();

courseRouter.get("/course", getCourse);
courseRouter.get("/course/:Id", getCourseById);
courseRouter.post("/course", addCourse);
courseRouter.put("/course/:Id", updateCourse);
courseRouter.delete("/course/:Id", deleteCourse);

export default courseRouter;