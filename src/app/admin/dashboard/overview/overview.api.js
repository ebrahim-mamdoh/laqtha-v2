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
