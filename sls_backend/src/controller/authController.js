const {
    getUserByEmail,
    resetLoginAttempts,
    updateLoginFailure,
    disableUserVerification,
    verifyEmailNow,
} = require("../model/userModel");
const {
    saveReverifyToken,
    findReverifyToken,
    deleteReverifyToken,
} = require("../model/tokenModel");

const { sendReverifyEmail } = require("../lib/sendEmail");
const bcrypt = require("bcryptjs");
const xss = require("xss");
const { v4: uuidv4 } = require("uuid");

const AuthController = {
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const cleanEmail = xss(email);
            const cleanPassword = xss(password);

            const user = await getUserByEmail(cleanEmail);
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: "Email not found",
                });
            }

            if (!user.emailVerified) {
                return res.status(403).json({
                    status: 403,
                    message: "Account is not verified",
                });
            }

            if (user.loginAttempts >= 3) {
                const lastTry = new Date(user.lastFailedLoginAt);
                const now = new Date();
                const waitTime = 30 * 60 * 1000;

                if (now - lastTry < waitTime) {
                    return res.status(429).json({
                        status: 429,
                        message:
                            "Too many failed attempts. Try again after 30 minutes.",
                    });
                }
            }

            const isMatch = await bcrypt.compare(cleanPassword, user.password);
            if (!isMatch) {
                const attempts = user.loginAttempts + 1;

                if (attempts >= 9) {
                    await disableUserVerification(cleanEmail);
                    await updateLoginFailure(cleanEmail, attempts);

                    const token = uuidv4();
                    await saveReverifyToken({ email: cleanEmail, token });
                    await sendReverifyEmail(cleanEmail, token);

                    return res.status(403).json({
                        status: 403,
                        message:
                            "Akun kamu dibekukan karena terlalu banyak percobaan. Cek email untuk mengaktifkan kembali.",
                    });
                }

                await updateLoginFailure(cleanEmail, attempts);

                return res.status(401).json({
                    status: 401,
                    message: "Wrong password",
                });
            }

            await resetLoginAttempts(cleanEmail);

            return res.status(200).json({
                status: 200,
                message: "Login success",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (err) {
            console.error("Login Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    },

    verifyRecover: async (req, res) => {
        try {
            const { token } = req.query;

            if (!token) {
                return res.status(400).json({
                    status: 400,
                    message: "Token tidak ditemukan",
                });
            }

            const tokenRecord = await findReverifyToken(token);
            if (!tokenRecord) {
                return res.status(404).json({
                    status: 404,
                    message: "Token tidak valid atau sudah kadaluarsa",
                });
            }

            await verifyEmailNow(tokenRecord.email);
            await deleteReverifyToken(token);

            return res.status(200).json({
                status: 200,
                message: "Akun berhasil diaktifkan kembali",
            });
        } catch (err) {
            console.error("verifyRecover Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const { token } = req.query;

            if (!token) {
                return res
                    .status(400)
                    .json({ status: 400, message: "Token tidak ditemukan" });
            }

            const record = await findToken(token);
            if (!record) {
                return res
                    .status(404)
                    .json({ status: 404, message: "Token tidak valid" });
            }

            await verifyEmailNow(record.email);
            await deleteToken(token);

            return res.status(200).json({
                status: 200,
                message: "Email berhasil diverifikasi, silakan login.",
            });
        } catch (err) {
            console.error("verifyEmail Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    },
};

module.exports = AuthController;
