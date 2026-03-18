import apiClient from "@/lib/api";

export async function fetchOrders(params) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.state) queryParams.append("state", params.state);
    if (params.search) queryParams.append("search", params.search);
    if (params.fromDate) queryParams.append("fromDate", params.fromDate);
    if (params.toDate) queryParams.append("toDate", params.toDate);

    const { data } = await apiClient.get(`/v2/admin/bookings?${queryParams.toString()}`);

    const bookings = data?.data?.bookings || [];
    
    const mappedItems = bookings.map(booking => ({
        id: booking._id,
        number: booking.bookingNumber,
        customerName: booking.customerId?.name || "بدون اسم",
        customerEmail: booking.customerId?.email || "",
        partnerName: booking.partnerId?.businessName || "بدون شريك",
        partnerContact: `${booking.partnerId?.contactPerson?.firstName || ""} ${booking.partnerId?.contactPerson?.lastName || ""}`.trim(),
        service: booking.serviceItemId?.name?.ar || "غير محدد",
        state: booking.state,
        stateLabel: booking.stateLabel,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        createdAt: new Date(booking.createdAt).toISOString().split('T')[0]
    }));

    const paginationData = data?.data?.pagination || {};

    return {
        items: mappedItems,
        pagination: {
             page: paginationData.page || params.page || 1, 
             limit: paginationData.limit || params.limit || 10,
             total: paginationData.total || mappedItems.length,
             totalPages: paginationData.totalPages || Math.ceil((paginationData.total || mappedItems.length) / (paginationData.limit || params.limit || 10)) || 1
        }
    };
}

export async function fetchBookingDetails(id) {
    if (!id) return null;
    const { data } = await apiClient.get(`/v2/admin/bookings/${id}`);
    
    const booking = data?.data?.booking;
    if (!booking) return null;
    
    return {
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        state: booking.state,
        stateLabel: booking.stateLabel,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        cancelReason: booking.cancelReason,
        internalNotes: booking.internalNotes,
        bookingModeLabel: booking.bookingModeLabel,
        partner: {
            businessName: booking.partnerId?.businessName || 'بدون اسم',
            contactName: `${booking.partnerId?.contactPerson?.firstName || ''} ${booking.partnerId?.contactPerson?.lastName || ''}`.trim() || 'غير متوفر',
        },
        service: {
            nameAr: booking.serviceItemId?.name?.ar || 'غير محدد',
            nameEn: booking.serviceItemId?.name?.en || '',
        },
        customer: booking.customerId ? {
            name: booking.customerId.name || 'غير معروف',
            email: booking.customerId.email || '',
        } : null,
        history: booking.history || []
    };
}

export async function cancelBooking({ id, reason }) {
    if (!id) return;
    const { data } = await apiClient.patch(`/v2/admin/bookings/${id}/cancel`, {
        reason: reason || "تم الإلغاء بواسطة المسؤول"
    });
    return data;
}
