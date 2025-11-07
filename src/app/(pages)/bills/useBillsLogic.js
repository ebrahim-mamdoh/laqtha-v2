// useBillsLogic.js
"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

// helpers
function parseAmount(val) {
  return typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, "")) || 0;
}

function withinLastDays(dateStr, days) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return false;
    return Date.now() - d.getTime() <= days * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

// Fetch function - can be reused for prefetching
const fetchBills = async () => {
  const res = await fetch("/data/bills.json");
  if (!res.ok) throw new Error("خطأ في تحميل البيانات");
  const data = await res.json();
  
  return data.map((item, idx) => ({
    id: item.id ?? idx,
    invoiceNumber: item.invoiceNumber ?? item.id ?? `inv-${idx}`,
    name: item.name ?? item.merchant ?? "—",
    type: item.type ?? "—",
    amount: parseAmount(item.amount ?? item.price ?? 0),
    date: item.date ?? item.transactionDate ?? new Date().toISOString(),
    status: item.status ?? "مكتمل",
  }));
};

export function useBillsLogic() {
  // ✅ Replace useEffect + fetch with React Query
  const { data: bills = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: queryKeys.bills,
    queryFn: fetchBills,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const error = queryError?.message || null;

  // UI state
  const [search, setSearch] = useState("");
  const [lessThan1000, setLessThan1000] = useState(false);
  const [last90Days, setLast90Days] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  /** Filtering + Sorting */
  const filteredBills = useMemo(() => {
    let list = [...bills];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.invoiceNumber.toLowerCase().includes(q) ||
          b.name.toLowerCase().includes(q) ||
          b.type.toLowerCase().includes(q)
      );
    }

    if (lessThan1000) list = list.filter((b) => b.amount < 1000);
    if (last90Days) list = list.filter((b) => withinLastDays(b.date, 90));

    list.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "most_expensive":
          return b.amount - a.amount;
        case "least_expensive":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return list;
  }, [bills, search, lessThan1000, last90Days, sortBy]);

  /** Stats */
  const stats = useMemo(() => {
    let total = 0;
    let thisMonth = 0;
    let last3Months = 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    bills.forEach((b) => {
      total += b.amount;
      const d = new Date(b.date);
      if (d >= startOfMonth) thisMonth += b.amount;
      if (d >= threeMonthsAgo) last3Months += b.amount;
    });

    return { total, thisMonth, last3Months };
  }, [bills]);

  return {
    bills: filteredBills,
    stats,
    loading,
    error,

    // UI State
    search,
    setSearch,
    lessThan1000,
    setLessThan1000,
    last90Days,
    setLast90Days,
    sortBy,
    setSortBy,
  };
}

// Export for prefetching
export { fetchBills };
