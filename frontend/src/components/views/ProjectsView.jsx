import React from "react";
import { useSearchParams } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../context/AuthContext";
import { Skeleton } from "../ui/Skeleton";
import { Plus, FolderOpen, Trash2, ArrowRight, Layout } from "lucide-react";

const colors = [
    { bg: "bg-indigo-50", text: "text-indigo-600", icon: "bg-indigo-600" },
    { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-600" },
    { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-600" },
    { bg: "bg-pink-50", text: "text-pink-600", icon: "bg-pink-600" },
    { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-600" },
];

export default function ProjectsView({ onAddProject }) {
    const { projects, isLoading, deleteProject } = useProjects();
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSelectProject = (projectId) => {
        setSearchParams({ project: projectId, view: "board" });
    };

    const handleDelete = async (e, projectId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this project? This will delete all tasks within it.")) {
            try {
                await deleteProject.mutateAsync(projectId);

                // If the deleted project is currently selected in URL, clear it
                const currentProjectId = searchParams.get("project");
                if (currentProjectId === projectId) {
                    setSearchParams(prev => {
                        const next = new URLSearchParams(prev);
                        next.delete("project");
                        return next;
                    });
                }
            } catch (error) {
                console.error("Failed to delete project:", error);
                alert("Failed to delete project");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Your Projects</h2>
                    <p className="text-gray-500 font-medium max-w-md">Manage your active projects or create a new workspace to start organizing your tasks.</p>
                </div>
                <button
                    onClick={onAddProject}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 transform hover:-translate-y-1 active:scale-95 text-sm"
                >
                    <Plus size={20} />
                    Create New Project
                </button>
            </div>

            {projects?.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, idx) => {
                        const colorSet = colors[idx % colors.length];
                        return (
                            <div
                                key={project._id}
                                onClick={() => handleSelectProject(project._id)}
                                className="group relative flex flex-col p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] transition-all text-left cursor-pointer overflow-hidden transform hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorSet.bg} ${colorSet.text} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <FolderOpen size={28} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed mb-6">
                                        {project.description || "Set a description to help your team understand this project's goals."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                                        Open project <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    {(project.owner?._id?.toString() === user?._id?.toString() || project.owner?._id?.toString() === user?.id?.toString()) && (
                                        <button
                                            onClick={(e) => handleDelete(e, project._id)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                            title="Delete Project"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 px-8 rounded-[3rem] border-2 border-dashed border-gray-100 bg-gray-50/50">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <Layout className="text-indigo-200" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">No projects yet</h3>
                    <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">It looks like your workspace is a bit empty. Start your journey by creating your first project.</p>
                    <button
                        onClick={onAddProject}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1"
                    >
                        <Plus size={20} />
                        Launch First Project
                    </button>
                </div>
            )}
        </div>
    );
}

