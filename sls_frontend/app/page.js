"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const Protect = dynamic(() => import("../src/lib/Protect"), { ssr: false });

export default function Home() {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState(false);

    const handleConfirmLogout = () => {
        signOut({ callbackUrl: "/auth/login" });
    };

    return (
        <section>
            <Protect />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">
                    Selamat Datang,{" "}
                    {session?.user?.name || session?.user?.email}
                </h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

            {/* Modal Konfirmasi Logout */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold mb-4">
                            Yakin ingin logout?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Ya, Logout
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
