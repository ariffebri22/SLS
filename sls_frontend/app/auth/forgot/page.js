"use client";

import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.includes("@")) return toast.error("Email tidak valid");

        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/forgot-password`, { email });
            toast.success("Link reset password telah dikirim ke email kamu");
            setEmail("");
        } catch (err) {
            const msg = err?.response?.data?.message || "Gagal mengirim email reset";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Toaster richColors />
            <form onSubmit={handleSubmit} className="max-w-md w-full border p-6 rounded shadow flex flex-col gap-4">
                <h2 className="text-xl font-bold text-center">Lupa Password</h2>
                <input type="email" placeholder="Email kamu" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-4 py-2 rounded" required />
                <button type="submit" disabled={loading} className="bg-black text-white py-2 rounded">
                    {loading ? "Mengirim..." : "Kirim Link Reset"}
                </button>
            </form>
        </div>
    );
}
