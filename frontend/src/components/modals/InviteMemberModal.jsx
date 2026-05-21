import React, { useState, useEffect } from "react";
import { X, Search, UserPlus, Check, AlertCircle, Loader2 } from "lucide-react";
import client from "../../api/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "../../lib/utils";

export default function InviteMemberModal({ projectId, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inviteStatus, setInviteStatus] = useState(null); // 'loading' | 'success' | 'error'
    const queryClient = useQueryClient();

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const res = await client.get(`/users/search`, { params: { q: query } });
                setResults(res.data.users ?? []);
            } catch (err) {
                console.error("Search failed", err);
                setError(err.response?.data?.message || err.response?.data?.msg || "Failed to search users");
            } finally {
                setIsLoading(false);
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleInvite = async (userId) => {
        setInviteStatus('loading');
        try {
            await client.post(`/projects/${projectId}/invitations`, { userId });

            setInviteStatus('success');
            setError(null);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Invite failed", err);
            setInviteStatus('error');
            setError(err.response?.data?.msg || err.response?.data?.message || "Failed to send invitation");

            setTimeout(() => {
                setInviteStatus(null);
                setError(null);
            }, 3000);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 border-none">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Expand Team</h3>
                        <p className="text-gray-400 text-sm font-medium mt-1">Search for collaborators to invite.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 pb-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find by name or email..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                            autoFocus
                        />
                        {isLoading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 size={18} className="animate-spin text-indigo-500" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {inviteStatus === 'success' && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                            <Check size={16} />
                            Invitation sent successfully!
                        </div>
                    )}

                    <div className="space-y-4">
                        {results.length > 0 ? (
                            results.map(user => (
                                <div key={user._id} className="flex items-center justify-between p-4 bg-white hover:bg-indigo-50/30 rounded-[1.5rem] border border-gray-50 hover:border-indigo-100 transition-all group shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100">
                                            <div className="w-full h-full rounded-[0.625rem] bg-white flex items-center justify-center text-indigo-600 font-black text-xs">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 text-sm tracking-tight">{user.name}</div>
                                            <div className="text-xs text-gray-400 font-medium">{user.email}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleInvite(user._id)}
                                        disabled={inviteStatus === 'loading'}
                                        className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                    >
                                        <UserPlus size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            query.length >= 2 && !isLoading && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                        <Search className="text-gray-300" size={24} />
                                    </div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No users found</p>
                                </div>
                            )
                        )}

                        {query.length < 2 && (
                            <div className="text-center py-12">
                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">Start typing to find scouts</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

