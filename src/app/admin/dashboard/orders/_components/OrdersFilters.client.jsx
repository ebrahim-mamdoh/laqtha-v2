"use client";
// OrdersFilters.client.jsx
// SERVER/CLIENT DECISION: Client Component — controlled inputs need useState.

import { useState } from "react";
import styles from "../orders.module.css";

export default function OrdersFilters({ onFilterChange }) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    function handleExport() {
        // Placeholder — wire to real export endpoint
        alert("تصدير Excel قريبًا...");
    }

    function handleNotify(field, value) {
        const next = { search, status, type, dateFrom, dateTo, [field]: value };
        onFilterChange?.(next);
    }

    return (
        <div className={styles.filtersBar}>
            {/* Search */}
            <input
                id="orders-search"
                type="text"
                className={styles.filterInput}
                placeholder="ابحث برقم الطلب أو اسم العميل..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    handleNotify("search", e.target.value);
                }}
            />

            {/* Date from */}
            <input
                id="orders-date-from"
                type="date"
                className={styles.filterDate}
                value={dateFrom}
                onChange={(e) => {
                    setDateFrom(e.target.value);
                    handleNotify("dateFrom", e.target.value);
                }}
            />

            {/* Date to */}
            <input
                id="orders-date-to"
                type="date"
                className={styles.filterDate}
                value={dateTo}
                onChange={(e) => {
                    setDateTo(e.target.value);
                    handleNotify("dateTo", e.target.value);
                }}
            />

            {/* Status */}
            <select
                id="orders-status"
                className={styles.filterSelect}
                value={status}
                onChange={(e) => {
                    setStatus(e.target.value);
                    handleNotify("status", e.target.value);
                }}
            >
                <option value="">كل الحالات</option>
                <option value="new">جديد</option>
                <option value="processing">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
            </select>

            {/* Type */}
            <select
                id="orders-type"
                className={styles.filterSelect}
                value={type}
                onChange={(e) => {
                    setType(e.target.value);
                    handleNotify("type", e.target.value);
                }}
            >
                <option value="">كل الأنواع</option>
                <option value="hotel">فندق</option>
                <option value="restaurant">مطعم</option>
                <option value="transport">نقل</option>
                <option value="tourism">سياحة</option>
                <option value="service">خدمة</option>
            </select>

            <div className={styles.filterSpacer} />

            {/* Export */}
            <button id="orders-export-btn" className={styles.btnExport} onClick={handleExport}>
                📊 تصدير Excel
            </button>

            {/* New order */}
            <button id="orders-new-btn" className={styles.btnNew}>
                + طلب جديد
            </button>
        </div>
    );
}
