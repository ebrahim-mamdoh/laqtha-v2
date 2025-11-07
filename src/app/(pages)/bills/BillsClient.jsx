// BillsClient.jsx
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./Bills.module.css";
import { useBillsLogic } from "./useBillsLogic";

function formatCurrency(val) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "SAR",
  })
    .format(val)
    .replace("SAR", "ر.س");
}

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
    <td>{index + 1}</td>
    <td>{bill.invoiceNumber}</td>
    <td>{bill.name}</td>
    <td>{bill.type}</td>
    <td>{formatCurrency(bill.amount)}</td>
    <td>{bill.status}</td>
    <td>{new Date(bill.date).toLocaleDateString("ar-EG")}</td>
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
          {new Date(bill.date).toLocaleDateString("ar-EG")}
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
    lessThan1000,
    setLessThan1000,
    last90Days,
    setLast90Days,
    sortBy,
    setSortBy,
  } = useBillsLogic();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Memoize handlers to prevent re-creating on every render
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, [setSearch]);

  const handleLast90DaysToggle = useCallback(() => {
    setLast90Days((s) => !s);
  }, [setLast90Days]);

  const handleLessThan1000Toggle = useCallback(() => {
    setLessThan1000((s) => !s);
  }, [setLessThan1000]);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, [setSortBy]);

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
                <StatCard title="الإجمالي" value={stats.total} />
              </div>
            </div>

            {/* ✅ Filters */}
            <div className={`row align-items-center mt-4 ${styles.filterRow}`}>
              <div className="col-12 col-md-4">
                <input
                  className={`form-control ${styles.searchInput}`}
                  placeholder="البحث..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="col-12 col-md-5 d-flex gap-2">
                <button
                  className={`${styles.pill} ${last90Days ? styles.pillActive : ""}`}
                  onClick={handleLast90DaysToggle}
                >
                  اخر 90 يوم
                </button>

                <button
                  className={`${styles.pill} ${lessThan1000 ? styles.pillActive : ""}`}
                  onClick={handleLessThan1000Toggle}
                >
                  اقل من 1000 ر.س
                </button>

                <select
                  className={`form-select ${styles.formSelect} ms-auto`}
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="newest">حسب الأحدث</option>
                  <option value="oldest">حسب الأقدم</option>
                  <option value="most_expensive">الأكثر تكلفة</option>
                  <option value="least_expensive">الأقل تكلفة</option>
                </select>
              </div>
            </div>

            {/* ✅ content */}
            <div className="row mt-4">
              <div className="col-12">
                {contentDisplay}

                {!loading && bills.length > 0 && (
                  <>
                    {!isMobile ? (
                      <div className={styles.tableWrap}>
                        <table className={`table table-borderless table-hover ${styles.transparentTable}`}>
                          <thead>
                            <tr className={styles.theadRow}>
                              <th>#</th>
                              <th>رقم الفاتورة</th>
                              <th>اسم العملية</th>
                              <th>نوع العملية</th>
                              <th>قيمة العملية</th>
                              <th>حالة</th>
                              <th>تاريخ</th>
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
