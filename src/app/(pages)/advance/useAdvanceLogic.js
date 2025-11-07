// FILE: app/dashboard/advance/useAdvanceLogic.js
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function useAdvanceLogic() {
  const [filter, setFilter] = useState("active");

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/data/users.json");
      if (!res.ok) throw new Error("فشل في تحميل المستخدمين");
      return res.json();
    },
    staleTime: 60000, // ✅ تحسين الأداء: cache لمدة دقيقة
  });

  const connectedActive = users.filter((u) => u.status === "online" && u.isActive);
  const connectedInactive = users.filter((u) => u.status === "online" && !u.isActive);
  const disconnected = users.filter((u) => u.status === "offline");
  const favorites = users.filter((u) => u.isFavorite);

  const getFiltered = () => {
    switch (filter) {
      case "active":
        return connectedActive;
      case "inactive":
        return connectedInactive;
      case "offline":
        return disconnected;
      case "favorite":
        return favorites;
      default:
        return [];
    }
  };

  return {
    filter,
    setFilter,
    isLoading,
    error,
    connectedActive,
    connectedInactive,
    disconnected,
    favorites,
    getFiltered,
  };
}
