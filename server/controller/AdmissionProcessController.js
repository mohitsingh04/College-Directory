import AdmissionProcess from "../models/AdmissionProcess.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getAdmissionProcess = async (req, res) => {
    try {
        const admissionProcess = await AdmissionProcess.find();
        return res.json(admissionProcess);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addAdmissionProcess = async (req, res) => {
    try {
        const { propertyId, process } = req.body;

        const exist = await AdmissionProcess.findOne({ propertyId });
        if (exist) {
            return res.status(400).json({ error: "This admission process is already exist." });
        }

        const lastAdmissionProcess = await AdmissionProcess.findOne().sort({ _id: -1 }).limit(1);
        const x = lastAdmissionProcess ? lastAdmissionProcess.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newAdmissionProcess = new AdmissionProcess({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            process,
        });

        const savedAdmissionProcess = await newAdmissionProcess.save();
        return res.json({ message: "Added Successfully.", savedAdmissionProcess });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateAdmissionProcess = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Faq ID is required!" });
        }

        const admissionProcessId = await AdmissionProcess.findOne({ uniqueId });
        if (!admissionProcessId) {
            return res.status(404).json({ error: "Not found!" });
        }

        const { process } = req.body;

        const updatedAdmissionProcess = await AdmissionProcess.findOneAndUpdate({ uniqueId }, {
            $set: {
                process
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedAdmissionProcess });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};