import { apiClient } from "@/lib/api";

const MOCK_EMPLOYEES = [
    {
        id: "E-001",
        name: "سارة السمري",
        initials: "س",
        role: "وكيل دعم",
        department: "الدعم الفني",
        responseTime: "45 دقيقة",
        responseColor: "var(--admin-success)",
        openTickets: 6,
        solvedTickets: 284,
        ratingScore: 5.0,
        lastSeen: "الآن",
        status: "متصل",
        statusColor: "var(--admin-success)",
    },
    {
        id: "E-002",
        name: "أحمد خالد",
        initials: "أ",
        role: "مدير حسابات",
        department: "الشركاء",
        responseTime: "2.1 ساعة",
        responseColor: "var(--admin-warning)",
        openTickets: 12,
        solvedTickets: 142,
        ratingScore: 4.0,
        lastSeen: "منذ ساعة",
        status: "متصل",
        statusColor: "var(--admin-success)",
    },
];

export async function fetchEmployees() {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_EMPLOYEES;
}
