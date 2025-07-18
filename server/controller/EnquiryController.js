import Enquiry from "../models/EnquiryModel.js";

export const getEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.find();
        return res.json(enquiry);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getEnquiryById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const enquiry = await Enquiry.find({ uniqueId });
        return res.json(enquiry);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addEnquiry = async (req, res) => {
    try {
        const { propertyId, name, email, mobile_no, city, course } = req.body;

        // const existEmail = await Enquiry.findOne({ email });
        // if (existEmail) {
        //     return res.status(400).json({ error: "This email is already exist." });
        // }

        // const existContact = await Enquiry.findOne({ mobile_no });
        // if (existContact) {
        //     return res.status(400).json({ error: "This mobile number is already exist." });
        // }

        const lastEnquiry = await Enquiry.findOne().sort({ _id: -1 }).limit(1);
        const x = lastEnquiry ? lastEnquiry.uniqueId + 1 : 1;

        const newEnquiry = new Enquiry({
            uniqueId: x,
            propertyId,
            name,
            email,
            mobile_no,
            city,
            course
        });

        const savedEnquiry = await newEnquiry.save();
        return res.json({ message: "Enquiry submitted successfully.", savedEnquiry });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateEnquiryStatus = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Enquiry ID is required!" });
        }
        const enquiry = await Enquiry.findOne({ uniqueId });
        if (!enquiry) {
            return res.status(404).json({ error: "Enquiry not found!" });
        }

        const { status } = req.body;

        const updatedEnquiry = await Enquiry.findOneAndUpdate({ uniqueId }, {
            $set: {
                status
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated" });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const deleteEnquiry = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const enquiry = await Enquiry.findOne({ uniqueId: uniqueId });
        if (!enquiry) {
            return res.json({ error: "Enquiry Not Found." });
        }

        const deletedEnquiry = await Enquiry.findOneAndDelete({ uniqueId: uniqueId });
        return res.json({ message: "Enquiry deleted sucessfully.", deletedEnquiry });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};