"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    const handleSignup = () => {
        router.push("/auth/regis");
    };

    const handleForgot = () => {
        router.push("/auth/forgot");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.includes("@")) {
            return toast.error("Email tidak valid.");
        }

        if (password.length < 6) {
            return toast.error("Password minimal 6 karakter.");
        }

        setIsSubmitting(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
                email,
                password,
            });

            const authRes = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (!authRes?.ok) {
                setIsSubmitting(false);
                return toast.error("Login gagal. Periksa kembali email dan password.");
            }

            const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user?email=${email}`);
            const userData = userRes.data?.data;

            const ipRes = await fetch("https://api.ipify.org?format=json");
            const ipData = await ipRes.json();

            const deviceInfo = navigator.userAgent;

            const sessionRes = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login-session`, {
                user_id: userData.id,
                email: userData.email,
                username: userData.name,
                ip_address: ipData.ip,
                device_info: deviceInfo,
            });

            localStorage.setItem("session_id", sessionRes.data.session_id);

            setIsSubmitting(false);
            router.push("/");
        } catch (err) {
            setIsSubmitting(false);

            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const msg = err.response?.data?.message;

                if (status === 429) {
                    const waitTime = 30;
                    setCountdown(waitTime);
                    const interval = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(interval);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                    toast.error(msg || "Terlalu banyak percobaan login. Coba lagi nanti.");
                    return;
                }

                toast.error(msg || "Login gagal. Cek koneksi atau akun Anda.");
            } else {
                toast.error("Kesalahan tidak terduga.");
                console.error("Unknown login error:", err);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Toaster richColors />
            <div className="max-w-md w-full px-6 py-8 shadow-md border flex flex-col">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-center">Login</h2>
                    <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border px-4 py-2" />
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} onPaste={(e) => e.preventDefault()} className="border px-4 py-2" />
                    <button type="submit" disabled={isSubmitting || countdown > 0} className="bg-black text-white py-2 disabled:bg-gray-500">
                        {isSubmitting ? "Logging in..." : countdown > 0 ? `Coba lagi dalam ${countdown}s` : "Login"}
                    </button>
                </form>
                <button className="bg-white text-black py-2 border-2 border-black mt-2" onClick={handleSignup}>
                    Sign Up
                </button>
                <div className="w-full flex items-center justify-center mt-4">
                    <span className="underline cursor-pointer hover:text-blue-400 text-center" onClick={handleForgot}>
                        Lupa Password?
                    </span>
                </div>
            </div>
        </div>
    );
}
