import apiClient from "@/lib/api";

export async function fetchDashboardOverview() {
    const { data } = await apiClient.get("/v2/admin/dashboard/overview");
    const stats = data.data;

    return {
        todayOrders: stats.todayOrders,
        todayRevenue: stats.todayRevenue,
        totalUsers: stats.totalUsers,
        activePartners: stats.activePartners,
        pendingBookings: stats.pendingBookings,
        todayRefunds: stats.todayRefunds,
        openTickets: stats.openTickets,
        pendingPartnerApprovals: stats.pendingPartnerApprovals
    };
}

export async function fetchRecentActivity() {
    const { data } = await apiClient.get("/v2/admin/dashboard/recent-activity");
    return data.data.latestBookings.slice(0, 4).map(booking => ({
        id: booking.bookingNumber,
        customer: booking.customerName || "عميل غير مسجل",
        type: booking.serviceType?.ar || "غير محدد",
        amount: `${booking.amount} ريال`,
        status: booking.state
    }));
}
