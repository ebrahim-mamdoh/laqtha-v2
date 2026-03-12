import { apiClient } from "@/lib/api";

const MOCK_GROWTH_DATA = [
    { name: "يناير", users: 5000 },
    { name: "فبراير", users: 10000 },
    { name: "مارس", users: 15000 },
    { name: "أبريل", users: 20000 },
    { name: "مايو", users: 28000 },
    { name: "يونيو", users: 40000 },
    { name: "يوليو", users: 45000 },
];

const MOCK_REVENUE_DATA = [
    { name: "يناير", revenue: 400000 },
    { name: "فبراير", revenue: 500000 },
    { name: "مارس", revenue: 450000 },
    { name: "أبريل", revenue: 600000 },
    { name: "مايو", revenue: 580000 },
    { name: "يونيو", revenue: 700000 },
    { name: "يوليو", revenue: 680000 },
    { name: "أغسطس", revenue: 700000 },
    { name: "سبتمبر", revenue: 680000 },
    { name: "أكتوبر", revenue: 800000 },
    { name: "نوفمبر", revenue: 780000 },
    { name: "ديسمبر", revenue: 1200000 },
];

const MOCK_READY_REPORTS = [
    { id: "R-1", title: "تقرير الإيرادات - ديسمبر 2024", date: "تم الإنشاء: يناير 2025", type: "excel", color: "var(--admin-primary)", icon: "📊" },
    { id: "R-2", title: "تقرير المستخدمين - Q4 2024", date: "تم الإنشاء: 31 ديسمبر 2024", type: "pdf", color: "var(--admin-info)", icon: "👥" },
    { id: "R-3", title: "تقرير حصة الشركاء - 2024", date: "تم الإنشاء: 31 ديسمبر 2024", type: "chart", color: "var(--admin-warning)", icon: "🤝" },
    { id: "R-4", title: "تقرير الاستردادات - ديسمبر 2024", date: "حمل الاستردادات - 10 أيام للإنشاء/ يناير", type: "word", color: "var(--admin-primary-soft)", icon: "📄" },
];

export async function fetchReportsData() {
    await new Promise((res) => setTimeout(res, 400));
    return {
        growth: MOCK_GROWTH_DATA,
        revenue: MOCK_REVENUE_DATA,
        readyReports: MOCK_READY_REPORTS,
    };
}
