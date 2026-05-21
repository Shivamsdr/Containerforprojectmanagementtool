import React, { useState } from "react";
import { X, CheckSquare, Calendar, User, Flag, Plus } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";

export default function CreateTaskModal({ projectId, onClose, initialStatus = "todo" }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [assignee, setAssignee] = useState("");

    const { createTask } = useTasks(projectId);
    const { projects } = useProjects();
    const currentProject = projects?.find(p => p._id === projectId);

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            setError("Task title is required");
            return;
        }

        try {
            await createTask.mutateAsync({
                title,
                description,
                priority,
                dueDate,
                status: initialStatus,
                assignee: assignee || null
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to create task");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 border-none">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 w-full max-w-lg relative shadow-2xl shadow-indigo-500/10 border border-indigo-100/50 transform transition-all animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-8 md:right-8 text-gray-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-xl transition-all"
                >
                    <X size={20} />
                </button>

                <div className="mb-8 md:mb-10 mt-4 md:mt-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
                            <CheckSquare className="text-white" size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add Task</h2>
                    </div>
                    <p className="text-gray-500 font-medium">Define a new objective in <span className="text-indigo-600 font-bold">{currentProject?.name}</span>.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                            Task Title
                        </label>
                        <input
                            type="text"
                            autoFocus
                            className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm md:text-base"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be accomplished?"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                            Project Notes
                        </label>
                        <textarea
                            className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none min-h-[100px] text-sm md:text-base"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add context, links, or specific requirements..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                                <Flag size={12} /> Priority
                            </label>
                            <select
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                                <Calendar size={12} /> Deadline
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                            <User size={12} /> Responsibility
                        </label>
                        <select
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                        >
                            <option value="">Keep Unassigned</option>
                            {currentProject?.owner && (
                                <option value={currentProject.owner._id}>
                                    {currentProject.owner.name} (Owner)
                                </option>
                            )}
                            {currentProject?.members?.map(m => (
                                <option key={m._id} value={m._id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-3 pt-6">
                        <button
                            type="submit"
                            disabled={createTask.isPending}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all border-none active:scale-[0.98]"
                        >
                            {createTask.isPending ? "Adding Task..." : "Launch Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

