"use client";

import Link from "next/link";

export default function VerifyRecoverSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center text-center px-4">
            <div className="max-w-md border p-6 rounded shadow">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Akun Berhasil Diaktifkan Kembali</h1>
                <p className="mb-6 text-gray-700">Sekarang kamu bisa login kembali dengan akunmu.</p>
                <Link href="/auth/login" className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                    Login Sekarang
                </Link>
            </div>
        </div>
    );
}
