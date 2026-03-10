import { apiClient } from "@/lib/api";

const MOCK_RATINGS = [
    {
        id: "R-001",
        customer: "عبدالله الحارثي",
        service: "إقامة 🏨",
        orderId: "LQ-00216",
        partner: "بريميوم جدة",
        ratingScore: 5.0,
        comment: "خدمة ممتازة جداً",
        date: "اليوم",
        status: "منشور",
        statusColor: "var(--admin-success)",
    },
    {
        id: "R-002",
        customer: "سارة المطيري",
        service: "مطعم 🍔",
        orderId: "LQ-00204",
        partner: "الشرقية",
        ratingScore: 4.0,
        comment: "الطعام رائع لكن التأخير!",
        date: "أمس",
        status: "منشور",
        statusColor: "var(--admin-success)",
    },
    {
        id: "R-003",
        customer: "فيصل القحطاني",
        service: "نقل 🚕",
        orderId: "LQ-00174",
        partner: "الراجحي",
        ratingScore: 1.0,
        comment: "السائق لم يصل على الموعد",
        date: "أمس",
        status: "مخفي",
        statusColor: "var(--admin-danger)",
    },
];

export async function fetchRatings() {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_RATINGS;
}
