import React from 'react';
import OrdersDashboard from './_components/OrdersDashboard.client';

export const metadata = {
    title: 'الطلبات - لوحة تحكم الشريك',
    description: 'إدارة ومتابعة جميع الطلبات',
};

async function getOrdersData() {
    // Mock data matching the image
    return {
        summary: {
            totalOrders: 1578,
            completedOrders: 1477,
            pendingOrders: 101 // "الطلبات غير المكتملة"
        },
        orders: Array(7).fill({
            id: 'mock',
            orderNumber: '3590',
            processName: 'غرفة عادية',
            processType: 'حجز',
            amount: '973',
            status: 'pending', // قيد الانتظار based on the purple badge
            statusLabel: 'قيد الانتظار',
            startDate: '10/10/2025',
            endDate: '15/10/2025'
        }).map((item, index) => {
            // Need to vary one item to be "completed/red" as per image (second row)
            if (index === 1) {
                return {
                    ...item,
                    id: index,
                    status: 'completed',
                    statusLabel: 'مكتمل'
                };
            }
            // Third row is "حجز طلب" instead of "حجز" ? 
            // Image row 3 type: "حجز طلب"
            if (index === 2) {
                return {
                    ...item,
                    id: index,
                    processType: 'حجز طلب'
                };
            }
            return { ...item, id: index };
        })
    };
}

export default async function OrdersPage() {
    const data = await getOrdersData();
    return (
        <OrdersDashboard initialData={data} />
    );
}
