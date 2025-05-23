"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.includes("@")) {
            return toast.error("Email tidak valid.");
        }

        if (password.length < 6) {
            return toast.error("Password minimal 6 karakter.");
        }

        setIsSubmitting(true);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        setIsSubmitting(false);

        if (res.ok) {
            router.push("/");
        } else {
            console.warn("Login gagal:", {
                email,
                time: new Date().toISOString(),
            });
            toast.error("Login gagal. Periksa kembali email dan password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Toaster richColors />
            <form
                onSubmit={handleLogin}
                className="flex flex-col gap-4 max-w-md w-full px-6 py-8 shadow-md border"
            >
                <h2 className="text-xl font-semibold text-center">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-4 py-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    className="border px-4 py-2"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white py-2 disabled:bg-gray-500"
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
