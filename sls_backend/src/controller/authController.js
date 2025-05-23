const { getUserByEmail, resetLoginAttempts, updateLoginFailure, disableUserVerification, verifyEmailNow } = require("../model/userModel");
const { saveReverifyToken, findReverifyToken, deleteReverifyToken, findToken, deleteToken } = require("../model/tokenModel");

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

            const now = new Date();
            const lastTry = new Date(user.lastFailedLoginAt);
            const waitTime = 30 * 1000;
            const attempts = user.loginAttempts + 1;

            if (user.loginAttempts > 0 && user.loginAttempts % 3 === 0 && now - lastTry < waitTime) {
                return res.status(429).json({
                    status: 429,
                    message: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil((waitTime - (now - lastTry)) / 1000)} detik.`,
                });
            }

            const isMatch = await bcrypt.compare(cleanPassword, user.password);
            if (!isMatch) {
                if (attempts >= 9) {
                    await disableUserVerification(cleanEmail);
                    await updateLoginFailure(cleanEmail, attempts);

                    const token = uuidv4();
                    await saveReverifyToken({ email: cleanEmail, token });
                    await sendReverifyEmail(cleanEmail, token);

                    return res.status(403).json({
                        status: 403,
                        message: "Akun kamu dibekukan karena terlalu banyak percobaan. Cek email untuk mengaktifkan kembali.",
                    });
                }

                await updateLoginFailure(cleanEmail, attempts);
                return res.status(401).json({
                    status: 401,
                    message: "Password salah",
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
                return res.redirect(`${process.env.CLIENT_URL}/auth/verify-recover-expired`);
            }

            const tokenRecord = await findReverifyToken(token);
            if (!tokenRecord) {
                return res.redirect(`${process.env.CLIENT_URL}/auth/verify-recover-expired`);
            }

            await verifyEmailNow(tokenRecord.email);
            await deleteReverifyToken(token);

            return res.redirect(`${process.env.CLIENT_URL}/auth/verify-recover`);
        } catch (err) {
            console.error("verifyRecover Error:", err);
            return res.redirect(`${process.env.CLIENT_URL}/auth/verify-recover-expired`);
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const { token } = req.query;

            if (!token) {
                return res.redirect(`${process.env.CLIENT_URL}/auth/verify-email-expired`);
            }

            const record = await findToken(token);
            if (!record) {
                return res.redirect(`${process.env.CLIENT_URL}/auth/verify-email-expired`);
            }

            await verifyEmailNow(record.email);
            await deleteToken(token);

            return res.redirect(`${process.env.CLIENT_URL}/auth/verify-email`);
        } catch (err) {
            console.error("verifyEmail Error:", err);
            return res.redirect(`${process.env.CLIENT_URL}/auth/verify-email-expired`);
        }
    },
};

module.exports = AuthController;
