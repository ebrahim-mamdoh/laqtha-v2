import { apiClient } from "@/lib/api";

const MOCK_USERS = [
    {
        id: "U-00123",
        name: "عبدالله الحارثي",
        contact: "0501234567",
        city: "جدة",
        joinDate: "مارس 2023",
        orders: "24",
        spending: "12,850 ر.س",
        tag: "عميل متميز",
        tagColor: "var(--admin-success)",
        lastActive: "اليوم",
        membership: "VIP",
        membershipColor: "var(--admin-primary)",
        status: "نشط",
        statusColor: "var(--admin-success)",
    },
    {
        id: "U-00124",
        name: "سارة الشمري",
        contact: "0559876543",
        city: "الرياض",
        joinDate: "يناير 2024",
        orders: "42",
        spending: "8,200 ر.س",
        tag: "عميل جديد",
        tagColor: "var(--admin-info)",
        lastActive: "أمس",
        membership: "عادي",
        membershipColor: "var(--admin-muted)",
        status: "نشط",
        statusColor: "var(--admin-success)",
    },
    {
        id: "U-00125",
        name: "خالد العنزي",
        contact: "0561122334",
        city: "مكة",
        joinDate: "يونيو 2024",
        orders: "7",
        spending: "980 ر.س",
        tag: "محظور إزعاج",
        tagColor: "var(--admin-danger)",
        lastActive: "5 أيام",
        membership: "عادي",
        membershipColor: "var(--admin-muted)",
        status: "محظور",
        statusColor: "var(--admin-danger)",
    },
];

export async function fetchUsers() {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_USERS;
}
