'use client';
import styles from './transactions.module.css';


export default function TransactionsList({ items }) {
return (
<div className={styles.transCard}>
<h5 className={styles.title}>عمليات الشراء والحجز</h5>
<div className={styles.list}>
{items.map((it, idx) => (
<div key={idx} className={styles.rowItem}>
<div className={styles.meta}>
<div className={styles.name}>{it.title}</div>
<div className={styles.type}>{it.type}</div>
</div>
<div className={styles.amount}>{it.amount} ر.س</div>
</div>
))}
</div>
</div>
);
}