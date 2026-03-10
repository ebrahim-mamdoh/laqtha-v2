"use client";

import { useState, useMemo } from "react";
import { useRatings } from "./useRatings";
import RatingsFilters from "./_components/RatingsFilters.client";
import RatingsTable from "./_components/RatingsTable.server";
import styles from "./ratings.module.css";

export default function RatingsClient() {
    const { data: ratings, isLoading, isError } = useRatings();
    const [filters, setFilters] = useState({
        search: "",
        score: "",
        status: "",
        partner: "",
    });

    const filteredRatings = useMemo(() => {
        if (!ratings) return [];
        return ratings.filter((r) => {
            if (
                filters.search &&
                !r.customer.includes(filters.search) &&
                !r.orderId.includes(filters.search) &&
                !r.comment.includes(filters.search)
            ) {
                return false;
            }
            return true;
        });
    }, [ratings, filters]);

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل التقييمات...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ في تحميل تقييمات العملاء</div>;
    }

    return (
        <div>
            <RatingsFilters filters={filters} setFilters={setFilters} />
            <RatingsTable ratings={filteredRatings} />
        </div>
    );
}
