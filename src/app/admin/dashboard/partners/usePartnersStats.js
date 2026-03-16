import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchPartnersStats } from "./partners-stats.api";

export function usePartnersStats() {
    return useQuery({
        queryKey: queryKeys.admin.partnersStats,
        queryFn: fetchPartnersStats,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}
