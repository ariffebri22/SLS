"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import "../../globals.css";

export default function ChangePasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        if (!token) return toast.error("Token was not found");
        if (password.length < 6) return toast.error("A minimum password of 6 characters");
        if (password !== confirmPassword) return toast.error("Password confirmation does not match");
        if (!captchaToken) return toast.error("Captcha must be filled");

        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/reset-password`, {
                token,
                newPassword: password,
                captchaToken,
            });
            toast.success("The password was successfully reset!");
            setSuccess(true);
        } catch (err) {
            const msg = err?.response?.data?.message || "Reset the password failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Toaster richColors />
            <div className="max-w-md w-full px-10 pt-8 pb-30 shadow-md border border-neutral-300 flex flex-col items-center rounded-4xl font-poppins relative overflow-clip">
                <Image src="/shieldtag_logo.png" alt="Logo" loading="eager" width={300} height={50} />

                <form onSubmit={handleReset} className="w-full flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center font-poppins">Reset Password</h2>
                    <input
                        type="password"
                        placeholder="Password baru"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Konfirmasi password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                        required
                    />
                    <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={setCaptchaToken} />
                    <button type="submit" disabled={loading} className="bg-[#2E4898] text-white py-2 disabled:bg-blue-400 cursor-pointer hover:bg-blue-800 transition duration-300 ease-in-out rounded">
                        {loading ? "Send..." : "Reset Password"}
                    </button>
                    {success && (
                        <div className="bg-green-100 text-green-700 p-4 mt-4 rounded font-poppins">
                            The password was successfully reset. <br />
                            <button onClick={() => router.push("/auth/login")} className="underline text-blue-700 mt-2 inline-block font-poppins">
                                Back to login
                            </button>
                        </div>
                    )}
                </form>
                <Image src="/shieldtag_cover.jpg" alt="Cover" loading="eager" width={400} height={0} className="w-full absolute bottom-0 object-cover" />
            </div>
        </div>
    );
}
