import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchEmployees } from "./employees.api";

export function useEmployees() {
    return useQuery({
        queryKey: queryKeys.admin.employees,
        queryFn: fetchEmployees,
    });
}
