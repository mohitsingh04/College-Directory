import User from "../models/User.js";
import Role from "../models/Role.js";
import Permission from "../models/Permission.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail, sendPasswordEmailForANewUser } from "../helper/mailer.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import twilio from "twilio";
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const permissions = [
    {
        label: "Create Property",
        value: "Create Property"
    },
    {
        label: "Read Property",
        value: "Read Property"
    },
    {
        label: "Update Property",
        value: "Update Property"
    },
    {
        label: "Delete Property",
        value: "Delete Property"
    },
]

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Authentication
export const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ error: "This email is already exist." });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const lastUser = await User.findOne().sort({ _id: -1 }).limit(1);
        const x = lastUser ? lastUser.uniqueId + 1 : 1;

        const newUser = new User({
            uniqueId: x,
            name,
            email,
            phone: `${phone}`,
            password: hashedPassword,
            permission: permissions
        })

        const savedUser = await newUser.save();

        // send verification email
        const userId = savedUser._id;
        await sendEmail({ email, emailType: "VERIFY", userId: userId });

        return res.status(200).json({ message: "A verification email has been sent to your email address. The verification email will expire after 24 hours.", savedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist." });
        }

        if (user?.status === "Suspended") {
            return res.status(400).json({ error: "Your account has been suspended. Please contact support." })
        }
        const checkEmailVerification = await User.findOne({ email });
        if (checkEmailVerification.isVerified !== true) {
            await sendEmail({ email, emailType: "VERIFY", userId: user._id });

            return res.status(404).json({ error: "A verification email has been sent to your email address. The verification email will expire after 24 hours." });
        }

        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Check your credentials." });
        }

        const token = await jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
            expiresIn: '100y',
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Logged in successfully.", token: token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
        return res.status(200).json({ message: "Logged Out Successfully." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const resendEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const existEmail = await User.findOne({ email });
        if (!existEmail) {
            return res.status(400).json({ error: "Email not found." });
        }

        const user = await User.findOne({ email });

        const userId = user._id;

        await sendEmail({ email, emailType: "VERIFY", userId: userId });

        return res.status(200).json({ message: "A verification otp has been sent to your email address." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return res.status(200).json({ message: "Email Verified Successfully. You can login now." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ error: "User not found. Please check your email." });
        }

        // send reset password email
        const userId = user._id;
        await sendEmail({ email, emailType: "RESET", userId: userId });

        return res.status(200).json({ message: "Reset Password Sent to Your Mail. Check Your Email" });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, new_password, confirm_password } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({ error: "Password does not matched" });
        }

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(new_password, salt);

        user.password = hashedPassword;

        await user.save();
        return res.status(200).json({ message: "Password Reset Successfully. You can login now." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const myProfile = async (req, res) => {
    try {
        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User Found", data: user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { name, pincode, address, country, city, state } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    name,
                    pincode,
                    address,
                    city,
                    state,
                    country
                }
            },
            { new: true }
        );

        return res.status(200).json({ message: "Profile updated successfully.", updatedUser });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

const deleteFileIfExists = async (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        try {
            await fs.promises.unlink(filePath);
            console.log(`Deleted old file: ${filePath}`);
        } catch (err) {
            console.warn(`Failed to delete old image ${filePath}: ${err.message}`);
        }
    }
};

export const updateProfileImage = async (req, res) => {
    try {
        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const uniqueId = user.uniqueId;
        const profilePath = `./media/profile/${uniqueId}/`;
        ensureDirectoryExistence(profilePath);

        let profileImagePath = user.profile_image;
        let profileImageCompressedPath = user.profile_image_compressed;

        if (req.files && req.files.profile_image) {
            // Delete old files
            await deleteFileIfExists(user.profile_image);
            await deleteFileIfExists(user.profile_image_compressed);

            const uploadedFile = req.files.profile_image[0];
            const ext = path.extname(uploadedFile.originalname).toLowerCase();
            const baseName = path.basename(uploadedFile.filename, ext);

            const originalTarget = `${profilePath}${baseName}${ext}`;
            const webpTarget = `${profilePath}${baseName}-compressed.webp`;

            // Move original
            await fs.promises.rename(uploadedFile.path, originalTarget);

            // Generate WebP
            await sharp(originalTarget)
                // optionally add resize: .resize(200, 200)
                .toFormat('webp')
                .toFile(webpTarget);

            profileImagePath = originalTarget;
            profileImageCompressedPath = webpTarget;
        } else {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    profile_image: profileImagePath,
                    profile_image_compressed: profileImageCompressedPath
                }
            },
            { new: true }
        );

        return res.status(200).json({ message: "Profile image updated successfully.", updatedUser });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const token = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        const user = await User.findById(decoded.id).select("-password");

        res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { current_password, new_password, confirm_password } = req.body;
        const userId = await getDataFromToken(req);

        // Find user by ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if current password matches
        const isMatch = await bcryptjs.compare(current_password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Check if new password and confirm password match
        if (new_password !== confirm_password) {
            return res.status(400).json({ error: 'New password and confirm password do not match' });
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(new_password, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Respond with success
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        return res.status(200).json(roles);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        return res.status(200).json(permissions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Authentication End

// Manage User
export const getUser = async (req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { Id } = req.params;
        const user = await User.findOne({ _id: Id }).select("-password");
        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const addUser = async (req, res) => {
    try {
        const { name, email, phone, role, permission } = req.body;
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ error: "This email is already exist." });
        }

        const existPhone = await User.findOne({ phone });
        if (existPhone) {
            return res.status(400).json({ error: "This phone number is already exist." });
        }

        const password = String(Math.floor(100000 + Math.random() * 899999));
        const hashedPassword = bcrypt.hashSync(password, 10);

        const lastUser = await User.findOne().sort({ _id: -1 }).limit(1);
        const x = lastUser ? lastUser.uniqueId + 1 : 1;

        const newUser = new User({
            uniqueId: x,
            name,
            email,
            phone,
            password: hashedPassword,
            role,
            permission
        });
        const savedUser = await newUser.save();

        // send verification email
        const userId = savedUser._id;
        await sendPasswordEmailForANewUser({ email, emailType: "NEWUSER", userId: userId, password: password });

        return res.status(200).json({ message: "User added successfully.", savedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { Id } = req.params;
        const existUserId = await User.findOne({ _id: Id });
        if (!existUserId) {
            return res.status(404).json({ error: "ID not found." });
        }

        const { name, email, phone, address, pincode, country, city, state, role, permission, status } = req.body;

        const updatedUser = await User.findOneAndUpdate({ _id: Id }, {
            $set: {
                name,
                email,
                phone,
                address,
                pincode,
                city,
                state,
                country,
                role,
                permission,
                status,
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Saved successfully.", updatedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { Id } = req.params;
        const existUserId = await User.findOne({ _id: Id });
        if (!existUserId) {
            return res.status(404).json({ error: "ID not found." });
        }

        const adminUser = await User.findOne({ _id: Id });
        if (adminUser.role === "Super Admin") {
            return res.status(400).json({ error: "You can't delete admin!" });
        }

        const deletedUser = await User.findOneAndDelete({ _id: Id });
        return res.json({ message: "Deleted Sucessfully.", deletedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const softDelete = async (req, res) => {
    try {
        const { Id } = req.params;
        if (!Id) {
            return res.status(400).json({ error: "User ID is required!" });
        }
        const adminUser = await User.findOne({ _id: Id });
        if (adminUser.role === "Super Admin") {
            return res.status(400).json({ error: "You can't delete admin!" });
        }

        const user = await User.findOne({ _id: Id });

        user.isDeleted = true;

        await user.save();

        return res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Manage User End