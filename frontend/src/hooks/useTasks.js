import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

export const useTasks = (projectId) => {
    const queryClient = useQueryClient();

    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ["tasks", projectId],
        queryFn: async () => {
            if (!projectId) return { todo: [], "in-progress": [], review: [], done: [] };
            const res = await api.get(`/projects/${projectId}/tasks`);
            return res.data;
        },
        enabled: !!projectId,
    });

    const createTask = useMutation({
        mutationFn: async (newTask) => {
            const res = await api.post("/tasks", { ...newTask, project: projectId });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks", projectId]);
        },
    });

    const updateTask = useMutation({
        mutationFn: async ({ id, ...updates }) => {
            const res = await api.put(`/tasks/${id}`, updates);
            return res.data;
        },
        onMutate: async ({ id, status, newOrder }) => {
            await queryClient.cancelQueries(["tasks", projectId]);
            const previousTasks = queryClient.getQueryData(["tasks", projectId]);

            if (previousTasks) {
                const newTasks = JSON.parse(JSON.stringify(previousTasks));
                // Find task
                let task;
                let sourceStatus;

                for (const s of Object.keys(newTasks)) {
                    const foundIndex = newTasks[s].findIndex(t => t._id === id);
                    if (foundIndex !== -1) {
                        task = newTasks[s][foundIndex];
                        sourceStatus = s;
                        newTasks[s].splice(foundIndex, 1);
                        break;
                    }
                }

                if (task) {
                    const destStatus = status || sourceStatus;
                    task.status = destStatus;
                    // If moving to new column, or reordering in same
                    // We need to insert at correct index.
                    // newOrder is index-based in our frontend logic

                    if (!newTasks[destStatus]) newTasks[destStatus] = [];

                    // Simple insertion at index
                    // If newOrder is undefined, append
                    if (newOrder !== undefined) {
                        newTasks[destStatus].splice(newOrder, 0, task);
                    } else {
                        newTasks[destStatus].push(task);
                    }

                    // We don't need to recalculate all 'order' fields for optimistic UI
                    // because the list order determines display. 
                    // Backend will handle the persistent 'order' values.

                    queryClient.setQueryData(["tasks", projectId], newTasks);
                }
            }

            return { previousTasks };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks", projectId], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(["tasks", projectId]);
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks", projectId]);
        },
    });

    return {
        tasks,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
    };
};
