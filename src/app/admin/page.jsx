// src/app/admin/page.jsx
// Root /admin redirect → /admin/dashboard
// SERVER/CLIENT DECISION: Server Component — redirect is a server action.

import { redirect } from "next/navigation";

export default function AdminRootPage() {
    redirect("/admin/dashboard");
}
