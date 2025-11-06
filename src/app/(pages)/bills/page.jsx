"use client";

import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Bills.module.css";


function parseAmount(val) {
  return typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, "")) || 0;
}

function formatCurrency(val) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(val).replace("SAR", "ر.س");
}

function withinLastDays(dateStr, days) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return false;
    const then = d.getTime();
    const now = Date.now();
    return now - then <= days * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [search, setSearch] = useState("");
  const [lessThan1000, setLessThan1000] = useState(false);
  const [last90Days, setLast90Days] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | most_expensive | least_expensive
  const [activeQuickFilter, setActiveQuickFilter] = useState(null); // optional for styling

  // fetch data from public
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/data/bills.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load bills data");
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        // Ensure each item has expected fields: id, invoiceNumber, name, type, amount, date, status
        // Convert amount to number
        const normalized = data.map((it, idx) => ({
          id: it.id ?? idx,
          invoiceNumber: it.invoiceNumber ?? it.id ?? `inv-${idx}`,
          name: it.name ?? it.merchant ?? "—",
          type: it.type ?? "—",
          amount: parseAmount(it.amount ?? it.price ?? 0),
          date: it.date ?? it.transactionDate ?? new Date().toISOString(),
          status: it.status ?? "مكتمل",
          raw: it,
        }));
        setBills(normalized);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        if (!mounted) return;
        setError(err.message || "Error");
        setBills([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Derived: filtered + sorted
  const filtered = useMemo(() => {
    let list = bills.slice();

    // live search across invoice number, name (case-insensitive, Arabic support)
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => {
        return (
          String(b.invoiceNumber).toLowerCase().includes(q) ||
          String(b.name).toLowerCase().includes(q) ||
          String(b.type).toLowerCase().includes(q)
        );
      });
    }

    if (lessThan1000) {
      list = list.filter((b) => b.amount < 1000);
    }
    if (last90Days) {
      list = list.filter((b) => withinLastDays(b.date, 90));
    }

    // sort
    list.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "most_expensive") return b.amount - a.amount;
      if (sortBy === "least_expensive") return a.amount - b.amount;
      return 0;
    });

    return list;
  }, [bills, search, lessThan1000, last90Days, sortBy]);

  // Stats (total, last 3 months, this month)
  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1); // last 3 months includes current + 2 prev
    let total = 0;
    let thisMonth = 0;
    let last3Months = 0;
    bills.forEach((b) => {
      total += b.amount;
      const d = new Date(b.date);
      if (d >= startOfMonth) thisMonth += b.amount;
      if (d >= threeMonthsAgo) last3Months += b.amount;
    });
    return { total, thisMonth, last3Months };
  }, [bills]);

  // responsive detection (simple)
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
        <div className="row justify-content-center ">
          <div className={`col-12 col-md-11 ${styles.inner}`}>

            {/* TOP SUMMARY CARDS */}
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

            {/* FILTERS / SEARCH ROW */}
            <div className={`row align-items-center mt-4 ${styles.filterRow}`}>
              <div className="col-12 col-md-4 mb-2 mb-md-0">
                <div className={styles.searchWrap}>
                  <input
                    className={`form-control ${styles.searchInput}`}
                    placeholder="البحث..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="بحث عن فاتورة"
                  />
                </div>
              </div>

              <div className="col-12 col-md-5 d-flex gap-2 align-items-center mb-2 mb-md-0">
                <div className={styles.pills}>
                  <button
                    className={`${styles.pill} ${last90Days ? styles.pillActive : ""}`}
                    onClick={() => {
                      setLast90Days((s) => !s);
                      setActiveQuickFilter("90");
                    }}
                  >
                    اخر 90 يوم
                  </button>

                  <button
                    className={`${styles.pill} ${lessThan1000 ? styles.pillActive : ""}`}
                    onClick={() => {
                      setLessThan1000((s) => !s);
                      setActiveQuickFilter("1000");
                    }}
                  >
                    اقل من 1000 ر.س
                  </button>
                </div>

                <div className={`ms-auto ${styles.sortWrap}`}>
                  <select
                    className={`form-select ${styles.formSelect}`}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="ترتيب الفواتير"
                  >
                    <option value="newest">حسب الأحدث</option>
                    <option value="oldest">حسب الأقدم</option>
                    <option value="most_expensive">الأكثر تكلفة</option>
                    <option value="least_expensive">الأقل تكلفة</option>
                  </select>
                </div>


              </div>

              <div className="col-12 col-md-3 text-md-end">
                <div className={styles.controlsRight}>
                </div>
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className={`row mt-4 ${styles.contentRow}`}>
              <div className="col-12">
                {loading ? (
                  <div className={styles.center}>جاري تحميل البيانات...</div>
                ) : error ? (
                  <div className={styles.center}>خطأ في تحميل البيانات: {error}</div>
                ) : filtered.length === 0 ? (
                  <div className={styles.center}>لا توجد فواتير</div>
                ) : (
                  <>
                    {/* DESKTOP: TABLE */}
                    {!isMobile ? (
                      <div className={styles.tableWrap}>
                        <table className={`table table-borderless table-hover align-middle  ${styles.transparentTable}`}>
                          <thead>
                            <tr className={styles.theadRow}>
                              <th scope="col">#</th>
                              <th scope="col">رقم الفاتورة</th>
                              <th scope="col">اسم العملية</th>
                              <th scope="col">نوع العملية</th>
                              <th scope="col">قيمة العملية</th>
                              <th scope="col">حالة العملية</th>
                              <th scope="col">تاريخ العملية</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((b, idx) => (
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
                      /* MOBILE: CARDS */
                      <div className="d-flex flex-column gap-3">
                        {filtered.map((b) => (
                          <div className={styles.billCard} key={b.id}>
                            <div className={styles.cardTop}>
                              <div className={styles.cardInvoice}>{b.invoiceNumber}</div>
                              <div className={styles.cardAmount}>{formatCurrency(b.amount)}</div>
                            </div>

                            <div className={styles.cardBody}>
                              <div className={styles.cardRow}>
                                <div className={styles.cardLabel}>الاسم</div>
                                <div className={styles.cardValue}>{b.name}</div>
                              </div>

                              <div className={styles.cardRow}>
                                <div className={styles.cardLabel}>النوع</div>
                                <div className={styles.cardValue}>{b.type}</div>
                              </div>

                              <div className={styles.cardRow}>
                                <div className={styles.cardLabel}>التاريخ</div>
                                <div className={styles.cardValue}>{new Date(b.date).toLocaleDateString("ar-EG")}</div>
                              </div>

                              <div className={styles.cardRow}>
                                <div className={styles.cardLabel}>الحالة</div>
                                <div className={styles.cardValue}>{b.status}</div>
                              </div>

                              <div className="d-flex justify-content-end mt-2">
                                <button className={styles.cardAction}>تفاصيل</button>
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
