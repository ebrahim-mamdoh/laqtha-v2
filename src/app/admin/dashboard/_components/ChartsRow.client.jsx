"use client";
// ChartsRow.client.jsx
// SERVER/CLIENT DECISION: Client Component — recharts requires the DOM
// and cannot run on the server. All chart rendering must be client-side.

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import styles from "./ChartsRow.module.css";

// ── Revenue line chart data ──────────────────────────────────────────────────
const REVENUE_DATA = [
    { day: "الأحد", revenue: 9200 },
    { day: "الاثنين", revenue: 11800 },
    { day: "الثلاثاء", revenue: 10400 },
    { day: "الأربعاء", revenue: 14200 },
    { day: "الخميس", revenue: 13100 },
    { day: "الجمعة", revenue: 15800 },
    { day: "السبت", revenue: 12600 },
];

// ── Donut / Pie chart data ───────────────────────────────────────────────────
const DONUT_DATA = [
    { name: "الفنادق", value: 38, color: "var(--admin-secondary)" },
    { name: "المطاعم", value: 27, color: "var(--admin-primary)" },
    { name: "النقل", value: 18, color: "var(--admin-accent)" },
    { name: "السياحة", value: 12, color: "var(--admin-success)" },
    { name: "الخدمات", value: 5, color: "var(--admin-warning)" },
];

// Custom tooltip for recharts (theme-aware via CSS variables)
function RevenueTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border-strong)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: "0.75rem",
                color: "var(--admin-text)",
                direction: "rtl",
                fontFamily: "Cairo, sans-serif",
            }}
        >
            <div style={{ color: "var(--admin-text-secondary)", marginBottom: 4 }}>
                {label}
            </div>
            <div style={{ fontWeight: 700, color: "var(--admin-primary)" }}>
                {payload[0].value.toLocaleString("ar-EG")} ريال
            </div>
        </div>
    );
}

export default function ChartsRow() {
    return (
        <div className={styles.chartsRow}>
            {/* ── Revenue Line Chart ─────────────────────────────── */}
            <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                    <div className={styles.chartTitle}>
                        <span className={styles.chartTitleIcon}>📈</span>
                        الإيرادات — آخر 7 أيام
                    </div>
                    <span className={styles.chartBadge}>ريال سعودي</span>
                </div>
                <div className={styles.chartBody}>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                            data={REVENUE_DATA}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.05)"
                            />
                            <XAxis
                                dataKey="day"
                                tick={{ fill: "#a0a0c0", fontSize: 10, fontFamily: "Cairo" }}
                                axisLine={false}
                                tickLine={false}
                                reversed // RTL: newest on right
                            />
                            <YAxis
                                tick={{ fill: "#a0a0c0", fontSize: 10, fontFamily: "Cairo" }}
                                axisLine={false}
                                tickLine={false}
                                orientation="right"
                                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<RevenueTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--admin-primary)"
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: "var(--admin-primary)", strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: "var(--admin-primary)" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Service Distribution Donut ─────────────────────── */}
            <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                    <div className={styles.chartTitle}>
                        <span className={styles.chartTitleIcon}>🍩</span>
                        توزيع الطلبات
                    </div>
                    <span className={styles.chartBadge}>حسب الخدمة</span>
                </div>
                <div className={styles.chartBody}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                            direction: "rtl",
                        }}
                    >
                        {/* Donut */}
                        <ResponsiveContainer width={160} height={160}>
                            <PieChart>
                                <Pie
                                    data={DONUT_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={48}
                                    outerRadius={72}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    strokeWidth={0}
                                >
                                    {DONUT_DATA.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <div className={styles.donutLegend} style={{ flex: 1 }}>
                            {DONUT_DATA.map((item) => (
                                <div className={styles.legendRow} key={item.name}>
                                    <div className={styles.legendLeft}>
                                        <div
                                            className={styles.legendDot}
                                            style={{ background: item.color }}
                                        />
                                        {item.name}
                                    </div>
                                    <span className={styles.legendPct}>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
