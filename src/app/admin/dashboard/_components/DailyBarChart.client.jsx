"use client";
// DailyBarChart.client.jsx
// SERVER/CLIENT DECISION: Client — recharts requires DOM.

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from "recharts";

const DATA = [
    { day: "أ", orders: 94, revenue: 180 },
    { day: "ب", orders: 210, revenue: 320 },
    { day: "ج", orders: 176, revenue: 260 },
    { day: "د", orders: 258, revenue: 390 },
    { day: "ه", orders: 144, revenue: 220 },
    { day: "و", orders: 290, revenue: 430 },
    { day: "ز", orders: 198, revenue: 310 },
];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border-strong)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: "0.72rem",
                color: "var(--admin-text)",
                direction: "rtl",
                fontFamily: "Cairo, sans-serif",
            }}
        >
            <div style={{ color: "var(--admin-muted)", marginBottom: 4 }}>{label}</div>
            {payload.map((p) => (
                <div key={p.dataKey} style={{ color: p.color, fontWeight: 700 }}>
                    {p.name}: {p.value}
                </div>
            ))}
        </div>
    );
}

export default function DailyBarChart() {
    return (
        <ResponsiveContainer width="100%" height={180}>
            <BarChart
                data={DATA}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                barGap={4}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                />
                <XAxis
                    dataKey="day"
                    tick={{ fill: "#a0a0c0", fontSize: 10, fontFamily: "Cairo" }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: "#a0a0c0", fontSize: 10, fontFamily: "Cairo" }}
                    axisLine={false}
                    tickLine={false}
                    orientation="right"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="طلبات" radius={[4, 4, 0, 0]} maxBarSize={22}>
                    {DATA.map((_, i) => (
                        <Cell
                            key={i}
                            fill={i === 5 ? "var(--admin-primary)" : "var(--admin-secondary)"}
                            fillOpacity={i === 5 ? 1 : 0.65}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
