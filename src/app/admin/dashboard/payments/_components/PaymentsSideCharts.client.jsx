"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "../payments.module.css";

const PAYMENT_METHODS = [
    { name: "مدى", value: 48, color: "var(--admin-info)" },
    { name: "بطاقة ائتمانية", value: 34, color: "var(--admin-primary)" },
    { name: "Apple Pay", value: 27, color: "var(--admin-danger)" },
];

const FAILURE_REASONS = [
    { label: "رصيد غير كاف", percent: 52, color: "var(--admin-danger)" },
    { label: "خطأ في البوابة", percent: 28, color: "var(--admin-warning)" },
    { label: "بطاقة منتهية", percent: 20, color: "var(--admin-primary)" },
];

export default function PaymentsSideCharts() {
    return (
        <div className={styles.chartsPanel}>

            {/* ── Donut Chart Card ── */}
            <div className={styles.chartCard}>
                <div className={styles.chartTitle}>طرق الدفع 💳</div>
                <div className={styles.donutWrapper}>
                    {/* Custom Legend */}
                    <div className={styles.donutLegend}>
                        {PAYMENT_METHODS.map((item, i) => (
                            <div key={i} className={styles.legendItem}>
                                <div className={styles.legendLabel}>
                                    <span className={styles.legendDot} style={{ "--dot-color": item.color }} />
                                    <span>{item.name}</span>
                                </div>
                                <span className={styles.legendValue} style={{ color: item.color }}>
                                    {item.value}%
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.donutChartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PAYMENT_METHODS}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="var(--admin-card)"
                                    strokeWidth={2}
                                >
                                    {PAYMENT_METHODS.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── Failure Analysis Card ── */}
            <div className={styles.chartCard}>
                <div className={styles.chartTitle}>تحليل فشل المعاملات ⚠️</div>

                <div className={styles.failureBars}>
                    {FAILURE_REASONS.map((reason, i) => (
                        <div key={i} className={styles.failureItem}>
                            <div className={styles.failureLabel}>{reason.label}</div>
                            <div className={styles.failureTrack}>
                                <div
                                    className={styles.failureBarVal}
                                    style={{
                                        width: `${reason.percent}%`,
                                        "--bar-color": reason.color
                                    }}
                                />
                            </div>
                            <div className={styles.failurePercent} style={{ "--bar-color": reason.color }}>
                                {reason.percent}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
