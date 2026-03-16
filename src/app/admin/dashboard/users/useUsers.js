import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchUsers } from "./users.api";

export function useUsers({ page = 1, limit = 20, role = "customer" } = {}) {
    return useQuery({
        queryKey: [...queryKeys.admin.users, { page, limit, role }],
        queryFn: () => fetchUsers({ page, limit, role }),
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}
