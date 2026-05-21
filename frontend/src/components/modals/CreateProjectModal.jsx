import React, { useState } from "react";
import { X, Layout } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";

export default function CreateProjectModal({ onClose }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { createProject } = useProjects();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError("Project name is required");
            return;
        }

        try {
            await createProject.mutateAsync({ name, description });
            onClose();
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.message || "Failed to create project");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 border-none">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md relative shadow-2xl shadow-indigo-500/10 border border-indigo-100/50 transform transition-all animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-gray-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-xl transition-all"
                >
                    <X size={20} />
                </button>

                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
                        <Layout className="text-white" size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">New Project</h2>
                    <p className="text-gray-500 font-medium mt-2">Initialize a workspace to organize your team.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                            Project Name
                        </label>
                        <input
                            type="text"
                            autoFocus
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Project Apollo"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                            Description
                        </label>
                        <textarea
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none min-h-[120px]"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Outline the goals and primary objectives of this workspace..."
                        />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={createProject.isPending}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all border-none active:scale-[0.98]"
                        >
                            {createProject.isPending ? "Creating Workspace..." : "Create Project"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-4 text-gray-400 font-black hover:text-gray-600 transition-colors bg-transparent border-none"
                        >
                            Nevermind, go back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

