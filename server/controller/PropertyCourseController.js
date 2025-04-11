import PropertyCourse from "../models/PropertyCourse.js";
import User from "../models/User.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";

export const getPropertyCourse = async (req, res) => {
    try {
        const propertyCourse = await PropertyCourse.find();
        return res.status(200).json(propertyCourse);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error.");
    }
};

export const getPropertyCourseById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const propertyCourse = await PropertyCourse.findOne({ uniqueId });
        if (!propertyCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json(propertyCourse);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error.");
    }
};

export const addPropertyCourse = async (req, res) => {
    try {
        const {
            propertyId,
            name,
            short_name,
            specialization,
            description,
            course_fees,
            eligibility,
            duration,
            program_type,
            course_type,
            category,
            sub_category,
            stream
        } = req.body;

        let transformedName = [];
        if (Array.isArray(name)) {
            transformedName = name.map(item => ({
                label: item,
                value: item
            }));
        } else if (typeof name === 'string') {
            transformedName = [{ label: name, value: name }];
        }

        // const propertyCourse = await PropertyCourse.findOne({ propertyId, "name.value": transformedName[0].value, specialization });
        const propertyCourse = await PropertyCourse.findOne({ propertyId, "name.value": typeof name === 'string' ? transformedName[0].value : name[0].value, specialization });
        if (propertyCourse) {
            return res.status(400).json({ error: "Course already exists" });
        }

        const lastPropertyCourse = await PropertyCourse.findOne().sort({ _id: -1 }).limit(1);
        const x = lastPropertyCourse ? lastPropertyCourse.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        if (Array.isArray(name)) {
            transformedName = name.map(item => ({
                label: item,
                value: item
            }));
        } else if (typeof name === 'string') {
            transformedName = [{ label: name, value: name }];
        }

        const newPropertyCourse = new PropertyCourse({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            name: typeof name === 'string' ? transformedName : name,
            short_name,
            eligibility,
            duration,
            course_fees,
            specialization,
            course_type,
            program_type,
            category,
            sub_category,
            stream,
            description
        });

        const savedPropertyCourse = await newPropertyCourse.save();
        return res.status(200).json({ message: "Added successfully.", savedPropertyCourse });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error.");
    }
};

export const updatePropertyCourse = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(404).json({ error: "Course ID is required!" });
        }

        const propertyCourseId = await PropertyCourse.findOne({ uniqueId });
        if (!propertyCourseId) {
            return res.status(404).json({ error: "Course not found!" });
        }

        const { name, short_name, description, specialization, eligibility, course_fees, duration, course_type, program_type, category, sub_category, stream } = req.body;

        const updatedPropertyCourse = await PropertyCourse.findOneAndUpdate({ uniqueId }, {
            $set: {
                name,
                short_name,
                description,
                eligibility,
                duration,
                course_fees,
                course_type,
                specialization,
                program_type,
                category,
                sub_category,
                stream
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully", updatedPropertyCourse });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error.");
    }
};

export const deletePropertyCourse = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const propertyCourse = await PropertyCourse.findOne({ uniqueId });
        if (!propertyCourse) {
            return res.json({ error: "Course Not Found." });
        }

        const deletedPropertyCourse = await PropertyCourse.findOneAndDelete({ uniqueId });
        return res.json({ message: "Deleted Sucessfully.", deletedPropertyCourse });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};