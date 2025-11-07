"use client";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

// Fetch function - can be reused for prefetching
const fetchDashboard = async () => {
  const res = await fetch("/data/dashboard.json");
  if (!res.ok) throw new Error("فشل في تحميل بيانات المحفظة");
  return res.json();
};

export default function useWalletLogic() {
  // ✅ Replace useEffect + fetch with React Query
  const { data = null, isLoading, error } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error };
}

// Export for prefetching
export { fetchDashboard };
