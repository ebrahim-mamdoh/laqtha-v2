// FILE: components/BalanceCard.jsx
'use client';
import styles from './balance.module.css';


export default function Balance({ data }) {
return (
<div className={styles.balanceCard}>
<button className={styles.chargeBtn}>شحن رصيد</button>
<div className={styles.balanceBody}>
<div className={styles.balanceInfo}>
<div className={styles.smallTitle}>رصيدي</div>
<div className={styles.bigAmount}>{data.amount} ر.س</div>
<div className={styles.sub}>عرض الرصيد بـ {data.currency}</div>
</div>
</div>
</div>
);}