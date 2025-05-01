import User from "../models/User.js";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000,
                },
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000,
                },
            });
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "97e036ca133333",
                pass: "4c2587709ea186",
            },
        });

        const resetLink = `${process.env.DASHBOARD_URL}/reset-password?token=${hashedToken}`;
        const verifyLink = `${process.env.DASHBOARD_URL}/verifyemail?token=${hashedToken}`;

        const mailOptions = {
            from: "ms6498289@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333;">${emailType === "VERIFY" ? "Email Verification" : "Password Reset"}</h2>
                    <p style="font-size: 16px; color: #555;">
                        Click the button below to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.
                    </p>
                    <a href="${emailType === "VERIFY" ? verifyLink : resetLink}" 
                        style="display: inline-block; padding: 12px 20px; margin-top: 10px; font-size: 16px; 
                                color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                        ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
                    </a>
                    <p style="font-size: 14px; color: #777; margin-top: 10px;">
                        If you didn’t request this, you can ignore this email.
                    </p>
                    </div>
                </div>
                `,
        };

        const mailResponse = await transport.sendMail(mailOptions);

        return mailResponse;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const sendPasswordEmailForANewUser = async ({ email, emailType, password }) => {
    try {
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "97e036ca133333",
                pass: "4c2587709ea186",
            },
        });

        const mailOptions = {
            from: "ms6498289@gmail.com",
            to: email,
            subject: emailType === "NEWUSER" ? "Welcome! Here is your login password" : null,
            html: `<p>Dear User,</p>
            <p>Welcome to our platform! Below is your login password:</p>
            <p><strong>Email: ${email}</strong></p>
            <p><strong>Password: ${password}</strong></p>
            <p>Please use this password to log in. You can change your password after logging in through your account settings.</p>
            <p>If you need any assistance, feel free to contact our support team.</p>
            <p>Best regards,</p>
            <p>Admission Jockey</p>`,
        };


        const mailResponse = await transport.sendMail(mailOptions);

        return mailResponse;
    } catch (error) {
        throw new Error(error.message);
    }
};
