const { findUserByEmail, insertResetToken } = require("../model/authModel");
const nodemailer = require("nodemailer");
const moment = require("moment");
require("dotenv").config();

const ForgotPasswordController = {
    sendResetEmail: async (req, res, next) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 400,
                    message: "Email is required",
                });
            }

            const user = await findUserByEmail(email);
            console.log(user);

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: "Email not found",
                });
            }

            const expiresAt = moment().add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
            const { token } = await insertResetToken(user.id, expiresAt);

            const transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetUrl = `${process.env.CLIENT_URL}/auth/change?token=${token}`;
            const mailOptions = {
                from: `"Noreply" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Reset Password",
                html: `
            <p>Halo <strong>${user.username || user.email}</strong>,</p>
            <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
            <p>Silakan klik tombol di bawah ini untuk melanjutkan:</p>
            <a href="${resetUrl}" style="padding:10px 20px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">Reset Password</a>
            <p>Link ini hanya berlaku selama 1 jam.</p>
            <p>Jika Anda tidak merasa melakukan permintaan ini, abaikan saja email ini.</p>
          `,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({
                status: 200,
                message: "Reset password link has been sent to your email.",
                data: { email, token },
            });
        } catch (err) {
            console.error("ForgotPassword Error:", err);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    },
};

module.exports = ForgotPasswordController;
