import apiClient from "@/lib/api";

export async function fetchPartners({ page = 1, limit = 20, state = "pending_approval" } = {}) {
    const { data } = await apiClient.get("/admin/partners", {
        params: { state, page, limit }
    });

    const mappedPartners = data.data.partners.map(partner => ({
        id: partner._id || partner.id,
        partnerName: partner.businessName,
        serviceType: partner.serviceType?.label?.ar || "",
        city: partner.address?.city || "",
        contactName: partner.contactFullName || "",
        status: partner.stateLabel || "",
        createdDate: partner.createdAt || "",
        state: partner.state,
        email: partner.email || "",
        phone: partner.phone || "",
        fullAddress: partner.address?.fullAddress || partner.address?.street || "",
        description: partner.description || "",
        businessName: partner.businessName,
        contactFullName: partner.contactFullName
    }));

    return {
        partners: mappedPartners,
        pagination: data.data.pagination
    };
}

export async function approvePartner(partnerId) {
    const { data } = await apiClient.post(`/admin/partners/${partnerId}/approve`);
    return data;
}

export async function rejectPartner({ partnerId, reason }) {
    const { data } = await apiClient.post(`/admin/partners/${partnerId}/reject`, { reason });
    return data;
}
