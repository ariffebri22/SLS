"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import DOMPurify from "dompurify";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isStrongPassword = (password) => password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

    const handleRegister = async (e) => {
        e.preventDefault();

        // Sanitasi input
        const name = DOMPurify.sanitize(form.name.trim());
        const email = DOMPurify.sanitize(form.email.trim().toLowerCase());
        const password = DOMPurify.sanitize(form.password);
        const confirmPassword = DOMPurify.sanitize(form.confirmPassword);

        // Validasi
        if (!name || name.length < 2) {
            return toast.error("Nama wajib diisi minimal 2 karakter.");
        }

        if (!isValidEmail(email)) {
            return toast.error("Format email tidak valid.");
        }

        if (!isStrongPassword(password)) {
            return toast.error("Password minimal 6 karakter dan kombinasi huruf/angka.");
        }

        if (password !== confirmPassword) {
            return toast.error("Konfirmasi password tidak cocok.");
        }

        if (!agreed) {
            return toast.error("Kamu harus menyetujui syarat & ketentuan.");
        }

        if (!captchaToken) {
            return toast.error("Harap isi captcha.");
        }

        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
                name,
                email,
                password,
                captchaToken,
            });

            toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.");
            setForm({ name: "", email: "", password: "", confirmPassword: "" });

            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (err) {
            const msg = err.response?.data?.message || "Registrasi gagal.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Toaster richColors />
            <form onSubmit={handleRegister} className="w-full max-w-md border shadow p-6 flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-center">Registrasi</h2>

                <input type="text" name="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} required className="border px-4 py-2 rounded" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border px-4 py-2 rounded" />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="border px-4 py-2 rounded" />
                <input type="password" name="confirmPassword" placeholder="Konfirmasi Password" value={form.confirmPassword} onChange={handleChange} required className="border px-4 py-2 rounded" />
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    Saya menyetujui syarat & ketentuan yang berlaku
                </label>

                <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={(token) => setCaptchaToken(token)} />

                <button type="submit" disabled={loading} className="bg-black text-white py-2 rounded disabled:bg-gray-500">
                    {loading ? "Mendaftarkan..." : "Daftar"}
                </button>
            </form>
        </div>
    );
}
