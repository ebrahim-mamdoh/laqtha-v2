import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchPartners } from "./partners.api";

export function usePartners() {
    return useQuery({
        queryKey: queryKeys.admin.partners,
        queryFn: fetchPartners,
    });
}
