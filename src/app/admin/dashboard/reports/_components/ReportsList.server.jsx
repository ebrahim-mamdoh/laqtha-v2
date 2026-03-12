// ReportsList.server.jsx
import styles from "../reports.module.css";

export default function ReportsList({ reports }) {
    if (!reports || reports.length === 0) {
        return <div className={styles.centerContainer}>لا توجد تقارير جاهزة.</div>;
    }

    return (
        <div className={styles.card} dir="rtl">
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>تقارير جاهزة 📁</div>
            </div>
            <div className={styles.readyReportList}>
                {reports.map((report) => (
                    <div key={report.id} className={styles.reportItem}>

                        {/* RIGHT in RTL: icon + text group */}
                        <div className={styles.reportInfo}>
                            <div
                                className={styles.reportIconWrap}
                                style={{
                                    "--icon-bg": `color-mix(in srgb, ${report.color} 15%, transparent)`,
                                    color: report.color,
                                }}
                            >
                                {report.icon}
                            </div>
                            <div className={styles.reportTextWrap}>
                                <div className={styles.reportTitle}>{report.title}</div>
                                <div className={styles.reportDate}>{report.date}</div>
                            </div>
                        </div>

                        {/* LEFT in RTL: download button */}
                        <button className={styles.btnDownload}>تنزيل 📥</button>

                    </div>
                ))}
            </div>
        </div>
    );
}
