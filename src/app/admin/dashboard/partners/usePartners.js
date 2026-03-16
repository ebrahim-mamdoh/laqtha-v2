import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchPartners, approvePartner, rejectPartner } from "./partners.api";
import notify from "@/lib/notify";

export function usePartners(params = {}) {
    return useQuery({
        queryKey: [...queryKeys.admin.partners, params],
        queryFn: () => fetchPartners(params),
    });
}

export function useApprovePartner() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approvePartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.partners });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.partnersStats });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboardOverview });
            notify.success("تم قبول الشريك بنجاح");
        },
        onError: (error) => {
            notify.error(error.response?.data?.message || "حدث خطأ أثناء قبول الشريك");
        }
    });
}

export function useRejectPartner() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectPartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.partners });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.partnersStats });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboardOverview });
            notify.success("تم رفض الشريك بنجاح");
        },
        onError: (error) => {
            notify.error(error.response?.data?.message || "حدث خطأ أثناء رفض الشريك");
        }
    });
}
