import React from 'react';
import AnalyticsDashboard from './_components/AnalyticsDashboard.client';

export const metadata = {
    title: 'التحليلات - لوحة تحكم الشريك',
    description: 'تحليلات الأداء والمبيعات',
};

async function getAnalyticsData() {
    // Mock data based on the request
    return {
        summary: {
            totalServices: 15,
            totalItems: 150,
            totalPayments: "356,456.00"
        },
        chartData: [
            { name: 'Jan', received: 7000, profit: 5000 },
            { name: 'Feb', received: 10000, profit: 7000 },
            { name: 'Mar', received: 17500, profit: 12500 },
            { name: 'Apr', received: 23000, profit: 15000 },
            { name: 'May', received: 30000, profit: 24000 },
            { name: 'Jun', received: 21000, profit: 16000 },
        ],
        recentOrders: [
            { id: 1, owner: 'محمد ادهم', bookingDate: '03/01/2026', endDate: '03/01/2026', amount: '3500.00', status: 'confirmed', statusLabel: 'مؤكدة' },
            { id: 2, owner: 'محمد ادهم', bookingDate: '03/01/2026', endDate: '03/01/2026', amount: '3500.00', status: 'pending', statusLabel: 'في الانتظار' },
            { id: 3, owner: 'محمد ادهم', bookingDate: '03/01/2026', endDate: '03/01/2026', amount: '3500.00', status: 'completed', statusLabel: 'مكتمل' },
            { id: 4, owner: 'محمد ادهم', bookingDate: '03/01/2026', endDate: '03/01/2026', amount: '3500.00', status: 'pending', statusLabel: 'في الانتظار' },
            { id: 5, owner: 'محمد ادهم', bookingDate: '03/01/2026', endDate: '03/01/2026', amount: '3500.00', status: 'confirmed', statusLabel: 'مؤكدة' },
        ]
    };
}

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    return (
        <AnalyticsDashboard initialData={data} />
    );
}
