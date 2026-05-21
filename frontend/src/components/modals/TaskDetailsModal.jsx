import React, { useState, useEffect } from "react";
import { X, Trash2, Save, Calendar, User, Tag, AlertCircle, CheckCircle2, MoreHorizontal, Edit3, Clock, Flag, Layout, Plus } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export default function TaskDetailsModal({ task, projectId, projectOwnerId, onClose }) {
    const { updateTask, deleteTask } = useTasks(projectId);
    const { projects } = useProjects();
    const { user } = useAuth();
    const currentProject = projects?.find(p => p._id === projectId);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: "",
        assignee: "",
        subtasks: []
    });
    const [newSubtask, setNewSubtask] = useState("");

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                status: task.status || "todo",
                priority: task.priority || "medium",
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
                assignee: task.assignee?._id || task.assignee || "",
                subtasks: task.subtasks || []
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSubtask = async () => {
        if (!newSubtask.trim()) return;
        const updatedSubtasks = [...formData.subtasks, { title: newSubtask, completed: false }];

        try {
            await updateTask.mutateAsync({
                id: task._id,
                subtasks: updatedSubtasks
            });
            setFormData(prev => ({ ...prev, subtasks: updatedSubtasks }));
            setNewSubtask("");
        } catch (error) {
            console.error("Failed to add subtask:", error);
        }
    };

    const toggleSubtask = async (index) => {
        const updatedSubtasks = formData.subtasks.map((st, i) => i === index ? { ...st, completed: !st.completed } : st);

        try {
            await updateTask.mutateAsync({
                id: task._id,
                subtasks: updatedSubtasks
            });
            setFormData(prev => ({ ...prev, subtasks: updatedSubtasks }));
        } catch (error) {
            console.error("Failed to toggle subtask:", error);
        }
    };

    const deleteSubtask = async (index) => {
        const updatedSubtasks = formData.subtasks.filter((_, i) => i !== index);

        try {
            await updateTask.mutateAsync({
                id: task._id,
                subtasks: updatedSubtasks
            });
            setFormData(prev => ({ ...prev, subtasks: updatedSubtasks }));
        } catch (error) {
            console.error("Failed to delete subtask:", error);
        }
    };

    const handleSave = async () => {
        try {
            let currentSubtasks = [...formData.subtasks];

            // If there's an un-added subtask typed in the input, add it automatically
            if (newSubtask.trim()) {
                currentSubtasks.push({ title: newSubtask.trim(), completed: false });
                setNewSubtask(""); // Clear the input
            }

            await updateTask.mutateAsync({
                id: task._id,
                ...formData,
                subtasks: currentSubtasks,
                assignee: formData.assignee || null
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to remove this task? This action cannot be undone.")) {
            try {
                await deleteTask.mutateAsync(task._id);
                onClose();
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    const canAdminTask = () => {
        if (!user) return false;
        const userId = user._id || user.id;
        const pOwnerId = projectOwnerId || currentProject?.owner?._id || currentProject?.owner;
        return pOwnerId && String(pOwnerId) === String(userId);
    };

    const canCompleteTask = () => {
        if (!task || !user) return false;
        const userId = user._id || user.id;
        const assigneeId = task.assignee?._id || task.assignee;
        return assigneeId && String(assigneeId) === String(userId);
    };

    if (!task) return null;

    const getStatusStyles = (status) => {
        switch (status) {
            case 'todo': return 'bg-gray-100 text-gray-500 border-gray-100';
            case 'in-progress': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'review': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'done': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-gray-100 text-gray-500 border-gray-100';
        }
    };

    const getPriorityStyles = (priority) => {
        switch ((priority || "normal").toLowerCase()) {
            case 'urgent': return 'bg-red-50 text-red-600 border-red-100';
            case 'high': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'medium': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4 border-none">
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/10 border border-indigo-100/50 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center py-4 px-5 md:p-8 border-b border-gray-50 flex-shrink-0 gap-4 md:gap-0">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
                            <Layout className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="text-2xl font-black text-gray-900 border-b-2 border-indigo-100 focus:border-indigo-600 outline-none bg-transparent w-full transition-colors pb-1"
                                    autoFocus
                                />
                            ) : (
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{task.title}</h2>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 md:ml-6 self-end md:self-auto">
                        {!isEditing ? (
                            canAdminTask() && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-100"
                                    title="Edit Task"
                                >
                                    <Edit3 size={18} />
                                </button>
                            )
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={updateTask.isPending}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-50 font-black text-sm shadow-lg shadow-indigo-100"
                            >
                                <Save size={18} />
                                Update
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-2.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-6 md:p-8 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-10">
                            <div>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    General Description
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={8}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none text-gray-900 font-bold leading-relaxed resize-none transition-all placeholder:text-gray-300"
                                        placeholder="Outline the details of this objective..."
                                    />
                                ) : (
                                    <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100/50">
                                        <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                                            {task.description || <span className="text-gray-400 italic">This task hasn't been detailed yet. Click edit to add context.</span>}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Additional metadata can go here if needed (comments, activity) */}
                        </div>

                        {/* Sidebar Metadata */}
                        <div className="space-y-8">
                            <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100/50 space-y-6">
                                {/* Subtasks Section */}
                                <div className="pt-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 size={14} /> Subtasks
                                        </h3>
                                        {formData.subtasks.length > 0 && (
                                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                                {formData.subtasks.filter(s => s.completed).length}/{formData.subtasks.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {formData.subtasks.map((st, index) => (
                                            <div key={index} className="flex items-center gap-3 group/st p-1">
                                                <input
                                                    type="checkbox"
                                                    checked={st.completed}
                                                    onChange={() => toggleSubtask(index)}
                                                    disabled={!canCompleteTask()}
                                                    className="w-4 h-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                                />
                                                <span className={cn(
                                                    "text-sm font-bold flex-1 transition-all",
                                                    st.completed ? "text-gray-300 line-through" : "text-gray-700"
                                                )}>
                                                    {st.title}
                                                </span>
                                                {canAdminTask() && (
                                                    <button
                                                        onClick={() => deleteSubtask(index)}
                                                        className="opacity-0 group-hover/st:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {canAdminTask() && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add a subtask..."
                                                value={newSubtask}
                                                onChange={(e) => setNewSubtask(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                                className="flex-1 px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 outline-none text-sm font-bold transition-all"
                                            />
                                            <button
                                                onClick={handleAddSubtask}
                                                disabled={!newSubtask.trim() || updateTask.isPending}
                                                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 rounded-xl transition-all text-sm font-bold flex items-center gap-2 shadow-sm"
                                            >
                                                <Plus size={16} />
                                                Add
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Created Info */}
                                {/* Status */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Stage</label>
                                    {isEditing ? (
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-transparent rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="review">Review</option>
                                            <option value="done">Done</option>
                                        </select>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <div className={cn(
                                                "text-[10px] font-black px-4 py-2 rounded-xl border flex items-center justify-center gap-2 tracking-widest uppercase",
                                                getStatusStyles(task.status)
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full", task.status === 'done' ? 'bg-emerald-600' : 'bg-current')} />
                                                {task.status.replace('-', ' ')}
                                            </div>
                                            {['todo', 'in-progress', 'review'].includes(task.status) && canCompleteTask() && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await updateTask.mutateAsync({
                                                                id: task._id,
                                                                status: "done"
                                                            });
                                                        } catch (err) {
                                                            console.error("Failed to mark done", err);
                                                        }
                                                    }}
                                                    className="w-full py-3 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-95 border-none"
                                                >
                                                    <CheckCircle2 size={16} /> Complete Task
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1 flex items-center gap-2">
                                        <Flag size={12} /> Priority
                                    </label>
                                    {isEditing ? (
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-transparent rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    ) : (
                                        <div className={cn(
                                            "text-[10px] font-black px-4 py-2 rounded-xl border flex items-center justify-center gap-2 tracking-widest uppercase",
                                            getPriorityStyles(task.priority)
                                        )}>
                                            {task.priority || "Normal"}
                                        </div>
                                    )}
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1 flex items-center gap-2">
                                        <Clock size={12} /> Deadline
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="datetime-local"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-transparent rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black transition-all"
                                        />
                                    ) : (
                                        <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 text-sm font-black text-gray-700 text-center">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Expiry Set'}
                                        </div>
                                    )}
                                </div>

                                {/* Assignee */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1 flex items-center gap-2">
                                        <User size={12} /> Responsibility
                                    </label>
                                    {isEditing ? (
                                        <select
                                            name="assignee"
                                            value={formData.assignee}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-transparent rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none text-sm font-black transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Vacant</option>
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
                                    ) : (
                                        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                            {task.assignee ? (
                                                <>
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100">
                                                        <div className="w-full h-full rounded-[0.625rem] bg-white flex items-center justify-center text-indigo-600 font-black text-xs">
                                                            {task.assignee.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">{task.assignee.name}</span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Member</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-3 text-gray-400 italic font-medium px-1">
                                                    <div className="w-8 h-8 rounded-xl bg-gray-50 border border-transparent flex items-center justify-center">
                                                        <User size={14} className="text-gray-300" />
                                                    </div>
                                                    <span className="text-xs">Unassigned</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex justify-between items-center absolute bottom-0 left-0 right-0">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Created Record</span>
                        <div className="text-xs font-bold text-gray-600 flex items-center gap-2">
                            <Calendar size={12} className="text-gray-400" />
                            {new Date(task.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                    {canAdminTask() && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-sm border border-red-100 shadow-sm active:scale-95"
                        >
                            <Trash2 size={16} />
                            Delete Task
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

