const { getUserByEmail, createUser } = require("../model/userModel");
const { saveVerificationToken } = require("../model/tokenModel");
const { sendVerificationEmail } = require("../lib/sendEmail");
const bcrypt = require("bcryptjs");
const xss = require("xss");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const AuthController = {
    registerUser: async (req, res) => {
        try {
            const { name, email, password, captchaToken } = req.body;

            if (!name || !email || !password || !captchaToken) {
                return res.status(400).json({
                    status: 400,
                    message: "All fields must be filled in including captchatoken",
                });
            }

            const verify = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: captchaToken,
                },
            });

            if (!verify.data.success) {
                return res.status(403).json({
                    status: 403,
                    message: "Captcha is invalid",
                });
            }

            const cleanName = xss(name.trim());
            const cleanEmail = xss(email.trim().toLowerCase());
            const cleanPassword = xss(password);

            const existingUser = await getUserByEmail(cleanEmail);
            if (existingUser) {
                return res.status(409).json({
                    status: 409,
                    message: "Email is registered",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(cleanPassword, salt);

            const token = uuidv4();
            await saveVerificationToken({ email: cleanEmail, token });
            await sendVerificationEmail(cleanEmail, token);

            const userId = await createUser({
                name: cleanName,
                email: cleanEmail,
                passwordHash,
            });

            return res.status(201).json({
                status: 201,
                message: "Registration is successful. Please check email for verification.",
                data: { userId },
            });
        } catch (err) {
            console.error("Register Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Server error occurs.",
            });
        }
    },
    getUser: async (req, res) => {
        try {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({
                    status: 400,
                    message: "Email is required",
                });
            }

            const user = await getUserByEmail(email);

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: "User not found",
                });
            }

            return res.status(200).json({
                status: 200,
                message: "User found",
                data: user,
            });
        } catch (err) {
            console.error("GetUser Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    },
};

module.exports = AuthController;
