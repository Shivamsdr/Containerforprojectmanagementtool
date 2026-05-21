import React, { useState, memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreVertical, MessageSquare, Clock, CheckCircle2, GripVertical, AlertCircle, UserIcon } from "lucide-react";
import TaskDetailsModal from "../modals/TaskDetailsModal";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

function getPriorityStyles(priority) {
    switch ((priority || "normal").toLowerCase()) {
        case 'high': return 'bg-red-50 text-red-600 border-red-100';
        case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
        case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
}

const TaskCard = memo(({ task, updateTask, isOverlay, ownerId }) => {
    const { user } = useAuth();
    const [showDetails, setShowDetails] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task._id,
        disabled: isOverlay
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const canAdminTask = () => {
        if (!task || !user) return false;
        const userId = user._id || user.id;
        const actualOwnerId = ownerId || task.projectOwnerId;
        return actualOwnerId && String(actualOwnerId) === String(userId);
    };

    const canCompleteTask = () => {
        if (!task || !user) return false;
        const userId = user._id || user.id;
        const assigneeId = task.assignee?._id || task.assignee;
        return assigneeId && String(assigneeId) === String(userId);
    };

    const handleMarkDone = async (e) => {
        e.stopPropagation();
        if (updateTask) {
            try {
                await updateTask.mutateAsync({
                    id: task._id,
                    status: "done"
                });
            } catch (err) {
                console.error("Failed to mark done", err);
            }
        }
    };

    const priorityStyle = getPriorityStyles(task.priority);

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                onClick={() => setShowDetails(true)}
                className={cn(
                    "group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]",
                    isDragging ? "opacity-30" : "opacity-100",
                    isOverlay && "shadow-2xl shadow-indigo-500/10 border-indigo-200"
                )}
            >
                {/* Drag Handle Indicator */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-indigo-400 cursor-grab active:cursor-grabbing transition-opacity"
                >
                    <GripVertical size={16} />
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className={cn(
                            "text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider border",
                            priorityStyle
                        )}>
                            {task.priority || "Normal"}
                        </span>

                        <div className="flex items-center gap-1">
                            {['todo', 'in-progress', 'review'].includes(task.status) && canCompleteTask() && (
                                <button
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={handleMarkDone}
                                    className="text-gray-300 hover:text-emerald-500 p-1.5 rounded-xl transition-all hover:bg-emerald-50"
                                    title="Quick Complete"
                                >
                                    <CheckCircle2 size={18} />
                                </button>
                            )}
                            <button
                                className="text-gray-300 hover:text-gray-600 p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    <h4 className="text-base font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2 tracking-tight">
                        {task.title}
                    </h4>

                    <p className="text-xs text-gray-400 font-medium line-clamp-2 mb-6 leading-relaxed">
                        {task.description || "Take a moment to add some details to this task."}
                    </p>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <MessageSquare size={14} />
                                <span className="text-[10px] font-black uppercase">0</span>
                            </div>
                            {task.dueDate && (
                                <div className={cn(
                                    "flex items-center gap-1.5",
                                    new Date(task.dueDate) < new Date() && task.status !== 'done' ? "text-red-400" : "text-gray-400"
                                )}>
                                    <Clock size={14} />
                                    <span className="text-[10px] font-black uppercase">
                                        {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            )}
                            {task.subtasks && task.subtasks.length > 0 && (
                                <div className="flex items-center gap-1.5 text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                    <CheckCircle2 size={12} />
                                    <span className="text-[10px] font-black tracking-tight">
                                        {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                    </span>
                                </div>
                            )}
                        </div>

                        {task.assignee ? (
                            <div
                                className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100 transform group-hover:scale-110 transition-transform"
                                title={task.assignee.name}
                            >
                                <div className="w-full h-full rounded-[0.625rem] bg-white flex items-center justify-center text-indigo-600 font-black text-[10px]">
                                    {task.assignee.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 text-[10px] font-black border border-gray-100">
                                <UserIcon size={14} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDetails && (
                <TaskDetailsModal
                    task={task}
                    projectId={task.project}
                    projectOwnerId={ownerId}
                    onClose={(e) => {
                        e?.stopPropagation();
                        setShowDetails(false);
                    }}
                />
            )}
        </>
    );
});

export default TaskCard;
