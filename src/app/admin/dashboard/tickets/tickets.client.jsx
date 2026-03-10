"use client";

import { useState, useMemo } from "react";
import { useTickets } from "./useTickets";
import TicketsFilters from "./_components/TicketsFilters.client";
import TicketsTable from "./_components/TicketsTable.server";
import styles from "./tickets.module.css";

export default function TicketsClient() {
    const { data: tickets, isLoading, isError } = useTickets();
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        status: "",
        priority: "",
    });

    const filteredTickets = useMemo(() => {
        if (!tickets) return [];
        return tickets.filter((t) => {
            // Very basic local filtering for mock data demonstration
            if (
                filters.search &&
                !t.id.includes(filters.search) &&
                !t.customer.includes(filters.search) &&
                !t.subject.includes(filters.search)
            ) {
                return false;
            }
            return true;
        });
    }, [tickets, filters]);

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل البيانات...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ في تحميل التذاكر</div>;
    }

    return (
        <div>
            <TicketsFilters filters={filters} setFilters={setFilters} />
            <TicketsTable tickets={filteredTickets} />
        </div>
    );
}
