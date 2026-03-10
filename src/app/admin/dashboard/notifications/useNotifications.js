import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchNotifications, markAllNotificationsRead } from "./notifications.api";

export function useNotifications() {
    return useQuery({
        queryKey: queryKeys.admin.notifications,
        queryFn: fetchNotifications,
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: () => {
            // Invalidate the cache to trigger a re-fetch, or optimistically update
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.notifications });
        },
    });
}
