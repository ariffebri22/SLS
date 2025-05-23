"use client";

import Link from "next/link";

export default function VerifyEmailExpired() {
    return (
        <div className="min-h-screen flex items-center justify-center text-center px-4">
            <div className="max-w-md border p-6 rounded shadow">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Link Verifikasi Tidak Valid atau Sudah Kadaluarsa</h1>
                <p className="mb-6 text-gray-700">Token verifikasi yang kamu gunakan tidak berlaku. Mungkin sudah kadaluarsa atau pernah digunakan.</p>
                <Link href="/auth/login" className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                    Kembali ke Login
                </Link>
            </div>
        </div>
    );
}
