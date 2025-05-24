"use client";

import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import axios from "axios";

const Protect = dynamic(() => import("../src/lib/Protect"), { ssr: false });

export default function Home() {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("login_time");
    const [sortOrder, setSortOrder] = useState("desc");

    const handleConfirmLogout = async () => {
        const session_id = localStorage.getItem("session_id");

        try {
            if (session_id) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout-session`, { session_id });
                localStorage.removeItem("session_id");
            }

            await signOut({ callbackUrl: "/auth/login" });
        } catch (err) {
            console.error("Failed to log out session to backend:", err);
            alert("Logout failed.Try repeating.");
        }
    };

    useEffect(() => {
        const fetchSessions = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login-session?email=${session.user.email}`);
                setSessions(res.data.sessions || []);
            } catch (err) {
                console.error("Failed to take the login session:", err);
            } finally {
                setLoadingSessions(false);
            }
        };

        fetchSessions();
    }, [session]);

    const filteredSessions = sessions
        .filter((s) => (filterStatus === "all" ? true : s.status_login === filterStatus))
        .sort((a, b) => {
            const aVal = new Date(a[sortBy]);
            const bVal = new Date(b[sortBy]);
            return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        });

    return (
        <section>
            <Protect />
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {session?.user?.name || session?.user?.email}!</h1>

                <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    Logout
                </button>

                <div className="mt-8 w-full max-w-4xl">
                    <h2 className="text-lg font-semibold mb-2">Login history</h2>

                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                        <div>
                            <label className="mr-2">Filter status:</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border px-2 py-1 rounded">
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Not active</option>
                            </select>
                        </div>
                        <div>
                            <label className="mr-2">Urutkan:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-2 py-1 rounded">
                                <option value="login_time">Login</option>
                                <option value="logout_time">Logout</option>
                            </select>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="ml-2 border px-2 py-1 rounded">
                                <option value="desc">Latest</option>
                                <option value="asc">The longest</option>
                            </select>
                        </div>
                    </div>

                    {loadingSessions ? (
                        <p>Load the login session ...</p>
                    ) : filteredSessions.length === 0 ? (
                        <p className="text-gray-500">There is no data according to the filter.To view data, please refresh page or try log out and login again</p>
                    ) : (
                        <div className="overflow-auto border rounded">
                            <table className="w-full text-sm table-auto">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Login</th>
                                        <th className="p-2 text-left">Logout</th>
                                        <th className="p-2 text-left">Duration</th>
                                        <th className="p-2 text-left">Status</th>
                                        <th className="p-2 text-left">IP</th>
                                        <th className="p-2 text-left">Device</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSessions.map((s, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-2">{s.login_time || "-"}</td>
                                            <td className="p-2">{s.logout_time || "-"}</td>
                                            <td className="p-2">{s.login_duration || "-"}</td>
                                            <td className="p-2 capitalize">{s.status_login}</td>
                                            <td className="p-2">{s.ip_address}</td>
                                            <td className="p-2">{s.device_info?.length > 30 ? `${s.device_info.slice(0, 30)}...` : s.device_info}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Konfirmasi Logout */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold mb-4">Sure you want to log out?</h2>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleConfirmLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Yes, I'm sure
                            </button>
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
