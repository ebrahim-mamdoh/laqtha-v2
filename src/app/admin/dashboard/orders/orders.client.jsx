"use client";
// orders.client.jsx
// SERVER/CLIENT DECISION: Client Component — manages filter state that is
// shared between the filter bar and the table's visible rows.

import { useState, useMemo } from "react";
import OrdersFilters from "./_components/OrdersFilters.client";
import OrdersTable from "./_components/OrdersTable.server";
import OrderDetailsModal from "./_components/OrderDetailsModal.client";
import CancelOrderModal from "./_components/CancelOrderModal.client";
import styles from "./orders.module.css";
import notify from "@/lib/notify";

import { useOrders } from "./useOrders";

export default function OrdersClient() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        type: "",
        dateFrom: "",
        dateTo: "",
    });

    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
    // Add new state variables for Cancel Modal
    const [selectedCancelId, setSelectedCancelId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleViewOrder = (id) => {
        setSelectedOrderId(id);
        setShowDetailsModal(true);
    };

    const handleCancelOrder = (id) => {
        setSelectedCancelId(id);
        setShowCancelModal(true);
    };

    const { data, isLoading, isError } = useOrders({
        page,
        limit: 10,
        search: filters.search,
        state: filters.status,
        fromDate: filters.dateFrom,
        toDate: filters.dateTo,
    });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    const orders = data?.items || [];
    const meta = data?.pagination || { page: 1, total: 0 };

    return (
        <div className={styles.page}>
            <OrdersFilters onFilterChange={handleFilterChange} />
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>جاري التحميل...</div>
            ) : isError ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--admin-danger)" }}>خطأ في التحميل بيانات الطلبات</div>
            ) : (
                <OrdersTable 
                    orders={orders} 
                    meta={meta} 
                    onPageChange={setPage} 
                    onViewClick={handleViewOrder}
                    onCancelClick={handleCancelOrder}
                />
            )}

            <OrderDetailsModal 
                show={showDetailsModal} 
                onHide={() => {
                    setShowDetailsModal(false);
                    setTimeout(() => setSelectedOrderId(null), 300); // clear after animation
                }} 
                bookingId={selectedOrderId} 
            />

            <CancelOrderModal
                show={showCancelModal}
                orderId={selectedCancelId}
                onHide={() => {
                    setShowCancelModal(false);
                    setTimeout(() => setSelectedCancelId(null), 300); // clear after animation
                }}
                onSuccess={() => setShowCancelModal(false)}
            />
        </div>
    );
}
