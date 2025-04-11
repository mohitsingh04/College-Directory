import Hostel from "../models/Hostel.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getHostel = async (req, res) => {
    try {
        const hostel = await Hostel.find();
        return res.json(hostel);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addHostel = async (req, res) => {
    try {
        const { propertyId, boys_hostel_fees, boys_hostel_description, girls_hostel_fees, girls_hostel_description } = req.body;

        const hostel = await Hostel.findOne({ propertyId });
        if (hostel) {
            return res.status(400).json({ error: "Hostel is already exist." });
        }

        const lastHostel = await Hostel.findOne().sort({ _id: -1 }).limit(1);
        const x = lastHostel ? lastHostel.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newHostel = new Hostel({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            boys_hostel_fees,
            boys_hostel_description,
            girls_hostel_fees,
            girls_hostel_description
        });

        const savedHostel = await newHostel.save();
        return res.json({ message: "Added Successfully.", savedHostel });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateHostel = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Hostel ID is required!" });
        }

        const hostelId = await Hostel.findOne({ uniqueId });
        if (!hostelId) {
            return res.status(404).json({ error: "Hostel not found!" });
        }

        const { boys_hostel_fees, boys_hostel_description, girls_hostel_fees, girls_hostel_description } = req.body;

        const updatedHostel = await Hostel.findOneAndUpdate({ uniqueId }, {
            $set: {
                boys_hostel_fees,
                boys_hostel_description,
                girls_hostel_fees,
                girls_hostel_description
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedHostel });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};