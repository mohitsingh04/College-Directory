import LoanProcess from "../models/LoanProcess.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";

export const getLoanProcess = async (req, res) => {
    try {
        const loanProcess = await LoanProcess.find();
        return res.json(loanProcess);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addLoanProcess = async (req, res) => {
    try {
        const { propertyId, process } = req.body;

        const exist = await LoanProcess.findOne({ propertyId });
        if (exist) {
            return res.status(400).json({ error: "This loan process is already exist." });
        }

        const lastLoanProcess = await LoanProcess.findOne().sort({ _id: -1 }).limit(1);
        const x = lastLoanProcess ? lastLoanProcess.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newLoanProcess = new LoanProcess({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            process,
        });

        const savedLoanProcess = await newLoanProcess.save();
        return res.json({ message: "Added Successfully.", savedLoanProcess });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateLoanProcess = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Faq ID is required!" });
        }

        const loanProcessId = await LoanProcess.findOne({ uniqueId });
        if (!loanProcessId) {
            return res.status(404).json({ error: "Not found!" });
        }

        const { process } = req.body;

        const updatedLoanProcess = await LoanProcess.findOneAndUpdate({ uniqueId }, {
            $set: {
                process
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedLoanProcess });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};