import React, { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import { UserPlus, Mail, Shield, User as UserIcon, Layout } from "lucide-react";
import InviteMemberModal from "../modals/InviteMemberModal";

export default function TeamsView({ projectId }) {
    const { projects } = useProjects();
    const [showInviteModal, setShowInviteModal] = useState(false);

    const project = projects?.find(p => p._id === projectId);

    if (!project) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-3xl mb-6">
                <Layout className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No project selected</h3>
            <p className="text-gray-500 font-medium max-w-xs">Select a project to manage its team members and invitations.</p>
        </div>
    );

    const members = project.members || [];

    return (
        <div className="max-w-5xl mx-auto px-4 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Team Collaboration</h2>
                    <p className="text-gray-500 font-medium max-w-md">Manage roles, permissions, and invite new members to <span className="text-indigo-600 font-bold">{project.name}</span>.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 transform hover:-translate-y-1 active:scale-95 text-sm"
                >
                    <UserPlus size={20} />
                    Invite New Member
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Active Members</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {/* Owner Card */}
                    <div className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-[0.875rem] bg-white flex items-center justify-center text-indigo-600 font-black text-xl">
                                    {project.owner?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                    {project.owner?.name}
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-md">You</span>
                                </h4>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                                    <Mail size={14} className="text-gray-400" /> {project.owner?.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-100/50">
                                <Shield size={12} />
                                Project Owner
                            </span>
                        </div>
                    </div>

                    {/* Member Cards */}
                    {members.filter(m => m._id !== project.owner?._id).map(member => (
                        <div key={member._id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-black text-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    {member.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900">{member.name}</h4>
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                                        <Mail size={14} className="text-gray-400" /> {member.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-xs font-black uppercase tracking-wider border border-gray-100 group-hover:bg-white group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                                    <UserIcon size={12} />
                                    Collaborator
                                </span>
                            </div>
                        </div>
                    ))}

                    {members.length === 1 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <UserPlus className="text-gray-300" size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Your team is a bit quiet</h4>
                            <p className="text-gray-500 font-medium mb-8 max-w-xs mx-auto text-sm">Working together is better. Invite your colleagues to collaborate on this project.</p>
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm underline underline-offset-4"
                            >
                                Invite someone now
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showInviteModal && (
                <InviteMemberModal
                    projectId={projectId}
                    onClose={() => setShowInviteModal(false)}
                />
            )}
        </div>
    );
}

