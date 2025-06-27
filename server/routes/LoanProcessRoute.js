import express from "express";
import { getLoanProcess, addLoanProcess, updateLoanProcess } from "../controller/LoanProcessController.js";

const loanProcessRouter = express.Router();

loanProcessRouter.get("/loan-process", getLoanProcess);
loanProcessRouter.post("/loan-process", addLoanProcess);
loanProcessRouter.put("/loan-process/:uniqueId", updateLoanProcess);

export default loanProcessRouter;