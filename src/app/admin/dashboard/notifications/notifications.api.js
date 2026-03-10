import { apiClient } from "@/lib/api";

// MOCK DATA for Notifications
const MOCK_NOTIFICATIONS = [
    {
        id: "n1",
        title: "تذكرة عاجلة: مشكلة دفع مكرر",
        type: "danger",
        timeAgo: "منذ 5 دقائق",
        isRead: false,
    },
    {
        id: "n2",
        title: "شريك جديد ينتظر موافقتك",
        type: "warning",
        timeAgo: "منذ 35 دقيقة",
        isRead: false,
    },
    {
        id: "n3",
        title: "تم إتمام 1,000 طلب اليوم!",
        type: "success",
        timeAgo: "منذ ساعة",
        isRead: false,
    },
    {
        id: "n4",
        title: "تقرير ديسمبر جاهز للتنزيل",
        type: "info",
        timeAgo: "منذ ساعتين",
        isRead: true,
    },
    {
        id: "n5",
        title: "تنبيه نظام: سيتم إجراء صيانة مجدولة بعد غد",
        type: "warning",
        timeAgo: "منذ 5 ساعات",
        isRead: true,
    },
    {
        id: "n6",
        title: "تم حظر مستخدم لانتهاك الشروط",
        type: "danger",
        timeAgo: "منذ يوم واحد",
        isRead: true,
    },
];

export async function fetchNotifications() {
    // If the real endpoint is not available yet, return mock data.
    // const { data } = await apiClient.get("/admin/notifications");
    // return data;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_NOTIFICATIONS;
}

export async function markAllNotificationsRead() {
    // await apiClient.post("/admin/notifications/mark-all-read");
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
}
