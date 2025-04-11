import Course from "../models/Course.js";
import User from "../models/User.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";

export const getCourse = async (req, res) => {
    try {
        const course = await Course.find();
        return res.status(200).json(course);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error.");
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { Id } = req.params;
        const course = await Course.findOne({ _id: Id });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json(course);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error.");
    }
};

export const addCourse = async (req, res) => {
    try {
        const { name, short_name, description, eligibility, specialization, duration, program_type, course_type, category, sub_category, stream } = req.body;

        const course = await Course.findOne({ name, short_name, specialization });
        if (course) {
            return res.status(400).json({ error: "Course is already exists" });
        }

        const lastCourse = await Course.findOne().sort({ _id: -1 }).limit(1);
        const x = lastCourse ? lastCourse.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newCourse = new Course({
            uniqueId: x,
            userId: userUniqueId,
            name,
            short_name,
            eligibility,
            duration,
            course_type,
            specialization,
            program_type,
            category,
            sub_category,
            stream,
            description
        })

        const savedCourse = newCourse.save();
        return res.status(200).json({ message: "Course added successfully.", savedCourse });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error.");
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { Id } = req.params;

        if (!Id) {
            return res.status(404).json({ error: "Course ID is required!" });
        }

        const courseId = await Course.findOne({ _id: Id });
        if (!courseId) {
            return res.status(404).json({ error: "Course not found!" });
        }

        const { name, short_name, description, specialization, eligibility, duration, course_type, program_type, category, sub_category, stream, status } = req.body;

        const updatedCourse = await Course.findOneAndUpdate({ _id: Id }, {
            $set: {
                name,
                short_name,
                description,
                eligibility,
                duration,
                course_type,
                specialization,
                program_type,
                category,
                sub_category,
                stream,
                status
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Course updated successfully", updatedCourse });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error.");
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { Id } = req.params;

        const course = await Course.findOne({ _id: Id });
        if (!course) {
            return res.json({ error: "Course Not Found." });
        }

        const deletedCourse = await Course.findOneAndDelete({ _id: Id });
        return res.json({ message: "Course Deleted Sucessfully.", deletedCourse });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};