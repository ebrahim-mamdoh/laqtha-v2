// FILE: app/dashboard/advance/AdvanceClient.jsx
"use client";

import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import styles from "./advance.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAdvanceLogic } from "./useAdvanceLogic";
import { SkeletonCard } from "@/components/Skeleton";

// ✅ Memoized user card component
const UserCard = React.memo(({ user }) => (
  <div className={styles.card}>
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
UserCard.displayName = 'UserCard';

function AdvanceClient() {
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

  // ✅ Memoize renderUsers function to prevent re-creation
  const renderUsers = useCallback((users) => 
    users.map((user) => <UserCard key={user.id} user={user} />)
  , []);

  // ✅ Memoize filter change handler
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, [setFilter]);

  // ✅ Memoized loading state
  const loadingDisplay = useMemo(() => (
    <div className={styles.page}>
      <div className="container py-4">
        <div className="row g-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  ), []);

  if (isLoading) return loadingDisplay;
  if (error) return <div className={styles.error}>حدث خطأ أثناء تحميل البيانات</div>;

  return (
    <div className={styles.page}>
      <div className="container py-4">
        <h2 className={styles.title}>الفزعة</h2>

        {/* Mobile Dropdown */}
        <div className={`${styles.dropdownWrapper} mb-4`}>
          <select className="form-select" value={filter} onChange={handleFilterChange}>
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

// ✅ Export memoized version
export default React.memo(AdvanceClient);
