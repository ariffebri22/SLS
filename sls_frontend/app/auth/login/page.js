"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import "../../globals.css";

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
            return toast.error("Invalid email.");
        }

        if (password.length < 6) {
            return toast.error("A minimum password of 6 characters.");
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
                return toast.error("Login fails.Check back the email and password.");
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

                    toast.error(msg || "Too many login experiments.Try again later.");
                    return;
                }

                toast.error(msg || "Login fails.Check your connection or account.");
            } else {
                toast.error("Unexpected mistakes.");
                // console.error("Unknown login error:", err);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Toaster position="top-center" richColors />
            <div className="max-w-md w-full px-10 pt-8 pb-30 shadow-md border border-neutral-300 flex flex-col items-center rounded-4xl font-poppins relative overflow-clip">
                <Image src="/shieldtag_logo.png" alt="Logo" loading="eager" width={300} height={50} />
                <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                    <h2 className="text-xl font-semibold text-center font-poppins">Sign In</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onPaste={(e) => e.preventDefault()}
                        className="border border-neutral-400 outline-none focus:border-2 focus:border-[#2E4898] transition duration-300 ease-in-out rounded-lg px-4 py-2"
                    />
                    <button type="submit" disabled={isSubmitting || countdown > 0} className="bg-[#2E4898] text-white py-2 disabled:bg-blue-400 cursor-pointer hover:bg-blue-800 transition duration-300 ease-in-out rounded ">
                        {isSubmitting ? "Logging in..." : countdown > 0 ? `Try again in ${countdown}s` : "Login"}
                    </button>
                </form>
                <button className="bg-white w-full text-[#2E4898] py-2 border-2 border-[#2E4898] mt-2 cursor-pointer hover:bg-blue-800 transition duration-300 ease-in-out rounded hover:text-white" onClick={handleSignup}>
                    Sign Up
                </button>
                <div className="w-full flex items-center justify-center mt-4">
                    <span className="underline cursor-pointer hover:text-blue-400 text-center" onClick={handleForgot}>
                        Forgot Password?
                    </span>
                </div>
                <Image src="/shieldtag_cover.jpg" alt="Cover" loading="eager" width={400} height={0} className="w-full absolute bottom-0 object-cover" />
            </div>
        </div>
    );
}
