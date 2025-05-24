"use client";

import Link from "next/link";
import Image from "next/image";
import "../../globals.css";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full border p-6 text-center shadow flex flex-col items-center rounded-4xl border-neutral-300 font-poppins">
                <Image src="/shieldtag_logo.png" alt="Logo" loading="eager" width={300} height={50} />
                <h1 className="text-2xl font-bold mb-4 text-green-600">Email verification successful!</h1>
                <p className="mb-6 text-gray-700">Thank you for verifying your email.Please login to continue.</p>
                <Link href="/auth/login" className="bg-[#2E4898] text-white py-2 px-6 rounded inline-block hover:bg-blue-800">
                    Login now
                </Link>
            </div>
        </div>
    );
}
