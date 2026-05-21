import React from "react";
import { useTasks } from "../../hooks/useTasks";
import { Calendar as CalendarIcon, Clock, CheckCircle2, User, ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";

export default function CalendarView({ projectId }) {
    const { tasks: groupedTasks, isLoading } = useTasks(projectId);

    if (isLoading) return (
        <div className="max-w-4xl mx-auto px-4">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-[2rem] mb-6" />
            ))}
        </div>
    );

    const allTasks = Object.values(groupedTasks || {}).flat();

    // Sort by due date
    const upcomingTasks = allTasks
        .filter(t => t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return (
        <div className="max-w-4xl mx-auto px-4 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3 flex items-center gap-4">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
                            <CalendarIcon size={24} />
                        </div>
                        Schedule
                    </h2>
                    <p className="text-gray-500 font-medium max-w-md">Track deadlines and upcoming milestones for your active project tasks.</p>
                </div>
            </div>

            <div className="space-y-6">
                {upcomingTasks.map(task => {
                    const dueDate = new Date(task.dueDate);
                    const isOverdue = dueDate < new Date() && task.status !== 'done';

                    return (
                        <div key={task._id} className="group relative flex items-center gap-8 p-8 bg-white rounded-[2rem] border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-default">
                            <div className="flex-shrink-0 w-20 text-center flex flex-col items-center">
                                <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">
                                    {dueDate.toLocaleString('default', { month: 'short' })}
                                </div>
                                <div className="text-3xl font-black text-gray-900 tracking-tighter">
                                    {dueDate.getDate()}
                                </div>
                                {isOverdue && (
                                    <div className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest">
                                        Overdue
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 border-l border-gray-50 pl-8">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h4 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{task.title}</h4>
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${task.status === 'done'
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                        }`}>
                                        {task.status === 'done' ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                        {task.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium line-clamp-1 mb-6 leading-relaxed">
                                    {task.description || "No project notes provided for this task."}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        {task.assignee ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">
                                                    {task.assignee.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-gray-500">{task.assignee.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-300">Unassigned</span>
                                        )}
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Clock size={14} />
                                            <span className="text-xs font-bold">
                                                {dueDate.getHours() === 0 && dueDate.getMinutes() === 0
                                                    ? "All Day"
                                                    : dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {upcomingTasks.length === 0 && (
                    <div className="text-center py-20 px-8 rounded-[3rem] border-2 border-dashed border-gray-100 bg-gray-50/50">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <CalendarIcon className="text-indigo-200" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">Clear schedule</h3>
                        <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">You don't have any upcoming deadlines. Take this time to reflect or start a new ambitious project.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

