const { getResetToken, updatePassword, deleteResetToken } = require("../model/authModel");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const axios = require("axios");
require("dotenv").config();

const ResetPasswordController = {
    reset: async (req, res) => {
        try {
            const { token, newPassword, captchaToken } = req.body;

            if (!token || !newPassword || !captchaToken) {
                return res.status(400).json({
                    status: 400,
                    message: "Tokens, new passwords, and captcha must be filled",
                });
            }

            const verify = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
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

            const resetTokenData = await getResetToken(token);
            if (!resetTokenData) {
                return res.status(410).json({
                    status: 410,
                    message: "Tokens are not found or have been used.",
                });
            }

            const now = moment();
            const expired = moment(resetTokenData.expires_at);
            if (now.isAfter(expired)) {
                await deleteResetToken(token);
                return res.status(410).json({
                    status: 410,
                    message: "Token has expired.",
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await updatePassword(resetTokenData.user_id, hashedPassword);
            await deleteResetToken(token);

            return res.status(200).json({
                status: 200,
                message: "The password was successfully reset.Please log in again.",
            });
        } catch (err) {
            console.error("Reset Password Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Server error occurs",
            });
        }
    },
};

module.exports = ResetPasswordController;
