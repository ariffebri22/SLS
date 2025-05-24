"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import DOMPurify from "dompurify";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import "../../globals.css";

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
            return toast.error("Names must be filled in at least 2 characters.");
        }

        if (!isValidEmail(email)) {
            return toast.error("Invalid email format.");
        }

        if (!isStrongPassword(password)) {
            return toast.error("A minimum password of 6 characters and a combination of letters/numbers.");
        }

        if (password !== confirmPassword) {
            return toast.error("Password confirmation does not match.");
        }

        if (!agreed) {
            return toast.error("You must approve the Terms & Conditions.");
        }

        if (!captchaToken) {
            return toast.error("Please fill in Captcha.");
        }

        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
                name,
                email,
                password,
                captchaToken,
            });

            toast.success("Successful registration! Please check email for verification.");
            setForm({ name: "", email: "", password: "", confirmPassword: "" });

            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed registration.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Toaster position="top-center" richColors />
            <div className="max-w-md w-full px-10 pt-8 pb-30 shadow-md border border-neutral-300 flex flex-col items-center rounded-4xl font-poppins relative overflow-clip">
                <Image src="/shieldtag_logo.png" alt="Logo" loading="eager" width={300} height={50} />

                <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-center font-poppins">Sign up</h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Nama Lengkap"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Konfirmasi Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                    />
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />I agree to the terms & conditions that apply
                    </label>

                    <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={(token) => setCaptchaToken(token)} />

                    <button type="submit" disabled={loading} className="bg-[#2E4898] text-white py-2 disabled:bg-blue-400 cursor-pointer hover:bg-blue-800 transition duration-300 ease-in-out rounded ">
                        {loading ? "Register..." : "Sign Up"}
                    </button>
                </form>
                <Image src="/shieldtag_cover.jpg" alt="Cover" loading="eager" width={400} height={0} className="w-full absolute bottom-0 object-cover" />
            </div>
        </div>
    );
}
