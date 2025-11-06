"use client";

import { usePathname, useRouter } from "next/navigation";
import PublicLayout from "../../layouts/PublicLayout";
import ProtectedLayout from "../../layouts/ProtectedLayout";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, user, loading } = useAuth(); // لاحظنا loading هنا

  // الصفحات العامة المسموح بيها بدون تسجيل دخول
  const publicRoutes = ["/login", "/register"];

  useEffect(() => {
    // ما نعملش أي redirect قبل ما الـ auth يخلص loading
    if (loading) return;

    // اذا مفيش توكن وداخل صفحة محمية -> رديه للـ login
    if (!token && !publicRoutes.some(p => pathname.startsWith(p))) {
      router.replace("/login");
      return;
    }

    // اذا عنده توكن لكن profileComplete = false -> يتوجه للا onboarding
    // (لو عايب تمنع ده خالص خلي هذا الشرط يتشال)
    if (token && user && user.profileComplete === false && !pathname.startsWith("/onboarding")) {
      router.replace("/onboarding");
      return;
    }

    // ملاحظة مهمة: لم أضع أي redirect يخرج المستخدم اللي عنده توكن من
    // صفحات عامة مثل /login أو /register — لأنه حسب كلامك "طالما عنده توكن فهو حر".
    // لو لاحقًا تفضّل منع العودة للـ login/register للمسجلين نضيف redirect هنا.
  }, [token, user, loading, pathname, router]);

  const isPublic = publicRoutes.some(p => pathname.startsWith(p)) || pathname === "/";

  return isPublic ? <PublicLayout>{children}</PublicLayout> : <ProtectedLayout>{children}</ProtectedLayout>;
}
