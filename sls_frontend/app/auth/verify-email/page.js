"use client";

import Link from "next/link";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full border p-6 text-center shadow rounded">
                <h1 className="text-2xl font-bold mb-4 text-green-600">Verifikasi Email Berhasil!</h1>
                <p className="mb-6 text-gray-700">Terima kasih telah memverifikasi email kamu. Silakan login untuk melanjutkan.</p>
                <Link href="/auth/login" className="bg-black text-white py-2 px-6 rounded inline-block hover:bg-gray-800">
                    Login Sekarang
                </Link>
            </div>
        </div>
    );
}
