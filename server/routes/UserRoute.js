import express from "express";
import { addUser, changePassword, deleteUser, forgotPassword, getPermissions, getRoles, getUser, getUserById, login, logout, myProfile, register, resetPassword, sendOtp, softDelete, token, updateProfile, updateUser, verifyEmail } from "../controller/UserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const userRouter = express.Router();

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const tempStoragePath = "./media/temp/";
ensureDirectoryExistence(tempStoragePath)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempStoragePath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage })

// Authentication API's
userRouter.post("/register", register);
userRouter.post("/register-with-otp", sendOtp);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/verifyemail", verifyEmail);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/resetpassword", resetPassword);
userRouter.get("/profile", authMiddleware, myProfile);
userRouter.put("/profile", upload.fields([{ name: 'profile_image', maxCount: 1 }]), updateProfile);
userRouter.get("/token", token);
userRouter.put("/changepassword", changePassword);
userRouter.get("/roles", authMiddleware, getRoles);
userRouter.get("/permissions", authMiddleware, getPermissions);

// User Manage API's
userRouter.get("/user", getUser);
userRouter.post("/user", authMiddleware, addUser);
userRouter.get("/user/:Id", authMiddleware, getUserById);
userRouter.put("/user/:Id", authMiddleware, updateUser);
userRouter.delete("/user/:Id", authMiddleware, deleteUser);
userRouter.post("/soft-delete/:Id", authMiddleware, softDelete);

export default userRouter;