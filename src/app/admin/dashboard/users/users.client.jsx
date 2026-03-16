"use client";

import { useState, useMemo } from "react";
import { useUsers } from "./useUsers";
import UsersFilters from "./_components/UsersFilters.client";
import UsersTable from "./_components/UsersTable.server";
import styles from "./users.module.css";

export default function UsersClient() {
    const [filters, setFilters] = useState({
        search: "",
        role: "customer",
        page: 1,
    });

    const { data, isLoading, isError } = useUsers({ 
        page: filters.page, 
        limit: 20, 
        role: filters.role 
    });

    const users = data?.users || [];
    const pagination = data?.pagination || {};

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter((u) => {
            if (filters.search) {
                const query = filters.search.toLowerCase();
                const nameMatch = u.name?.toLowerCase().includes(query);
                const emailMatch = u.email?.toLowerCase().includes(query);
                const phoneMatch = u.phone?.includes(query);
                if (!nameMatch && !emailMatch && !phoneMatch) {
                    return false;
                }
            }
            return true;
        });
    }, [users, filters.search]);

    return (
        <div>
            <UsersFilters filters={filters} setFilters={setFilters} />
            
            {isLoading ? (
                <div className={styles.centerContainer}>جاري تحميل البيانات...</div>
            ) : isError ? (
                <div className={styles.centerContainer} style={{ color: "var(--admin-danger)" }}>حدث خطأ في تحميل المستخدمين</div>
            ) : (
                <>
                    <UsersTable users={filteredUsers} />
                    
                    {pagination.totalPages > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px", direction: "rtl", alignItems: "center" }}>
                            <button 
                                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                                disabled={!pagination.hasPrevPage}
                                style={{
                                    padding: "6px 12px",
                                    border: "1px solid var(--admin-border-strong)",
                                    background: "var(--admin-surface)",
                                    color: pagination.hasPrevPage ? "var(--admin-primary)" : "var(--admin-text-muted, gray)",
                                    borderRadius: "6px",
                                    cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
                                }}
                            >
                                السابق
                            </button>
                            <span style={{ fontSize: "0.9rem", color: "var(--admin-text)" }}>
                                صفحة {pagination.currentPage} من {pagination.totalPages}
                            </span>
                            <button 
                                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                                disabled={!pagination.hasNextPage}
                                style={{
                                    padding: "6px 12px",
                                    border: "1px solid var(--admin-border-strong)",
                                    background: "var(--admin-surface)",
                                    color: pagination.hasNextPage ? "var(--admin-primary)" : "var(--admin-text-muted, gray)",
                                    borderRadius: "6px",
                                    cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
                                }}
                            >
                                التالي
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
