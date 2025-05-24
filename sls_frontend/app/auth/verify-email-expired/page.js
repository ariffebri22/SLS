"use client";

import Link from "next/link";
import Image from "next/image";
import "../../globals.css";

export default function VerifyEmailExpired() {
    return (
        <div className="min-h-screen flex items-center justify-center text-center px-4">
            <div className="max-w-md border p-6 rounded-4xl shadow border-neutral-300 font-poppins flex flex-col items-center">
                <Image src="/shieldtag_logo.png" alt="Logo" loading="eager" width={300} height={50} />
                <h1 className="text-2xl font-bold text-red-600 mb-4">Verification link is invalid or has expired</h1>
                <p className="mb-6 text-gray-700">The verification token that you use is not valid.Maybe it has expired or ever used.</p>
                <Link href="/auth/login" className="inline-block px-6 py-2 bg-[#2E4898] text-white rounded hover:bg-blue-800 transition">
                    Back to login
                </Link>
            </div>
        </div>
    );
}
