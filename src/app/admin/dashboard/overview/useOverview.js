import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchDashboardOverview, fetchRecentActivity } from "./overview.api";

export function useDashboardOverview() {
    return useQuery({
        queryKey: queryKeys.admin.dashboardOverview,
        queryFn: fetchDashboardOverview,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}

export function useRecentActivity() {
    return useQuery({
        queryKey: [...queryKeys.admin.dashboardOverview, "recentActivity"],
        queryFn: fetchRecentActivity,
        staleTime: 1 * 60 * 1000, // 1 minute cache
    });
}
