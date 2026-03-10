import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchRatings } from "./ratings.api";

export function useRatings() {
    return useQuery({
        queryKey: queryKeys.admin.ratings,
        queryFn: fetchRatings,
    });
}
