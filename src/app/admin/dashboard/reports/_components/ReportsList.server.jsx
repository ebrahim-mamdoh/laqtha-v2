// ReportsList.server.jsx
import styles from "../reports.module.css";

export default function ReportsList({ reports }) {
    if (!reports || reports.length === 0) {
        return <div className={styles.centerContainer}>لا توجد تقارير جاهزة.</div>;
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>تقارير جاهزة 📁</div>
            </div>
            <div className={styles.readyReportList}>
                {reports.map((report) => (
                    <div key={report.id} className={styles.reportItem}>
                        {/* Left side (remember RTL: Left is mapped visually far from text end) */}
                        <button className={styles.btnDownload}>تنزيل 📥</button>

                        {/* Right side (Main content) */}
                        <div className={styles.reportInfo}>
                            <div className={styles.reportTextWrap}>
                                <div className={styles.reportTitle}>{report.title}</div>
                                <div className={styles.reportDate}>{report.date}</div>
                            </div>
                            <div className={styles.reportIconWrap} style={{ "--icon-bg": `color-mix(in srgb, ${report.color} 15%, transparent)`, color: report.color }}>
                                {report.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
