// FILE: app/dashboard/advance/AdvanceClient.jsx
"use client";

import Image from "next/image";
import styles from "./advance.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAdvanceLogic } from "./useAdvanceLogic";

export default function AdvanceClient() {
  const {
    filter,
    setFilter,
    isLoading,
    error,
    connectedActive,
    connectedInactive,
    disconnected,
    favorites,
    getFiltered,
  } = useAdvanceLogic();

  if (isLoading) return <div className={styles.loading}>جاري التحميل...</div>;
  if (error) return <div className={styles.error}>حدث خطأ أثناء تحميل البيانات</div>;

  const renderUsers = (users) =>
    users.map((user) => (
      <div key={user.id} className={styles.card}>
        <img src={user.avatar} alt={user.name} className={styles.avatar} />

        <div className={styles.info}>
          <h6>{user.name}</h6>
          <p>{user.status === "online" ? (user.isActive ? "متصل ونشط" : "متصل وغير نشط") : "غير متصل"}</p>
        </div>

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.callBtn}`}>
            <Image src="/icons/phone.svg" alt="call" width={20} height={20} className={styles.icon} />
          </button>
        </div>
      </div>
    ));

  return (
    <div className={styles.page}>
      <div className="container py-4">
        <h2 className={styles.title}>الفزعة</h2>

        {/* Mobile Dropdown */}
        <div className={`${styles.dropdownWrapper} mb-4`}>
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="active">متصل ونشط</option>
            <option value="inactive">متصل وغير نشط</option>
            <option value="offline">غير متصل</option>
            <option value="favorite">المفضلة</option>
          </select>
        </div>

        {/* Desktop Columns */}
        <div className={styles.grid}>
          <div className={styles.column}>
            <h5>متصل ونشط</h5>
            {renderUsers(connectedActive)}
          </div>

          <div className={styles.column}>
            <h5>متصل وغير نشط</h5>
            {renderUsers(connectedInactive)}
          </div>

          <div className={styles.column}>
            <h5>غير متصل</h5>
            {renderUsers(disconnected)}
          </div>

          <div className={styles.column}>
            <h5>المفضلة</h5>
            {renderUsers(favorites)}
          </div>
        </div>

        {/* Mobile List */}
        <div className={styles.mobileList}>{renderUsers(getFiltered())}</div>
      </div>
    </div>
  );
}
