const { getUserByEmail, createUser } = require("../model/userModel");
const { saveVerificationToken } = require("../model/tokenModel");
const { sendVerificationEmail } = require("../lib/sendEmail");
const bcrypt = require("bcryptjs");
const xss = require("xss");
const { v4: uuidv4 } = require("uuid");

const AuthController = {
    registerUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    status: 400,
                    message: "Name, email, and password are required",
                });
            }

            const cleanName = xss(name);
            const cleanEmail = xss(email);
            const cleanPassword = xss(password);

            const existingUser = await getUserByEmail(cleanEmail);
            if (existingUser) {
                return res.status(409).json({
                    status: 409,
                    message: "Email already registered",
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
                message: "User registered successfully",
                data: { userId },
            });
        } catch (err) {
            console.error("Register Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    },
};

module.exports = AuthController;
