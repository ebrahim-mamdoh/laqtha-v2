import apiClient from "@/lib/api";

export async function fetchPartnersStats() {
    const { data } = await apiClient.get("/admin/partners/stats");
    const stats = data.data;

    return {
        overview: {
            total: stats.overview.total,
            pendingApproval: stats.overview.pendingApproval,
            approved: stats.overview.approved,
            suspended: stats.overview.suspended,
            rejected: stats.overview.rejected,
            recentRegistrations: stats.overview.recentRegistrations
        },
        byState: stats.byState.map(state => ({
            state: state.state,
            stateLabel: state.stateLabel,
            count: state.count
        })),
        byServiceType: stats.byServiceType.map(service => ({
            key: service.key,
            label: service.label,
            total: service.total,
            approved: service.approved
        }))
    };
}
