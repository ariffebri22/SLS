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
                    <h2 className="text-xl font-bold text-primary mb-4">The session has ended</h2>
                    <p className="text-sm text-gray-600 mb-6">Your login session has ended.Please log in again to continue.</p>
                    <button onClick={handleLoginRedirect} className="bg-[#2E4898] text-white px-4 py-2 rounded-lg cursor-pointer">
                        Login now
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
