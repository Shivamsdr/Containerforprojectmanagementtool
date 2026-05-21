import React, { useState } from "react";
import {
    DndContext,
    rectIntersection,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Skeleton } from "../ui/Skeleton";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import CreateTaskModal from "../modals/CreateTaskModal";
import { Layout } from "lucide-react";

export default function KanbanBoard({ projectId }) {
    const { tasks: groupedTasks, isLoading, updateTask } = useTasks(projectId);
    const { projects } = useProjects();
    const [activeId, setActiveId] = useState(null);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [createTaskStatus, setCreateTaskStatus] = useState("todo");

    const project = projects?.find(p => p._id === projectId);
    const ownerId = project?.owner?._id || project?.owner;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        const allTasks = Object.values(groupedTasks || {}).flat();
        const activeTask = allTasks.find(t => t._id === activeId);

        if (!activeTask) {
            setActiveId(null);
            return;
        }

        let destStatus = overId;
        let newOrder = 0;

        const overTask = allTasks.find(t => t._id === overId);
        if (overTask) {
            destStatus = overTask.status;
            newOrder = overTask.order;
        } else {
            const destTasks = groupedTasks[destStatus] || [];
            if (destTasks.length > 0) {
                newOrder = destTasks[destTasks.length - 1].order + 1;
            } else {
                newOrder = 0;
            }
        }

        if (activeTask.status !== destStatus || activeTask.order !== newOrder) {
            updateTask.mutate({
                id: activeId,
                status: destStatus,
                newOrder: newOrder
            });
        }

        setActiveId(null);
    };

    if (isLoading) {
        return (
            <div className="flex gap-8 h-full pb-8 overflow-hidden px-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-80 flex-shrink-0 flex flex-col gap-6">
                        <Skeleton className="h-14 w-full rounded-2xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-40 w-full rounded-3xl" />
                            <Skeleton className="h-40 w-full rounded-3xl" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!projectId) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-indigo-50 p-6 rounded-3xl mb-6">
                <Layout className="text-indigo-400" size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No active project</h3>
            <p className="text-gray-500 font-medium max-w-xs">Select a project from the sidebar to view its kanban board.</p>
        </div>
    );

    const columns = ["todo", "in-progress", "review", "done"];
    const columnTitles = {
        "todo": "Planning",
        "in-progress": "Working",
        "review": "Review",
        "done": "Completed"
    };

    const findTask = (id) => Object.values(groupedTasks || {}).flat().find(t => t._id === id);

    return (
        <div className="flex h-full overflow-x-auto gap-4 md:gap-8 pb-8 px-2 md:px-4 scrollbar-hide">
            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {columns.map((colId) => (
                    <div key={colId} className="w-[280px] md:w-80 flex-shrink-0">
                        <Column
                            id={colId}
                            title={columnTitles[colId]}
                            tasks={groupedTasks?.[colId] || []}
                            updateTask={updateTask}
                            ownerId={ownerId}
                            onAddTask={() => {
                                setCreateTaskStatus(colId);
                                setShowCreateTask(true);
                            }}
                        />
                    </div>
                ))}

                <DragOverlay dropAnimation={null}>
                    {activeId ? (
                        <div className="rotate-3 scale-105 transition-transform">
                            <TaskCard task={findTask(activeId)} updateTask={updateTask} ownerId={ownerId} isOverlay />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {showCreateTask && (
                <CreateTaskModal
                    projectId={projectId}
                    onClose={() => setShowCreateTask(false)}
                    initialStatus={createTaskStatus}
                />
            )}
        </div>
    );
}

