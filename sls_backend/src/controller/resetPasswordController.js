const {
    getResetToken,
    updatePassword,
    deleteResetToken,
} = require("../model/authModel");
const bcrypt = require("bcryptjs");
const moment = require("moment");
require("dotenv").config();

const ResetPasswordController = {
    reset: async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({
                    status: 400,
                    message: "Token dan password baru wajib diisi",
                });
            }

            const resetTokenData = await getResetToken(token);
            if (!resetTokenData) {
                return res.status(410).json({
                    status: 410,
                    message: "Token tidak ditemukan atau sudah digunakan.",
                });
            }

            const now = moment();
            const expired = moment(resetTokenData.expires_at);
            if (now.isAfter(expired)) {
                await deleteResetToken(token);
                return res.status(410).json({
                    status: 410,
                    message: "Token sudah kadaluarsa.",
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await updatePassword(resetTokenData.user_id, hashedPassword);

            await deleteResetToken(token);

            return res.status(200).json({
                status: 200,
                message: "Password berhasil direset. Silakan login kembali.",
            });
        } catch (err) {
            console.error("ResetPassword Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan server",
            });
        }
    },
};

module.exports = ResetPasswordController;
