"use client";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from "recharts";
import styles from "../reports.module.css";

const CHART_STYLES = {
    stroke: "var(--admin-border)",
    textColor: "var(--admin-muted)",
    fontSize: 10,
};

// Returns TWO sibling cards — they are direct children of the parent .outerGrid (2-col)
// In RTL: first card renders on the RIGHT, second on the LEFT
export default function ReportsCharts({ data }) {
    const { growth, revenue } = data;

    return (
        <>
            {/* ── Card 1 (RIGHT in RTL): Revenue Bar Chart ── */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>تقرير الإيرادات الشهري 📊</div>
                    <div className={styles.badgeTopLeft}>PDF / Excel</div>
                </div>
                <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenue} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLES.stroke} vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke={CHART_STYLES.textColor}
                                tick={{ fontSize: CHART_STYLES.fontSize }}
                                tickLine={false}
                            />
                            <YAxis
                                stroke={CHART_STYLES.textColor}
                                tick={{ fontSize: CHART_STYLES.fontSize }}
                                width={40}
                                tickFormatter={(val) => `${val / 1000}k`}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)", borderRadius: "8px" }}
                                itemStyle={{ color: "var(--admin-primary)", fontWeight: "bold" }}
                                labelStyle={{ color: "var(--admin-text)" }}
                                formatter={(val) => [`${val.toLocaleString()} ر.س`, "الإيراد"]}
                            />
                            <Bar dataKey="revenue" fill="var(--admin-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Card 2 (LEFT in RTL): Users Growth Line Chart ── */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>نمو المستخدمين 📈</div>
                    <div className={styles.badgeTopLeft}>Year</div>
                </div>
                <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growth} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLES.stroke} />
                            <XAxis
                                dataKey="name"
                                stroke={CHART_STYLES.textColor}
                                tick={{ fontSize: CHART_STYLES.fontSize }}
                                tickLine={false}
                            />
                            <YAxis
                                stroke={CHART_STYLES.textColor}
                                tick={{ fontSize: CHART_STYLES.fontSize }}
                                width={40}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)", borderRadius: "8px" }}
                                itemStyle={{ color: "var(--admin-primary)", fontWeight: "bold" }}
                                labelStyle={{ color: "var(--admin-text)" }}
                                formatter={(val) => [val.toLocaleString(), "مستخدم"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="var(--admin-primary)"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "var(--admin-primary)", strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}
