"use client"; // ✅ فقط هذا الملف يحتاج hooks

import React, { useMemo } from "react";
import useWalletLogic from "./useWalletLogic";
import TransactionsList from "./components/TransactionsList/TransactionsList";
import BalanceCard from "./components/Balance/balance.module.css";
import dynamic from "next/dynamic";
import { SkeletonCard, SkeletonChart } from "@/components/Skeleton";

// ✅ Lazy-load to reduce initial JS bundle
const DonutChart = dynamic(() => import("./components/DonutChart/DonutChart"), {
  ssr: false,
  loading: () => <SkeletonChart />,
});

const BarChart = dynamic(() => import("./components/BarChart/BarChart"), {
  ssr: false,
  loading: () => <SkeletonChart />,
});

import styles from "./wallet.module.css";

// ✅ Memoized stat card component
const StatCard = React.memo(({ title, data, percent }) => (
  <div className={styles.statCard}>
    <h6 className={styles.cardTitle}>{title}</h6>
    <DonutChart
      data={[
        { name: "used", value: data.paid || data.top },
        { name: "left", value: data.rest },
      ]}
      centerLabel={`${percent}%`}
    />
    <div className={styles.amount}>
      {data.amount} ر.س
    </div>
  </div>
));
StatCard.displayName = 'StatCard';

function WalletClient() {
  const { data, isLoading, error } = useWalletLogic();

  // ✅ Memoize loading state
  const loadingDisplay = useMemo(() => (
    <div className={styles.page} dir="rtl">
      <div className="container pt-4">
        <div className={`row ${styles.topRow}`}>
          <div className="col-md-3"><SkeletonCard /></div>
          <div className="col-md-9"><SkeletonCard /></div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6"><SkeletonCard /></div>
          <div className="col-md-6"><SkeletonCard /></div>
        </div>
      </div>
    </div>
  ), []);

  if (isLoading) {
    return loadingDisplay;
  }

  if (error) {
    return <div className={styles.loader}>خطأ في تحميل البيانات</div>;
  }

  if (!data) {
    return <div className={styles.loader}>لا توجد بيانات</div>;
  }

  return (
    <div className={styles.page} dir="rtl">
      <div className="container pt-4">
        
        <div className={`row ${styles.topRow}`}>
          <div className="col-md-3">
            <DonutChart
              data={[
                { name: "used", value: data.overall.used },
                { name: "left", value: data.overall.left },
              ]}
              centerLabel={`${data.overall.percent}%`}
            />
          </div>

          <div className="col-md-9">
            <BalanceCard data={data.balance} />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6 mb-4">
                <StatCard 
                  title="المدفوعات" 
                  data={data.payments} 
                  percent={data.paymentsPercent} 
                />
              </div>

              <div className="col-md-6 mb-4">
                <StatCard 
                  title="الشحن" 
                  data={data.topup} 
                  percent={data.topupPercent} 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className={styles.chartCard}>
                  <BarChart data={data.chart} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <TransactionsList items={data.transactions} />
          </div>
        </div>

      </div>
    </div>
  );
}

// ✅ Export memoized version
export default React.memo(WalletClient);
