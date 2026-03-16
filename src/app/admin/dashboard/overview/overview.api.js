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

export async function fetchSectorPerformance() {
    const { data } = await apiClient.get("/v2/admin/dashboard/sector-performance");
    
    // Fallback if data.sectors doesn't exist
    const sectors = data.data.sectors || [];
    
    const totalBookings = sectors.reduce((sum, s) => sum + (s.bookingCount || 0), 0);
    
    const colors = [
        "var(--admin-secondary)",
        "var(--admin-primary)",
        "var(--admin-accent)",
        "var(--admin-success)",
        "var(--admin-warning)",
        "var(--admin-info)",
        "var(--admin-danger)"
    ];

    return sectors.map((sector, index) => {
        const count = sector.bookingCount || 0;
        const percentage = totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0;
        return {
            name: sector.label?.ar || "غير محدد",
            value: count,
            percentage,
            color: colors[index % colors.length]
        };
    });
}
