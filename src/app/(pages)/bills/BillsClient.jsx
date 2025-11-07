// BillsClient.jsx
"use client";

import React, { useEffect, useState } from "react";
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

export default function BillsClient() {
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

  return (
    <div className={styles.pageWrap}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className={`col-12 col-md-11 ${styles.inner}`}>

            {/* ✅ Cards Summary */}
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>هذا الشهر</div>
                  <div className={styles.statValue}>{formatCurrency(stats.thisMonth)}</div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>اخر 3 اشهر</div>
                  <div className={styles.statValue}>{formatCurrency(stats.last3Months)}</div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>الإجمالي</div>
                  <div className={styles.statValue}>{formatCurrency(stats.total)}</div>
                </div>
              </div>
            </div>

            {/* ✅ Filters */}
            <div className={`row align-items-center mt-4 ${styles.filterRow}`}>
              <div className="col-12 col-md-4">
                <input
                  className={`form-control ${styles.searchInput}`}
                  placeholder="البحث..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-5 d-flex gap-2">
                <button
                  className={`${styles.pill} ${last90Days ? styles.pillActive : ""}`}
                  onClick={() => setLast90Days((s) => !s)}
                >
                  اخر 90 يوم
                </button>

                <button
                  className={`${styles.pill} ${lessThan1000 ? styles.pillActive : ""}`}
                  onClick={() => setLessThan1000((s) => !s)}
                >
                  اقل من 1000 ر.س
                </button>

                <select
                  className={`form-select ${styles.formSelect} ms-auto`}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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
                {loading && <div className={styles.center}>جاري تحميل البيانات...</div>}
                {error && <div className={styles.center}>خطأ: {error}</div>}
                {!loading && bills.length === 0 && <div className={styles.center}>لا توجد فواتير</div>}

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
                              <tr key={b.id} className={styles.tbodyRow}>
                                <td>{idx + 1}</td>
                                <td>{b.invoiceNumber}</td>
                                <td>{b.name}</td>
                                <td>{b.type}</td>
                                <td>{formatCurrency(b.amount)}</td>
                                <td>{b.status}</td>
                                <td>{new Date(b.date).toLocaleDateString("ar-EG")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {bills.map((b) => (
                          <div className={styles.billCard} key={b.id}>
                            <div className={styles.cardTop}>
                              <div className={styles.cardInvoice}>{b.invoiceNumber}</div>
                              <div className={styles.cardAmount}>{formatCurrency(b.amount)}</div>
                            </div>

                            <div className={styles.cardBody}>
                              <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>الاسم</span>
                                <span className={styles.cardValue}>{b.name}</span>
                              </div>

                              <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>النوع</span>
                                <span className={styles.cardValue}>{b.type}</span>
                              </div>

                              <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>التاريخ</span>
                                <span className={styles.cardValue}>
                                  {new Date(b.date).toLocaleDateString("ar-EG")}
                                </span>
                              </div>
                            </div>
                          </div>
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
