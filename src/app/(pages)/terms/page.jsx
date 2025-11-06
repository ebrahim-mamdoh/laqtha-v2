import React from 'react'
import styles from './terms.module.css'
export default function terms() {
  return (
   <>
   <div className={styles.background}>
   <div className="container">
    <div className={styles.textWraper}>
      <h2 className=" mb-4">شروط الاستخدام</h2>
  <ul className={styles.termsList}>
  <li>
    <strong>1. قبول الشروط:</strong>
    <ul>
      <li>باستخدامك تطبيق <strong>لقطها</strong>، فإنك توافق على الالتزام بهذه الشروط والأحكام وجميع التحديثات المستقبلية.</li>
    </ul>
  </li>

  <li>
    <strong>2. التسجيل والحساب:</strong>
    <ul>
      <li>يجب أن يكون عمر المستخدم 18 سنة فأكثر.</li>
      <li>الالتزام بتقديم بيانات صحيحة وحديثة عند التسجيل.</li>
      <li>المستخدم مسؤول عن سرية كلمة المرور وأي نشاط يتم من حسابه.</li>
    </ul>
  </li>

  <li>
    <strong>3. الاستخدام المسموح به:</strong>
    <ul>
      <li>التطبيق مخصص للاستخدام الشخصي أو التجاري المصرح به فقط.</li>
      <li>يُمنع استخدام التطبيق لأي غرض غير قانوني أو ضار.</li>
      <li>يُمنع تعديل أو نسخ أو إعادة توزيع محتوى التطبيق بدون إذن.</li>
    </ul>
  </li>

  <li>
    <strong>4. الطلبات والمدفوعات:</strong>
    <ul>
      <li>(يمكنك هنا إضافة البنود الخاصة بالمدفوعات لاحقًا)</li>
    </ul>
  </li>
</ul>



    </div>
   </div>
   </div>
   </>

  )
}
