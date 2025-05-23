"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

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
        if (!token) return toast.error("Token tidak ditemukan");
        if (password.length < 6) return toast.error("Password minimal 6 karakter");
        if (password !== confirmPassword) return toast.error("Konfirmasi password tidak cocok");
        if (!captchaToken) return toast.error("Captcha harus diisi");

        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/reset-password`, {
                token,
                newPassword: password,
                captchaToken,
            });
            toast.success("Password berhasil direset!");
            setSuccess(true);
        } catch (err) {
            const msg = err?.response?.data?.message || "Reset password gagal";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Toaster richColors />
            <form onSubmit={handleReset} className="max-w-md w-full border p-6 rounded shadow flex flex-col gap-4">
                <h2 className="text-xl font-bold text-center">Reset Password</h2>
                <input type="password" placeholder="Password baru" value={password} onChange={(e) => setPassword(e.target.value)} className="border px-4 py-2 rounded" required />
                <input type="password" placeholder="Konfirmasi password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border px-4 py-2 rounded" required />
                <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={setCaptchaToken} />
                <button type="submit" disabled={loading} className="bg-black text-white py-2 rounded">
                    {loading ? "Mengirim..." : "Reset Password"}
                </button>
                {success && (
                    <div className="bg-green-100 text-green-700 p-4 mt-4 rounded">
                        Password berhasil direset. <br />
                        <button onClick={() => router.push("/auth/login")} className="underline text-blue-700 mt-2 inline-block">
                            Kembali ke Login
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
