import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, MoreHorizontal } from "lucide-react";
import TaskCard from "./TaskCard";

export default function Column({ id, title, tasks, onAddTask, updateTask, ownerId }) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'todo': return 'bg-gray-100 text-gray-500 border-gray-100';
            case 'in-progress': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'review': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'done': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-gray-100 text-gray-500 border-gray-100';
        }
    };

    const statusStyle = getStatusStyles(id);

    return (
        <div className="flex flex-col h-full bg-gray-100/30 rounded-[2.5rem] border border-gray-100/50 overflow-hidden">
            <div className={`p-4 md:p-6 flex items-center justify-between`}>
                <div className="flex items-center gap-2 md:gap-3">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                        {title}
                        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black ${statusStyle}`}>
                            {tasks.length}
                        </span>
                    </h4>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onAddTask}
                        className="hover:bg-indigo-600 hover:text-white p-1.5 rounded-xl transition-all text-gray-400 border border-transparent hover:shadow-lg hover:shadow-indigo-100"
                    >
                        <Plus size={18} />
                    </button>
                    <button className="p-1.5 text-gray-300 hover:text-gray-600 rounded-xl transition-colors">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>

            <div ref={setNodeRef} className="px-3 md:px-5 pb-4 md:pb-6 flex-1 overflow-y-auto min-h-[200px] space-y-4 scrollbar-hide">
                <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task._id} task={task} updateTask={updateTask} ownerId={ownerId} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-center p-4">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Empty Stage</p>
                    </div>
                )}
            </div>
        </div>
    );
}

