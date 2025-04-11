import Announcement from "../models/Announcement.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.find();
        return res.json(announcement);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addAnnouncement = async (req, res) => {
    try {
        const { propertyId, announcement } = req.body;

        const exist = await Announcement.findOne({ propertyId });
        if (exist) {
            return res.status(400).json({ error: "This announcement is already exist." });
        }

        const lastAnnouncement = await Announcement.findOne().sort({ _id: -1 }).limit(1);
        const x = lastAnnouncement ? lastAnnouncement.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newAnnouncement = new Announcement({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            announcement,
        });

        const savedAnnouncement = await newAnnouncement.save();
        return res.json({ message: "Added Successfully.", savedAnnouncement });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateAnnouncement = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Announcement ID is required!" });
        }

        const announcementId = await Announcement.findOne({ uniqueId });
        if (!announcementId) {
            return res.status(404).json({ error: "Announcement not found!" });
        }

        const { announcement } = req.body;

        const updatedAnnouncement = await Announcement.findOneAndUpdate({ uniqueId }, {
            $set: {
                announcement
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedAnnouncement });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};