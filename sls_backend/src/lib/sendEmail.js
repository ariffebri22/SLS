const nodemailer = require("nodemailer");

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
    const url = `${process.env.CLIENT_URL}/verify-recover?token=${token}`;
    const html = `
    <h3>Akun kamu sementara dibekukan</h3>
    <p>Klik link di bawah untuk mengaktifkan kembali akunmu:</p>
    <a href="${url}" style="padding: 8px 16px; background: #28a745; color: white; text-decoration: none;">Aktifkan Akun</a>
  `;

    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Aktivasi Ulang Akun Kamu",
        html,
    });
};

const sendVerificationEmail = async (to, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = `
      <h3>Verifikasi Email Kamu</h3>
      <p>Klik tombol di bawah untuk mengaktifkan akun kamu:</p>
      <a href="${url}" style="padding: 8px 16px; background: #0d6efd; color: white; text-decoration: none;">Verifikasi Sekarang</a>
    `;

    await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Verifikasi Akun",
        html,
    });
};

module.exports = {
    sendReverifyEmail,
    sendVerificationEmail,
};
