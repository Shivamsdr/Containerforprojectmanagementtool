import React from "react";
import {
    Layout,
    CheckSquare,
    Users,
    Calendar,
    Plus,
    ChevronRight,
    Search
} from "lucide-react";
import ProjectList from "../projects/ProjectList";
import { cn } from "../../lib/utils";

export default function Sidebar({ selectedView, setSelectedView, onAddProject, isOpen, onClose }) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 bg-white border-r border-gray-100 flex flex-col w-72 h-full z-40 transform transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:relative md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Branding */}
                <div className="px-8 py-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
                            <Layout className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">Doer</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Management</p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="px-4 flex-1 overflow-y-auto space-y-8">
                    <div>
                        <p className="px-4 mb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">General</p>
                        <nav className="space-y-1">
                            <SidebarLink
                                icon={<CheckSquare size={20} />}
                                label="Projects"
                                isActive={selectedView === "projects"}
                                onClick={() => setSelectedView("projects")}
                            />
                            <SidebarLink
                                icon={<Users size={20} />}
                                label="Teams"
                                isActive={selectedView === "teams"}
                                onClick={() => setSelectedView("teams")}
                            />
                            <SidebarLink
                                icon={<Calendar size={20} />}
                                label="Calendar"
                                isActive={selectedView === "calendar"}
                                onClick={() => setSelectedView("calendar")}
                            />
                        </nav>
                    </div>

                    {/* Project List Section */}
                    <div>
                        <div className="px-4 flex items-center justify-between mb-4">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Your Projects</p>
                            <button
                                onClick={onAddProject}
                                className="p-1 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="px-2">
                            <ProjectList />
                        </div>
                    </div>
                </div>

                {/* Bottom Section/Account info could go here or in header */}
                <div className="p-6 border-t border-gray-50">
                    <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                        <p className="text-xs font-bold text-indigo-700 mb-1">Standard Plan</p>
                        <p className="text-[10px] text-indigo-500 font-medium leading-relaxed">Upgrade to Pro for unlimited teams and advanced analytics.</p>
                        <button className="mt-3 w-full bg-white text-indigo-600 text-[11px] font-bold py-2 rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function SidebarLink({ icon, label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                isActive
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
        >
            <div className="flex items-center gap-3 font-bold text-sm">
                <span className={cn(
                    "transition-colors",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600"
                )}>
                    {icon}
                </span>
                {label}
            </div>
            {isActive && <ChevronRight size={16} className="text-white/60" />}
        </button>
    );
}

