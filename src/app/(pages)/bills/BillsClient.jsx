// BillsClient.jsx
"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import styles from "./bills.module.css";
import { useBillsLogic } from "./useBillsLogic";

/**
 * Format currency to SAR (Saudi Riyal) with Arabic formatting
 */
function formatCurrency(val) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "SAR",
  })
    .format(val)
    .replace("SAR", "ر.س");
}

/**
 * Icons
 */
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ✅ Memoized stat card component
const StatCard = React.memo(({ title, value }) => (
  <div className={styles.statCard}>
    <div className={styles.statTitle}>{title}</div>
    <div className={styles.statValue}>{formatCurrency(value)}</div>
  </div>
));
StatCard.displayName = 'StatCard';

// ✅ Memoized table row component
const TableRow = React.memo(({ bill, index }) => (
  <tr className={styles.tbodyRow}>
    <td>
      <div className="d-flex align-items-center gap-2">
        <input type="checkbox" className={styles.checkbox} />
        <span>{bill.invoiceNumber || "0334"}</span>
      </div>
    </td>
    <td>
      <span className={styles.storeName}>{bill.name}</span>
    </td>
    <td>{formatCurrency(bill.amount)}</td>
    <td>{bill.status}</td>
    <td>{new Date(bill.date).toLocaleDateString("en-GB")}</td>
    <td>
      <button className={styles.actionBtn}>
        <DotsIcon />
      </button>
    </td>
  </tr>
));
TableRow.displayName = 'TableRow';

// ✅ Memoized mobile bill card component
const BillCard = React.memo(({ bill }) => (
  <div className={styles.billCard}>
    <div className={styles.cardTop}>
      <div className={styles.cardInvoice}>{bill.invoiceNumber}</div>
      <div className={styles.cardAmount}>{formatCurrency(bill.amount)}</div>
    </div>

    <div className={styles.cardBody}>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>الاسم</span>
        <span className={styles.cardValue}>{bill.name}</span>
      </div>

      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>النوع</span>
        <span className={styles.cardValue}>{bill.type}</span>
      </div>

      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>التاريخ</span>
        <span className={styles.cardValue}>
          {new Date(bill.date).toLocaleDateString("en-GB")}
        </span>
      </div>
    </div>
  </div>
));
BillCard.displayName = 'BillCard';

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

  // Helper for filter Option
  const FilterOption = ({ label, isActive, onClick }) => (
    <button
      className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  // Calculate active filter count (price != all + date != all + ...)
  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

  // ✅ Memoize loading/error/empty states
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

                    {/* THE FILTER POPUP */}
                    {isFilterOpen && (
                      <div className={styles.filterPopup}>

                        {/* Price Group */}
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

                        {/* Date Group */}
                        <div className={styles.filterGroup}>
                          <div className={styles.filterOptionGrid}>
                            <FilterOption label="اخر شهر" isActive={filters.date === 'last_month'} onClick={() => setFilter('date', filters.date === 'last_month' ? 'all' : 'last_month')} />
                            <FilterOption label="اخر 90 يوم" isActive={filters.date === 'last_90_days'} onClick={() => setFilter('date', filters.date === 'last_90_days' ? 'all' : 'last_90_days')} />
                            <FilterOption label="اخر سنة" isActive={filters.date === 'last_year'} onClick={() => setFilter('date', filters.date === 'last_year' ? 'all' : 'last_year')} />
                            <FilterOption label="الكل" isActive={filters.date === 'all'} onClick={() => setFilter('date', 'all')} />
                          </div>
                        </div>

                        {/* Status Group */}
                        <div className={styles.filterGroup}>
                          <div className={styles.filterOptionGrid}>
                            <FilterOption label="مكتمل" isActive={filters.status === 'completed'} onClick={() => setFilter('status', filters.status === 'completed' ? 'all' : 'completed')} />
                            <FilterOption label="غير مكتمل" isActive={filters.status === 'not_completed'} onClick={() => setFilter('status', filters.status === 'not_completed' ? 'all' : 'not_completed')} />
                          </div>
                        </div>

                        {/* Type Group */}
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
                              <th>قيمة العملية</th>
                              <th>حالة العملية</th>
                              <th>تاريخ العملية</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {bills.map((b, idx) => (
                              <TableRow key={b.id} bill={b} index={idx} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {bills.map((b) => (
                          <BillCard key={b.id} bill={b} />
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
    </div>
  );
}

// ✅ Export memoized version
export default React.memo(BillsClient);
