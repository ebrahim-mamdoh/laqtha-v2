import React from 'react'
import styles from "./notifications.module.css";

export default function page() {
  return (<>
  <div className={`${styles.notificationsPage}`}>
    <h2 className={`${styles.title}`}>الاشعارات</h2>
    <div className={`${styles.settingsItem}`}>
      <div className={`${styles.label}`}>الإشعارات</div>
      <div className="dropdown">
        <select className={`${styles.dropdown}`}>
          <option value="all"> تفعيل</option>
          <option value="mentions">تعطيل</option>
        </select>
      </div>
    </div>
      <div className={`${styles.lastSettingsItem}`}>
        <div>
      <div className={`${styles.label}`}>الاشعارات الخارجية</div>
        <p className={`${styles.description}`}>فعل هذا الخيار لتلقي اخر التحديثات من النشرة البريدية</p>
        </div>
      <div className="dropdown">
        <select className={`${styles.dropdown}`}>
          <option value="all"> الغاء</option>
          <option value="mentions">تفعيل</option>
        </select>
      </div>
    </div>

  </div>

  </>
  )
}
