// Prefetch helpers for React Query
import { queryKeys } from "./queryKeys";

// Import fetch functions from each logic hook
const fetchBillsData = async () => {
  const res = await fetch("/data/bills.json");
  if (!res.ok) throw new Error("خطأ في تحميل البيانات");
  const data = await res.json();
  
  return data.map((item, idx) => ({
    id: item.id ?? idx,
    invoiceNumber: item.invoiceNumber ?? item.id ?? `inv-${idx}`,
    name: item.name ?? item.merchant ?? "—",
    type: item.type ?? "—",
    amount: typeof item.amount === "number" ? item.amount : parseFloat(String(item.amount).replace(/[^0-9.-]+/g, "")) || 0,
    date: item.date ?? item.transactionDate ?? new Date().toISOString(),
    status: item.status ?? "مكتمل",
  }));
};

const fetchDashboardData = async () => {
  const res = await fetch("/data/dashboard.json");
  if (!res.ok) throw new Error("فشل في تحميل بيانات المحفظة");
  return res.json();
};

const fetchUsersData = async () => {
  const res = await fetch("/data/users.json");
  if (!res.ok) throw new Error("فشل في تحميل المستخدمين");
  return res.json();
};

// Prefetch functions
export const prefetchBills = (queryClient) => {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.bills,
    queryFn: fetchBillsData,
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchDashboard = (queryClient) => {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchUsers = (queryClient) => {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.users,
    queryFn: fetchUsersData,
    staleTime: 5 * 60 * 1000,
  });
};

// Route-based prefetch mapping
export const prefetchByRoute = {
  "/bills": prefetchBills,
  "/wallet": prefetchDashboard,
  "/advance": prefetchUsers,
};
