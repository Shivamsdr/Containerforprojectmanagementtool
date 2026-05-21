import { useEffect } from "react";
import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../config";

const socket = io(API_BASE, {
    autoConnect: false,
});

export default function useSocket(projectId, userId) {
    const queryClient = useQueryClient();

    // Connect and register user for notifications (invitations)
    useEffect(() => {
        if (userId) {
            if (!socket.connected) socket.connect();
            socket.emit("register", userId);
        }
    }, [userId]);

    useEffect(() => {
        if (projectId) {
            if (!socket.connected) socket.connect();
            socket.emit("joinProject", projectId);

            socket.on("taskCreated", () => {
                queryClient.invalidateQueries(["tasks", projectId]);
            });
            socket.on("taskUpdated", () => {
                queryClient.invalidateQueries(["tasks", projectId]);
            });
            socket.on("taskMoved", () => {
                queryClient.invalidateQueries(["tasks", projectId]);
            });
            socket.on("taskDeleted", () => {
                queryClient.invalidateQueries(["tasks", projectId]);
            });
            socket.on("invitationReceived", () => {
                queryClient.invalidateQueries(["invitations"]);
            });

            return () => {
                socket.off("taskCreated");
                socket.off("taskUpdated");
                socket.off("taskMoved");
                socket.off("taskDeleted");
                socket.off("invitationReceived");
                socket.emit("leaveProject", projectId);
            };
        }
    }, [projectId, queryClient]);

    // Listen for invitations even when no project selected
    useEffect(() => {
        if (!userId) return;
        socket.on("invitationReceived", () => {
            queryClient.invalidateQueries(["invitations"]);
        });
        return () => socket.off("invitationReceived");
    }, [userId, queryClient]);

    return socket;
}
