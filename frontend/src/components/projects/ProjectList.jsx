import React from "react";
import { Skeleton } from "../ui/Skeleton";
import { useProjects } from "../../hooks/useProjects";
import { useSearchParams } from "react-router-dom";
import { cn } from "../../lib/utils";

export default function ProjectList() {
    const { projects, isLoading } = useProjects();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedProjectId = searchParams.get("project");

    const handleSelectProject = (projectId) => {
        setSearchParams({ project: projectId, view: "board" });
    };

    if (isLoading) {
        return (
            <div className="space-y-3 px-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
            </div>
        );
    }

    const colors = ["bg-purple-400", "bg-blue-400", "bg-emerald-400", "bg-orange-400", "bg-pink-400"];

    return (
        <div className="space-y-1 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide px-2">
            {projects?.map((project, idx) => (
                <button
                    key={project._id}
                    onClick={() => handleSelectProject(project._id)}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                        selectedProjectId === project._id
                            ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                    )}
                >
                    <div className={cn(
                        "w-2 h-2 rounded-full ring-4 transition-all",
                        colors[idx % colors.length],
                        selectedProjectId === project._id ? "ring-indigo-100 shadow-[0_0_12px_rgba(79,70,229,0.3)]" : "ring-transparent group-hover:ring-gray-100"
                    )}></div>
                    <div className="flex-1 text-left">
                        <p className={cn(
                            "text-sm font-bold truncate",
                            selectedProjectId === project._id ? "text-indigo-700" : "text-gray-600 group-hover:text-gray-900"
                        )}>{project.name}</p>
                    </div>
                </button>
            ))}
            {projects?.length === 0 && (
                <div className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest italic text-center">
                    No active projects
                </div>
            )}
        </div>
    );
}

