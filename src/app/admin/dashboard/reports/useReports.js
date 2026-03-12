import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchReportsData } from "./reports.api";

export function useReports() {
    return useQuery({
        queryKey: queryKeys.admin.reports,
        queryFn: fetchReportsData,
    });
}
