import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";

export function useInvitations() {
  const queryClient = useQueryClient();

  const { data: invitations = [], isLoading, refetch } = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const res = await client.get("/invitations");
      return res.data;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (invitationId) => {
      const res = await client.post(`/invitations/${invitationId}/accept`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invitations"]);
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const declineMutation = useMutation({
    mutationFn: async (invitationId) => {
      const res = await client.post(`/invitations/${invitationId}/decline`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invitations"]);
    },
  });

  return {
    invitations,
    isLoading,
    refetch,
    accept: acceptMutation.mutateAsync,
    decline: declineMutation.mutateAsync,
    isAccepting: acceptMutation.isPending,
    isDeclining: declineMutation.isPending,
  };
}
