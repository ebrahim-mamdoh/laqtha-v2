import React from 'react'
import styles from "./general.module.css";
export default function page() {
  return (<>
  <div className={`${styles.notificationsPage}`}>
    <h2 className={`${styles.title}`}>الاعدادات العامه</h2>
    <div className={`${styles.settingsItem}`}>
      <div className={`${styles.label}`}>المظهر</div>
      <div className="dropdown">
        <select className={`${styles.dropdown}`}>
          <option value="all"> الداكن</option>
          <option value="mentions">الفاتح</option>
        </select>
      </div>
    </div>
    <div className={`${styles.settingsItem}`}>
      <div className={`${styles.label}`}>اللغة</div>
      <div className="dropdown">
        <select className={`${styles.dropdown}`}>
          <option value="all"> العربيه</option>
          <option value="mentions">الانجليزيه</option>
        </select>
      </div>
    </div>
      <div className={`${styles.settingsItem}`}>
        <div>
      <div className={`${styles.label}`}> لغة التعليق الصوتي</div>
        <p className={`${styles.description}`}>حدد اللغة التي تود التحدث بها مع البرنامج بشكل صوتي </p>
        </div>
      <div className="dropdown">
        <select className={`${styles.dropdown}`}>
          <option value="all"> تلقائي</option>
          <option value="mentions">العربيه</option>
          <option value="mentions">الانجليزيه</option>
        </select>
      </div>
    </div>
    <div className={`${styles.settingsItem}`}>
            <div>
          <div className={`${styles.label}`}> الدولة</div>
            <p className={`${styles.description}`}>لا يمكن تعديل هذا الخيار</p>
            </div>
          <div className="dropdown">
            <select className={`${styles.dropdown}`}>
              <option value="all"> م.ع.السعودية</option>
            </select>
          </div>
        </div>
  <div className={`${styles.lastSettingsItem}`}>
          <div>
        <div className={`${styles.label}`}> المدينة</div>
          <p className={`${styles.description}`}>حدد المدينة التي تتواجد بها حاليا</p>
          </div>
        <div className="dropdown">
          <select className={`${styles.dropdown}`}>
            <option value="all"> جده</option>
            <option value="mentions">تفعيل</option>
          </select>
        </div>
      </div>
    

  </div>

  </>
  )
}
