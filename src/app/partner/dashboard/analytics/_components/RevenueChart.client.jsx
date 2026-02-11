'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function RevenueChart({ data }) {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: '#1a1420',
                    border: '1px solid #333',
                    padding: '10px',
                    borderRadius: '8px',
                    color: '#fff',
                    direction: 'rtl',
                    textAlign: 'right'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, margin: '5px 0 0' }}>
                            {entry.name}: {entry.value} ر.س
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 350, direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 10,
                        left: 0,
                        bottom: 5,
                    }}
                    barGap={6}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 12 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar
                        dataKey="received"
                        name="الواردات"
                        fill="#0051FF"
                        radius={[4, 4, 0, 0]}
                        barSize={12}
                    />
                    <Bar
                        dataKey="profit"
                        name="الارباح"
                        fill="#FF00C8"
                        radius={[4, 4, 0, 0]}
                        barSize={12}
                    />
                </BarChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', direction: 'rtl' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '10px', height: '10px', background: '#0051FF', borderRadius: '2px' }}></div>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>الواردات</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '10px', height: '10px', background: '#FF00C8', borderRadius: '2px' }}></div>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>الارباح</span>
                </div>
            </div>
        </div>
    );
}
