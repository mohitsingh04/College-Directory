import Faculty from "../models/Faculty.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";
import fs from "fs";

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

export const getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find();
        return res.json(faculty);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getFacultyById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const faculty = await Faculty.find({ uniqueId });
        return res.json(faculty);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addFaculty = async (req, res) => {
    try {
        const { propertyId, name, designation, department } = req.body;

        const lastFaculty = await Faculty.findOne().sort({ _id: -1 }).limit(1);
        const x = lastFaculty ? lastFaculty.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const profilePath = `./media/property/${propertyId}/faculty/${x}`;
        ensureDirectoryExistence(profilePath);

        let updateProfileImagePath = "image.png";

        if (req.files && req.files.profile) {
            const profileFile = req.files.profile[0];
            const newProfilePath = `${profilePath}/${profileFile.filename}`;
            fs.renameSync(profileFile.path, newProfilePath);
            updateProfileImagePath = newProfilePath;
        }

        const newFaculty = new Faculty({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            name,
            designation,
            department,
            profile: updateProfileImagePath
        })

        const savedFaculty = newFaculty.save();
        return res.status(200).json({ message: "Added successfully.", savedFaculty });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
};

export const updateFaculty = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Faculty ID is required!" });
        }

        const faculty = await Faculty.findOne({ uniqueId });
        if (!faculty) {
            return res.status(404).json({ error: "Faculty not found!" });
        }

        const { name, designation, department } = req.body;

        const profilePath = `./media/property/${faculty.propertyId}/faculty/${faculty.uniqueId}`;
        ensureDirectoryExistence(profilePath);

        let updateProfileImagePath = faculty.profile;

        if (req.files && req.files.profile) {
            const profileFile = req.files.profile[0];
            const newProfilePath = `${profilePath}/${profileFile.filename}`;
            fs.renameSync(profileFile.path, newProfilePath);
            updateProfileImagePath = newProfilePath;
        }

        const updatedFaculty = await Faculty.findOneAndUpdate({ uniqueId }, {
            $set: {
                name,
                designation,
                department,
                profile: updateProfileImagePath
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully", updatedFaculty });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteFaculty = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const faculty = await Faculty.findOne({ uniqueId });
        if (!faculty) {
            return res.json({ error: "Faculty Not Found." });
        }

        const deletedFaculty = await Faculty.findOneAndDelete({ uniqueId });
        return res.json({ message: "Deleted Sucessfully.", deletedFaculty });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};