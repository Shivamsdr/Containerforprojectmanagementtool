import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

export const useProjects = () => {
    const queryClient = useQueryClient();

    const { data: projects, isLoading, error } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await api.get("/projects");
            return res.data;
        },
    });

    const createProject = useMutation({
        mutationFn: async (newProject) => {
            const res = await api.post("/projects", newProject);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["projects"]);
        },
    });

    const deleteProject = useMutation({
        mutationFn: async (projectId) => {
            await api.delete(`/projects/${projectId}`);
        },
        onSuccess: (_, projectId) => {
            queryClient.invalidateQueries(["projects"]);
            queryClient.invalidateQueries(["tasks", projectId]);
        },
    });

    return {
        projects,
        isLoading,
        error,
        createProject,
        deleteProject,
    };
};
