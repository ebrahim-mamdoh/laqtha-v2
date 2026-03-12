"use client";

import { useReports } from "./useReports";
import ReportsCharts from "./_components/ReportsCharts.client";
import ReportsGenerator from "./_components/ReportsGenerator.client";
import ReportsList from "./_components/ReportsList.server";
import styles from "./reports.module.css";

export default function ReportsClient() {
    const { data: reports, isLoading, isError } = useReports();

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل التقارير والإحصاءات...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ في تحميل البيانات</div>;
    }

    return (
        <div className={styles.grid2x2}>
            <ReportsCharts data={reports} />
            <div className={styles.grid2x2} style={{ gridColumn: "1 / -1", gap: "20px" }}>
                {/* Bottom row matches grid exactly for forms and lists */}
                <ReportsGenerator />
                <ReportsList reports={reports.readyReports} />
            </div>
        </div>
    );
}
