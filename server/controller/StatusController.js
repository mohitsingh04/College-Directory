import Status from "../models/Status.js";

export const getStatus = async (req, res) => {
    try {
        const status = await Status.find();
        return res.json(status);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getStatusById = async (req, res) => {
    try {
        const { Id } = req.params;
        const status = await Status.find({ _id: Id });
        return res.status(200).json(status);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addStatus = async (req, res) => {
    try {
        const { status_name, parent_status, description } = req.body;

        const status = await Status.findOne({ status_name, parent_status });
        if (status) {
            return res.json({ error: "Status Already Exist." });
        }

        const lastStatus = await Status.findOne().sort({ _id: -1 }).limit(1);
        const x = lastStatus ? lastStatus.uniqueId + 1 : 1;

        const newStatus = new Status({
            uniqueId: x,
            status_name,
            parent_status,
            description
        });

        const savedStatus = await newStatus.save();
        return res.json({ message: "Status Added Successfully", savedStatus });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { Id } = req.params;
        const { status_name, parent_status, description } = req.body;

        const status = await Status.find({ _id: Id });
        if (!status) {
            return res.json({ error: "Status not found" });
        }

        const updatedStatus = await Status.findOneAndUpdate({ _id: Id }, {
            $set: {
                status_name,
                parent_status,
                description
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Status updated successfully", updatedStatus });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const deleteStatus = async (req, res) => {
    try {
        const { Id } = req.params;

        const status = await Status.findOne({ _id: Id });
        if (!status) {
            return res.json({ error: "Status Not Found." });
        }

        const deletedStatus = await Status.findOneAndDelete({ _id: Id });
        return res.json({ message: "Status Deleted Sucessfully.", deletedStatus });
    } catch (error) {
        return res.json({ error: error.message });
    }
};