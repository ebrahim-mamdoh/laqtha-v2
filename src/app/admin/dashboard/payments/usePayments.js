import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchPayments } from "./payments.api";

export function usePayments() {
    return useQuery({
        queryKey: queryKeys.admin.payments,
        queryFn: fetchPayments,
    });
}
