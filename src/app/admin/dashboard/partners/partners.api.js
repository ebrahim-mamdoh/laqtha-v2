import { apiClient } from "@/lib/api";

const MOCK_PARTNERS = [
    {
        id: "P-001",
        name: "فندق بريميوم",
        icon: "🏨",
        iconColor: "var(--admin-danger)",
        sector: "الإقامة",
        city: "جدة",
        commission: "12%",
        revenue: "128,400 ر.س",
        dues: "24,992 ر.س",
        acceptanceRate: 96,
        rating: 4.9,
        contractEnd: "مارس 2026",
        contractColor: "var(--admin-success)",
        status: "نشط",
        statusColor: "var(--admin-success)",
    },
    {
        id: "P-002",
        name: "مطاعم الشرقية",
        icon: "🍽️",
        iconColor: "var(--admin-warning)",
        sector: "المطاعم",
        city: "الدمام",
        commission: "10%",
        revenue: "94,200 ر.س",
        dues: "10,840 ر.س",
        acceptanceRate: 89,
        rating: 4.6,
        contractEnd: "يناير 2026",
        contractColor: "var(--admin-success)",
        status: "نشط",
        statusColor: "var(--admin-success)",
    },
    {
        id: "P-003",
        name: "فعاليات جدة",
        icon: "🎡",
        iconColor: "var(--admin-info)",
        sector: "الترفيه",
        city: "جدة",
        commission: "8%",
        revenue: "58,400 ر.س",
        dues: "9,344 ر.س",
        acceptanceRate: 72,
        rating: 4.7,
        contractEnd: "أغسطس 2025 ⚠️",
        contractColor: "var(--admin-danger)",
        status: "معلق",
        statusColor: "var(--admin-info)",
    },
];

export async function fetchPartners() {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_PARTNERS;
}
