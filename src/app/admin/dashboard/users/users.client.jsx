"use client";

import { useState, useMemo } from "react";
import { useUsers } from "./useUsers";
import UsersFilters from "./_components/UsersFilters.client";
import UsersTable from "./_components/UsersTable.server";
import styles from "./users.module.css";

export default function UsersClient() {
    const { data: users, isLoading, isError } = useUsers();
    const [filters, setFilters] = useState({
        search: "",
        city: "",
        membership: "",
        status: "",
    });

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter((u) => {
            // Basic mock filter
            if (
                filters.search &&
                !u.name.includes(filters.search) &&
                !u.contact.includes(filters.search)
            ) {
                return false;
            }
            return true;
        });
    }, [users, filters]);

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل البيانات...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ في تحميل المستخدمين</div>;
    }

    return (
        <div>
            <UsersFilters filters={filters} setFilters={setFilters} />
            <UsersTable users={filteredUsers} />
        </div>
    );
}
