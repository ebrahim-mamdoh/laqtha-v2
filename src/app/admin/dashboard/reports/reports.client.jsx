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
        <div className={styles.outerGrid} dir="rtl">
            {/* ── Top row: Bar chart (right in RTL) then Line chart (left in RTL) ── */}
            <ReportsCharts data={reports} />

            {/* ── Bottom row: Generator (right in RTL) then List (left in RTL) ── */}
            <ReportsGenerator />
            <ReportsList reports={reports.readyReports} />
        </div>
    );
}
