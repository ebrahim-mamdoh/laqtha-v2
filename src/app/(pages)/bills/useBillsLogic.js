// useBillsLogic.js
"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

// helpers
function parseAmount(val) {
  return typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, "")) || 0;
}

// Fetch function
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
  const { data: bills = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: queryKeys.bills,
    queryFn: fetchBills,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const error = queryError?.message || null;

  // UI state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Comprehensive Filter State
  const [filters, setFilters] = useState({
    price: "all",      // all, less_1000, more_1000
    date: "all",       // all, last_month, last_90_days, last_year
    status: "all",     // all, completed, not_completed
    type: "all",       // all, reservation, purchase
  });

  // Helper to update a single filter
  const setFilter = (key, value) => {
    setFilters(prev => {
      // Toggle logic: if clicking active filter, set to 'all' (optional, but good UX)
      // Actually screenshot has explicit "All" buttons, so maybe just set directly.
      // Let's stick to direct set for now.
      return { ...prev, [key]: value };
    });
  };

  /** Filtering + Sorting */
  const filteredBills = useMemo(() => {
    let list = [...bills];

    // 1. Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.invoiceNumber.toLowerCase().includes(q) ||
          b.name.toLowerCase().includes(q) ||
          b.type.toLowerCase().includes(q)
      );
    }

    // 2. Price Filter
    if (filters.price === "less_1000") {
      list = list.filter((b) => b.amount < 1000);
    } else if (filters.price === "more_1000") {
      list = list.filter((b) => b.amount >= 1000);
    }

    // 3. Date Filter
    if (filters.date !== "all") {
      const now = new Date();
      list = list.filter((b) => {
        const d = new Date(b.date);
        if (isNaN(d.getTime())) return false; // invalid date

        switch (filters.date) {
          case "last_month":
            return (now - d) <= 30 * 24 * 60 * 60 * 1000;
          case "last_90_days":
            return (now - d) <= 90 * 24 * 60 * 60 * 1000;
          case "last_year":
            return (now - d) <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    // 4. Status Filter
    if (filters.status !== "all") {
      list = list.filter((b) => {
        if (filters.status === "completed") return b.status === "مكتمل";
        if (filters.status === "not_completed") return b.status !== "مكتمل";
        return true;
      });
    }

    // 5. Type Filter
    if (filters.type !== "all") {
      list = list.filter((b) => {
        if (filters.type === "purchase") return b.type === "شراء";
        if (filters.type === "reservation") return b.type === "حجز";
        return true;
      });
    }

    // 6. Sorting
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
  }, [bills, search, filters, sortBy]);

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

    // UI
    search,
    setSearch,
    filters,
    setFilter,
    sortBy,
    setSortBy,
  };
}

// Export for prefetching
export { fetchBills };
