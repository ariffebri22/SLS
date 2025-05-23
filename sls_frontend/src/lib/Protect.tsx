"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Protect() {
    const { data: session, status } = useSession();
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            setShowModal(true);
        }
    }, [status]);

    const handleLoginRedirect = () => {
        router.push("/auth/login");
    };

    if (status === "loading") return null;

    if (status === "unauthenticated" && showModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center animate-fade-in">
                    <h2 className="text-xl font-bold text-primary mb-4">
                        Sesi Telah Berakhir
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Sesi login Anda telah berakhir. Silakan login kembali
                        untuk melanjutkan.
                    </p>
                    <button
                        onClick={handleLoginRedirect}
                        className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Login Sekarang
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
