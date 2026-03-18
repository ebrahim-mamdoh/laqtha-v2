import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchOrders, fetchBookingDetails, cancelBooking } from "./orders.api";

export function useOrders(filters) {
    return useQuery({
        queryKey: [...queryKeys.admin.orders, filters],
        queryFn: () => fetchOrders(filters),
        keepPreviousData: true,
    });
}

export function useBookingDetails(id) {
    return useQuery({
        queryKey: [...queryKeys.admin.orders, "detail", id],
        queryFn: () => fetchBookingDetails(id),
        enabled: Boolean(id),
    });
}

export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders });
        },
    });
}
