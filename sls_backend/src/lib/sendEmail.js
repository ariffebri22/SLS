const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendReverifyEmail = async (to, token) => {
    const url = `${process.env.API_URL}/user/verify-recover?token=${token}`;
    const html = `
    <h3>Your account is temporarily frozen</h3>
    <p>Click the link below to reactivate your account:</p>
    <a href="${url}" style="padding: 8px 16px; background: #28a745; color: white; text-decoration: none;">Activate the account</a>
  `;

    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Re -activate your account",
        html,
    });
};

const sendVerificationEmail = async (to, token) => {
    const url = `${process.env.API_URL}/user/verify-email?token=${token}`;
    const html = `
      <h3>Verify your email</h3>
      <p>Click the button below to activate your account:</p>
      <a href="${url}" style="padding: 8px 16px; background: #0d6efd; color: white; text-decoration: none;">Verification now</a>
    `;

    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Account Verification",
        html,
    });
};

module.exports = {
    sendReverifyEmail,
    sendVerificationEmail,
};
