// PartnersTable.server.jsx
// SERVER/CLIENT DECISION: Server Component — static markup rendering the list.

import styles from "../partners.module.css";

function getPillStyle(colorVar) {
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": "transparent",
        "--pill-bg": `color-mix(in srgb, ${colorVar} 15%, transparent)`,
    };
}

export default function PartnersTable({ partners }) {
    if (!partners || partners.length === 0) {
        return (
            <div className={styles.tableCard}>
                <div className={styles.centerContainer}>لا يوجد شركاء يطابقون بحثك.</div>
            </div>
        );
    }

    return (
        <div className={styles.tableCard}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>إدارة الشركاء 🤝</div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table} dir="rtl">
                    <thead>
                        <tr>
                            <th>الشريك</th>
                            <th>القطاع</th>
                            <th>المدينة</th>
                            <th>العمولة</th>
                            <th>الإيرادات</th>
                            <th>المستحقات</th>
                            <th>نسبة القبول</th>
                            <th>التقييم</th>
                            <th>انتهاء العقد</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <div className={styles.partnerNameWrap}>
                                        <div
                                            className={styles.partnerIcon}
                                            style={{
                                                "--icon-color": p.iconColor,
                                                "--icon-bg": `color-mix(in srgb, ${p.iconColor} 15%, transparent)`,
                                            }}
                                        >
                                            {p.icon}
                                        </div>
                                        {p.name}
                                    </div>
                                </td>
                                <td>{p.sector}</td>
                                <td>{p.city}</td>
                                <td>
                                    <span className={styles.commission}>{p.commission}</span>
                                </td>
                                <td>
                                    <span className={styles.revenue}>{p.revenue}</span>
                                </td>
                                <td>
                                    <span className={styles.dues}>{p.dues}</span>
                                </td>
                                <td>
                                    <div className={styles.progressWrap}>
                                        <span className={styles.progressText}>{p.acceptanceRate}%</span>
                                        <div className={styles.progressTrack}>
                                            <div
                                                className={styles.progressBar}
                                                style={{
                                                    width: `${p.acceptanceRate}%`,
                                                    "--progress-color": p.acceptanceRate > 80 ? "var(--admin-success)" : "var(--admin-warning)",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.ratingWrap}>
                                        <span className={styles.ratingNum}>{p.rating}</span>
                                        <span className={styles.ratingStars}>★★★★★</span>
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className={styles.contractEnd}
                                        style={{ color: p.contractColor }}
                                    >
                                        {p.contractEnd}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(p.statusColor)}
                                    >
                                        {p.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} title="عرض">👁️</button>
                                        <button className={styles.actionBtn} title="تعديل">✏️</button>
                                        <button className={styles.actionBtn} title="مستندات">📄</button>
                                        <button className={styles.actionBtn} title="مالية">💰</button>
                                        <button className={styles.actionBtn} title="إيقاف">🛑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
