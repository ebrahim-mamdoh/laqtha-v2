import { apiClient } from "@/lib/api";

const MOCK_PAYMENTS = [
    {
        id: "TXN-002841",
        orderId: "LQ-00216",
        customer: "عبدالله",
        amount: "977.80 ر.س",
        amountColor: "var(--admin-success)",
        method: "مدى 💳",
        status: "ناجحة",
        statusColor: "var(--admin-success)",
        time: "09:42",
    },
    {
        id: "TXN-002840",
        orderId: "LQ-00204",
        customer: "سارة",
        amount: "275 ر.س",
        amountColor: "var(--admin-success)",
        method: "بطاقة 💳",
        status: "ناجحة",
        statusColor: "var(--admin-success)",
    },
    {
        id: "TXN-002839",
        orderId: "LQ-00218",
        customer: "فيصل",
        amount: "-450 ر.س",
        amountColor: "var(--admin-danger)",
        method: "استرداد 💰",
        status: "معالجة",
        statusColor: "var(--admin-warning)",
        time: "08:55",
    },
    {
        id: "TXN-002838",
        orderId: "LQ-00211",
        customer: "نورة",
        amount: "1,350 ر.س",
        amountColor: "var(--admin-success)",
        method: "Apple Pay 🍎",
        status: "ناجحة",
        statusColor: "var(--admin-success)",
        time: "08:20",
    },
    {
        id: "TXN-002837",
        orderId: "LQ-00207",
        customer: "فهد",
        amount: "713 ر.س",
        amountColor: "var(--admin-danger)",
        method: "ماستركارد 💳",
        status: "فشلت",
        statusColor: "var(--admin-danger)",
        time: "07:45",
    },
];

export async function fetchPayments() {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_PAYMENTS;
}
