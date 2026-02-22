"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import styles from "./bills.module.css";
import { useBillsLogic } from "./useBillsLogic";

// Components
import StatCard from "./_components/StatCard.server"; // RSC UI
import TableRow from "./_components/TableRow.client"; // Interactive
import BillCard from "./_components/BillCard.client"; // Mobile Interactive
import { FilterIcon, ChevronDownIcon } from "./_components/Icons";

function BillsClient() {
    const {
        bills,
        stats,
        loading,
        error,
        search,
        setSearch,
        filters,
        setFilter,
        sortBy,
        setSortBy,
    } = useBillsLogic();

    const [isMobile, setIsMobile] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Modal states
    const [selectedBill, setSelectedBill] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const sortRef = useRef(null);
    const filterRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sortRef, filterRef]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, [setSearch]);

    const handleSortSelect = (value) => {
        setSortBy(value);
        setIsSortOpen(false);
    };

    const getSortLabel = () => {
        switch (sortBy) {
            case 'newest': return 'حسب الاحدث';
            case 'oldest': return 'حسب الاقدم';
            case 'most_expensive': return 'حسب الاكثر تكلفة';
            case 'least_expensive': return 'حسب الاقل تكلفة';
            default: return 'حسب الاحدث';
        }
    };

    const handleQRClick = useCallback((bill) => {
        setSelectedBill(bill);
        setShowQRModal(true);
    }, []);

    const handleDeleteClick = useCallback((bill) => {
        setSelectedBill(bill);
        setShowDeleteModal(true);
    }, []);

    const confirmDelete = () => {
        console.log("Deleting bill:", selectedBill?.id);
        setShowDeleteModal(false);
        setSelectedBill(null);
    };

    // Helper for filter Option
    const FilterOption = ({ label, isActive, onClick }) => (
        <button
            className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );

    const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

    const contentDisplay = useMemo(() => {
        if (loading) return <div className={styles.center}>جاري تحميل البيانات...</div>;
        if (error) return <div className={styles.center}>خطأ: {error}</div>;
        if (bills.length === 0) return <div className={styles.center}>لا توجد فواتير</div>;
        return null;
    }, [loading, error, bills.length]);

    return (
        <div className={styles.pageWrap}>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className={`col-12 col-md-11 ${styles.inner}`}>

                        {/* ✅ Cards Summary */}
                        <div className="row g-3">
                            <div className="col-12 col-md-4">
                                <StatCard title="هذا الشهر" value={stats.thisMonth} />
                            </div>
                            <div className="col-12 col-md-4">
                                <StatCard title="اخر 3 اشهر" value={stats.last3Months} />
                            </div>
                            <div className="col-12 col-md-4">
                                <StatCard title="الاجمالي" value={stats.total} />
                            </div>
                        </div>

                        {/* ✅ Filters Row */}
                        <div className={`row align-items-center ${styles.filterRow}`}>

                            {/* Right Side (Filters) */}
                            <div className="col-12 col-md-8">
                                <div className={styles.filterActions}>

                                    {/* Sort Dropdown - Dark Style */}
                                    <div className={styles.sortDropdown} ref={sortRef}>
                                        <button
                                            className={`${styles.filterBtn} ${styles.sortBtnDark}`}
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                        >
                                            <ChevronDownIcon />
                                            <span>{getSortLabel()}</span>
                                        </button>

                                        {isSortOpen && (
                                            <div className={styles.dropdownMenu}>
                                                <button className={`${styles.dropdownItem} ${sortBy === 'newest' ? styles.dropdownItemActive : ''}`} onClick={() => handleSortSelect('newest')}>حسب الاحدث</button>
                                                <button className={`${styles.dropdownItem} ${sortBy === 'oldest' ? styles.dropdownItemActive : ''}`} onClick={() => handleSortSelect('oldest')}>حسب الاقدم</button>
                                                <button className={`${styles.dropdownItem} ${sortBy === 'most_expensive' ? styles.dropdownItemActive : ''}`} onClick={() => handleSortSelect('most_expensive')}>حسب الاكثر تكلفة</button>
                                                <button className={`${styles.dropdownItem} ${sortBy === 'least_expensive' ? styles.dropdownItemActive : ''}`} onClick={() => handleSortSelect('least_expensive')}>حسب الاقل تكلفة</button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Filter Button (Pink) - Opens Popup */}
                                    <div className="position-relative" ref={filterRef}>
                                        <button
                                            className={`${styles.filterBtn} ${styles.filterBtnActive}`}
                                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        >
                                            <FilterIcon />
                                            <span>الفلاتر {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                                        </button>

                                        {isFilterOpen && (
                                            <div className={styles.filterPopup}>
                                                <div className={styles.filterGroup}>
                                                    <div className={styles.filterOptionGrid}>
                                                        <FilterOption
                                                            label="اقل من 1000 ر.س"
                                                            isActive={filters.price === 'less_1000'}
                                                            onClick={() => setFilter('price', filters.price === 'less_1000' ? 'all' : 'less_1000')}
                                                        />
                                                        <FilterOption
                                                            label="اكثر من 1000 ر.س"
                                                            isActive={filters.price === 'more_1000'}
                                                            onClick={() => setFilter('price', filters.price === 'more_1000' ? 'all' : 'more_1000')}
                                                        />
                                                    </div>
                                                </div>

                                                <div className={styles.filterGroup}>
                                                    <div className={styles.filterOptionGrid}>
                                                        <FilterOption label="اخر شهر" isActive={filters.date === 'last_month'} onClick={() => setFilter('date', filters.date === 'last_month' ? 'all' : 'last_month')} />
                                                        <FilterOption label="اخر 90 يوم" isActive={filters.date === 'last_90_days'} onClick={() => setFilter('date', filters.date === 'last_90_days' ? 'all' : 'last_90_days')} />
                                                        <FilterOption label="اخر سنة" isActive={filters.date === 'last_year'} onClick={() => setFilter('date', filters.date === 'last_year' ? 'all' : 'last_year')} />
                                                        <FilterOption label="الكل" isActive={filters.date === 'all'} onClick={() => setFilter('date', 'all')} />
                                                    </div>
                                                </div>

                                                <div className={styles.filterGroup}>
                                                    <div className={styles.filterOptionGrid}>
                                                        <FilterOption label="مكتمل" isActive={filters.status === 'completed'} onClick={() => setFilter('status', filters.status === 'completed' ? 'all' : 'completed')} />
                                                        <FilterOption label="غير مكتمل" isActive={filters.status === 'not_completed'} onClick={() => setFilter('status', filters.status === 'not_completed' ? 'all' : 'not_completed')} />
                                                    </div>
                                                </div>

                                                <div className={styles.filterGroup}>
                                                    <div className={styles.filterOptionGrid}>
                                                        <FilterOption label="حجز" isActive={filters.type === 'reservation'} onClick={() => setFilter('type', filters.type === 'reservation' ? 'all' : 'reservation')} />
                                                        <FilterOption label="شراء" isActive={filters.type === 'purchase'} onClick={() => setFilter('type', filters.type === 'purchase' ? 'all' : 'purchase')} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Left Side (Search) */}
                            <div className="col-12 col-md-4">
                                <div className="position-relative">
                                    <input
                                        className={styles.searchInput}
                                        placeholder="البحث..."
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* ✅ content */}
                        <div className="row">
                            <div className="col-12">
                                {contentDisplay}

                                {!loading && bills.length > 0 && (
                                    <>
                                        {!isMobile ? (
                                            <div className={styles.tableContainer}>
                                                <table className={styles.transparentTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>رقم الفاتورة</th>
                                                            <th>اسم العملية</th>
                                                            <th>نوع العملية</th>
                                                            <th>قيمة العملية</th>
                                                            <th>حالة العملية</th>
                                                            <th>تاريخ بدأ العملية</th>
                                                            <th>تاريخ انتهاء العملية</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bills.map((b) => (
                                                            <TableRow
                                                                key={b.id}
                                                                bill={b}
                                                                onQR={handleQRClick}
                                                                onDelete={handleDeleteClick}
                                                            />
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-column gap-3">
                                                {bills.map((b) => (
                                                    <BillCard
                                                        key={b.id}
                                                        bill={b}
                                                        onQR={handleQRClick}
                                                        onDelete={handleDeleteClick}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* QR Modal */}
            {showQRModal && (
                <div className={styles.modalOverlay} onClick={() => setShowQRModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>رمز QR للعملية</h3>
                        <div className={styles.qrContainer}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedBill?.invoiceNumber || selectedBill?.id}`}
                                alt="QR Code"
                            />
                        </div>
                        <p className="text-white-50 small mb-4">رقم الفاتورة: {selectedBill?.invoiceNumber}</p>
                        <button className={styles.cancelBtn} onClick={() => setShowQRModal(false)}>إغلاق</button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>تأكيد الحذف</h3>
                        <p className="text-white mb-4">هل أنت متأكد من حذف هذه العملية ({selectedBill?.name})؟</p>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmBtn} onClick={confirmDelete}>حذفه</button>
                            <button className={styles.cancelBtn} onClick={() => setShowDeleteModal(false)}>إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(BillsClient);
