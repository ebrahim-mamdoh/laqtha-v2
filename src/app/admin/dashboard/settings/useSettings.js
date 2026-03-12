import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchSettings, saveSystemSettings, saveWalletSettings } from "./settings.api";

export function useSettings() {
    return useQuery({
        queryKey: queryKeys.admin.settings,
        queryFn: fetchSettings,
    });
}

export function useSaveSystemSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveSystemSettings,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings }),
    });
}

export function useSaveWalletSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveWalletSettings,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings }),
    });
}
