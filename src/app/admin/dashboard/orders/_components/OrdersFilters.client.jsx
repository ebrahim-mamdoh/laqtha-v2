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

    const stateMap = {
        "قيد الانتظار": "pending",
        "مكتمل": "completed",
        "ملغي": "cancelled",
        "قيد التنفيذ": "in-progress"
    };

    function handleNotify(field, value) {
        let mappedValue = value;
        if (field === "status") {
            mappedValue = stateMap[value] || value;
        }
        
        const next = { search, status: field === "status" ? mappedValue : (stateMap[status] || status), type, dateFrom, dateTo, [field]: mappedValue };
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
                <option value="قيد الانتظار">قيد الانتظار</option>
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="مكتمل">مكتمل</option>
                <option value="ملغي">ملغي</option>
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
