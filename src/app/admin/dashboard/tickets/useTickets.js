import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchTickets } from "./tickets.api";

export function useTickets() {
    return useQuery({
        queryKey: queryKeys.admin.tickets,
        queryFn: fetchTickets,
    });
}
