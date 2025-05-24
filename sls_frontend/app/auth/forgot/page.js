"use client";

import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import "../../globals.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.includes("@")) return toast.error("Invalid email");

        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/forgot-password`, { email });
            toast.success("Reset Password link has been sent to your email");
            setEmail("");
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to send an email reset";
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
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center">Forgot Password</h2>
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                        required
                    />
                    <button type="submit" disabled={loading} className="bg-[#2E4898] text-white py-2 disabled:bg-blue-400 cursor-pointer hover:bg-blue-800 transition duration-300 ease-in-out rounded">
                        {loading ? "Send..." : "Send a link reset"}
                    </button>
                </form>
                <Image src="/shieldtag_cover.jpg" alt="Cover" loading="eager" width={400} height={0} className="w-full absolute bottom-0 object-cover" />
            </div>
        </div>
    );
}
