"use client";
// orders.client.jsx
// SERVER/CLIENT DECISION: Client Component — manages filter state that is
// shared between the filter bar and the table's visible rows.

import { useState, useMemo } from "react";
import OrdersFilters from "./_components/OrdersFilters.client";
import OrdersTable from "./_components/OrdersTable.server";
import styles from "./orders.module.css";

// Mock dataset — in production this would come from the parent page's async fetch.
const ALL_ORDERS = [
    {
        id: "LQ-00141",
        customer: "عبدالله الدخيل",
        type: "فندق",
        partner: "فندق الريتز",
        amount: "850 ريال",
        status: "completed",
        date: "2026-03-08",
    },
    {
        id: "LQ-00140",
        customer: "سارة المطيري",
        type: "مطعم",
        partner: "Shake Shack",
        amount: "340 ريال",
        status: "completed",
        date: "2026-03-08",
    },
    {
        id: "LQ-00139",
        customer: "خالد العنزي",
        type: "سياحة",
        partner: "رحلة الرياض",
        amount: "1,200 ريال",
        status: "processing",
        date: "2026-03-07",
    },
    {
        id: "LQ-00138",
        customer: "نورة المروعي",
        type: "نقل",
        partner: "كريم",
        amount: "1,500 ريال",
        status: "completed",
        date: "2026-03-07",
    },
    {
        id: "LQ-00137",
        customer: "فهد العتيبي",
        type: "خدمة",
        partner: "Apple Play",
        amount: "250 ريال",
        status: "new",
        date: "2026-03-07",
    },
    {
        id: "LQ-00136",
        customer: "منى القحطاني",
        type: "فندق",
        partner: "فندق القصر",
        amount: "2,148 ريال",
        status: "cancelled",
        date: "2026-03-06",
    },
];

export default function OrdersClient() {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        type: "",
        dateFrom: "",
        dateTo: "",
    });

    const filtered = useMemo(() => {
        return ALL_ORDERS.filter((o) => {
            if (
                filters.search &&
                !o.id.includes(filters.search) &&
                !o.customer.includes(filters.search)
            )
                return false;
            if (filters.status && o.status !== filters.status) return false;
            if (filters.type && o.type !== filters.type) return false;
            if (filters.dateFrom && o.date < filters.dateFrom) return false;
            if (filters.dateTo && o.date > filters.dateTo) return false;
            return true;
        });
    }, [filters]);

    return (
        <div className={styles.page}>
            <OrdersFilters onFilterChange={setFilters} />
            <OrdersTable orders={filtered} />
        </div>
    );
}
