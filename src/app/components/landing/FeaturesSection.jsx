import styles from "./landing.module.css";

export default function FeaturesSection() {
  const cards = [
    {
      title: "طريقة الاستخدام",
      icon: "✨",
      desc: "خطوات بسيطة وسهلة لمتابعة المبيعات"
    },
    {
      title: "شركاء معتمدين",
      icon: "⭐",
      desc: "أفضل المزودين لضمان جودة الخدمة"
    },
    {
      title: "حجوزات سريعة",
      icon: "🕒",
      desc: "استجابة فورية وحجوزات في وقت قياسي"
    }
  ];

  return (
    <section className="lp-section position-relative" style={{ backgroundColor: 'var(--lp-bg)' }}>
      <div className="container text-center">
        <h2 className={styles.sectionTitle} style={{ color: 'var(--lp-text)' }}>ما هو لقطها</h2>
        <p className={styles.sectionSubtitle}>
          أفضل تطبيق لطلب الشاحنات والمعدات في الوطن العربي
        </p>

        <div className="row g-4 justify-content-center mt-4">
          {cards.map((c, i) => (
            <div key={i} className="col-md-4">
              <div className={styles.featureCard}>
                <div className={styles.featureIconBox}>
                  {c.icon}
                </div>
                <h4 className="fw-bold mb-3" style={{ color: 'var(--lp-text)' }}>{c.title}</h4>
                <p className="mb-0" style={{ color: 'var(--lp-text-muted)', fontSize: '0.95rem' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
