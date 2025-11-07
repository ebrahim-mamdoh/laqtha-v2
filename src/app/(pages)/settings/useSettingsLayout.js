// ✅ LOGIC ONLY
"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

export const SIDEBAR_ITEMS = [
  { id: "general", label: "الإعدادات العامة", href: "/settings/general" },
  { id: "profile", label: "الملف الشخصي", href: "/settings/profile" },
  { id: "notifications", label: "الإشعارات", href: "/settings/notifications" },
  { id: "delete", label: "حذف الحساب", href: "/settings/delete-account" },
];

export default function useSettingsLayout() {
  const router = useRouter();
  const pathname = usePathname() || "/settings";
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ تصحيح إعادة التوجيه
  useEffect(() => {
    if (pathname === "/settings") {
      router.replace("/settings/general");
    }
  }, [pathname, router]);

  // ✅ إغلاق القائمة الجانبية عند تغيير المسار
  useEffect(() => setMobileOpen(false), [pathname]);

  // ✅ اسم التاب الحالي لعرضه في الهيدر بالموبايل
  const currentTabLabel = useMemo(() => {
    const match = SIDEBAR_ITEMS.find((i) => pathname.startsWith(i.href));
    return match?.label || "الإعدادات";
  }, [pathname]);

  return {
    pathname,
    mobileOpen,
    currentTabLabel,
    openMenu: () => setMobileOpen(true),
    closeMenu: () => setMobileOpen(false),
    navigateToRoot: () => router.push("/settings"),
    sidebarItems: SIDEBAR_ITEMS,
  };
}
