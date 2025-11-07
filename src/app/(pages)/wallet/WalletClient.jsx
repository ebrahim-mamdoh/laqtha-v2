"use client"; // ✅ فقط هذا الملف يحتاج hooks

import useWalletLogic from "./useWalletLogic";
import TransactionsList from "./components/TransactionsList/TransactionsList";
import BalanceCard from "./components/Balance/Balance";
import dynamic from "next/dynamic";

// ✅ Lazy-load to reduce initial JS bundle
const DonutChart = dynamic(() => import("./components/DonutChart/DonutChart"), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});

const BarChart = dynamic(() => import("./components/BarChart/BarChart"), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});




import styles from "./wallet.module.css";

export default function WalletClient() {
  const { data } = useWalletLogic();

  if (!data) {
    return <div className={styles.loader}>جاري التحميل...</div>;
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
                <div className={styles.statCard}>
                  <h6 className={styles.cardTitle}>المدفوعات</h6>
                  <DonutChart
                    data={[
                      { name: "paid", value: data.payments.paid },
                      { name: "rest", value: data.payments.rest },
                    ]}
                    centerLabel={`${data.paymentsPercent}%`}
                  />
                  <div className={styles.amount}>
                    {data.payments.amount} ر.س
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className={styles.statCard}>
                  <h6 className={styles.cardTitle}>الشحن</h6>
                  <DonutChart
                    data={[
                      { name: "top", value: data.topup.top },
                      { name: "rest", value: data.topup.rest },
                    ]}
                    centerLabel={`${data.topupPercent}%`}
                  />
                  <div className={styles.amount}>
                    {data.topup.amount} ر.س
                  </div>
                </div>
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
