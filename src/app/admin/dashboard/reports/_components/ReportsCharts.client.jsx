"use client";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from "recharts";
import styles from "../reports.module.css";

const CHART_STYLES = {
    stroke: "var(--admin-border)",
    textColor: "var(--admin-muted)",
    fontFamily: "inherit",
    fontSize: 10
};

export default function ReportsCharts({ data }) {
    const { growth, revenue } = data;

    return (
        <>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>نمو المستخدمين 📈</div>
                    <div className={styles.badgeTopLeft}>Year</div>
                </div>
                <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                        <LineChart data={growth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLES.stroke} />
                            <XAxis dataKey="name" stroke={CHART_STYLES.textColor} tick={{ fontSize: CHART_STYLES.fontSize }} />
                            <YAxis stroke={CHART_STYLES.textColor} tick={{ fontSize: CHART_STYLES.fontSize }} width={45} />
                            <Tooltip
                                contentStyle={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)", borderRadius: "8px" }}
                                itemStyle={{ color: "var(--admin-primary)", fontWeight: "bold" }}
                                labelStyle={{ color: "var(--admin-text)" }}
                            />
                            <Line type="monotone" dataKey="users" stroke="var(--admin-primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--admin-primary)" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>تقرير الإيرادات الشهري 📊</div>
                    <div className={styles.badgeTopLeft}>PDF / Excel</div>
                </div>
                <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                        <BarChart data={revenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLES.stroke} vertical={false} />
                            <XAxis dataKey="name" stroke={CHART_STYLES.textColor} tick={{ fontSize: CHART_STYLES.fontSize }} />
                            <YAxis stroke={CHART_STYLES.textColor} tick={{ fontSize: CHART_STYLES.fontSize }} width={45} tickFormatter={(val) => `${val / 1000}k`} />
                            <Tooltip
                                contentStyle={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)", borderRadius: "8px" }}
                                itemStyle={{ color: "var(--admin-primary)", fontWeight: "bold" }}
                                labelStyle={{ color: "var(--admin-text)" }}
                                formatter={(val) => [`${val} ر.س`, "الإيراد"]}
                            />
                            <Bar dataKey="revenue" fill="var(--admin-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}
