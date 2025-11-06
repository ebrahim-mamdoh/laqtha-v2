'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './advance.module.css';
import Image from 'next/image';

export default function Advance() {
  const [filter, setFilter] = useState('active'); // فلتر الموبايل

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/data/users.json');
      if (!res.ok) throw new Error('فشل في تحميل المستخدمين');
      return res.json();
    },
  });

  if (isLoading) return <div className={styles.loading}>جاري التحميل...</div>;
  if (error) return <div className={styles.error}>حدث خطأ أثناء تحميل البيانات</div>;

  // ✅ تصنيف المستخدمين حسب خصائص الـ JSON
  const connectedActive = users.filter(u => u.status === 'online' && u.isActive);
  const connectedInactive = users.filter(u => u.status === 'online' && !u.isActive);
  const disconnected = users.filter(u => u.status === 'offline');
  const favorites = users.filter(u => u.isFavorite);

  // دالة لعرض المستخدمين في وضع الموبايل حسب الفلتر
  const getFiltered = () => {
    switch (filter) {
      case 'active':
        return connectedActive;
      case 'inactive':
        return connectedInactive;
      case 'offline':
        return disconnected;
      case 'favorite':
        return favorites;
      default:
        return [];
    }
  };

  return (
    <div className={styles.page}>
      <div className="container py-4">
        <h2 className={styles.title}>الفزعة</h2>

        {/* ===== Dropdown للموبايل ===== */}
        <div className={`${styles.dropdownWrapper} mb-4`}>
          <select
            className="form-select"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="active">متصل ونشط</option>
            <option value="inactive">متصل وغير نشط</option>
            <option value="offline">غير متصل</option>
            <option value="favorite">المفضلة</option>
          </select>
        </div>

        {/* ===== تصميم الديسكتوب ===== */}
        <div className={styles.grid}>
          {/* متصل ونشط */}
          <div className={styles.column}>
            <h5>متصل ونشط</h5>
            {connectedActive.map(user => (
              <div key={user.id} className={styles.card}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <div className={styles.info}>
                  <h6>{user.name}</h6>
                  <p>{user.status === 'online' ? ' متصل' : ' غير متصل'}</p>
                </div>
                <div className={styles.actions}>
  <button className={`${styles.btn} ${styles.callBtn}`}>
                     <Image
                    src="/icons/phone.svg"
                    alt="phone"
                    width={20}
                    height={20}
                    className={styles.icon}
                  /></button>                </div>
              </div>
            ))}
          </div>

          {/* متصل وغير نشط */}
          <div className={styles.column}>
            <h5>متصل وغير نشط</h5>
            {connectedInactive.map(user => (
              <div key={user.id} className={styles.card}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <div className={styles.info}>
                  <h6>{user.name}</h6>
                  <p>{user.status === 'online' ? ' متصل' : ' غير متصل'}</p>
                </div>
                <div className={styles.actions}>
                  <button className={`${styles.btn} ${styles.callBtn}`}>
                     <Image
                    src="/icons/phone.svg"
                    alt="phone"
                    width={20}
                    height={20}
                    className={styles.icon}
                  /></button>
                </div>
              </div>
            ))}
          </div>

          {/* غير متصل */}
          <div className={styles.column}>
            <h5>غير متصل</h5>
            {disconnected.map(user => (
              <div key={user.id} className={styles.card}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <div className={styles.info}>
                  <h6>{user.name}</h6>
                  <p> غير متصل</p>
                </div>
                <div className={styles.actions}>
  <button className={`${styles.btn} ${styles.callBtn}`}>
                     <Image
                    src="/icons/phone.svg"
                    alt="phone"
                    width={20}
                    height={20}
                    className={styles.icon}
                  /></button>                </div>
              </div>
            ))}
          </div>

          {/* المفضلة */}
          <div className={styles.column}>
            <h5>المفضلة</h5>
            {favorites.map(user => (
              <div key={user.id} className={styles.card}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <div className={styles.info}>
                  <h6>{user.name}</h6>
                  <p>{user.status === 'online' ? ' متصل' : 'غير متصل'}</p>
                </div>
                <div className={styles.actions}>
  <button className={`${styles.btn} ${styles.callBtn}`}>
                     <Image
                    src="/icons/phone.svg"
                    alt="phone"
                    width={20}
                    height={20}
                    className={styles.icon}
                  /></button>                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== عرض الموبايل ===== */}
        <div className={styles.mobileList}>
          {getFiltered().map(user => (
            <div key={user.id} className={styles.card}>
              <img src={user.avatar} alt={user.name} className={styles.avatar} />
              <div className={styles.info}>
                <h6>{user.name}</h6>
                <p>
                  {user.status === 'online'
                    ? user.isActive
                      ? '🟢 متصل ونشط'
                      : '🟡 متصل وغير نشط'
                    : '🔴 غير متصل'}
                </p>
              </div>
              <div className={styles.actions}>
                <button className={`${styles.btn} ${styles.callBtn}`}>📞</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
