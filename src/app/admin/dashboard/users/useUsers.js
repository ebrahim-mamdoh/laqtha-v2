import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchUsers } from "./users.api";

export function useUsers() {
    return useQuery({
        queryKey: queryKeys.admin.users,
        queryFn: fetchUsers,
    });
}
