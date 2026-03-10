"use client";

import { useState, useMemo } from "react";
import { usePartners } from "./usePartners";
import PartnersFilters from "./_components/PartnersFilters.client";
import PartnersTable from "./_components/PartnersTable.server";
import styles from "./partners.module.css";

export default function PartnersClient() {
    const { data: partners, isLoading, isError } = usePartners();
    const [filters, setFilters] = useState({
        search: "",
        sector: "",
        status: "",
    });

    const filteredPartners = useMemo(() => {
        if (!partners) return [];
        return partners.filter((p) => {
            if (
                filters.search &&
                !p.name.includes(filters.search)
            ) {
                return false;
            }
            // Extremely basic handling mapping for demo
            if (filters.status === "active" && p.status !== "نشط") return false;
            if (filters.status === "pending" && p.status !== "معلق") return false;
            return true;
        });
    }, [partners, filters]);

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل البيانات...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ في تحميل بيانات الشركاء</div>;
    }

    return (
        <div>
            <PartnersFilters filters={filters} setFilters={setFilters} />
            <PartnersTable partners={filteredPartners} />
        </div>
    );
}
