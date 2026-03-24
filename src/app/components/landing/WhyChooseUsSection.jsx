import styles from "./landing.module.css";

export default function WhyChooseUsSection() {
  return (
    <section className="lp-section position-relative" style={{ backgroundColor: 'var(--lp-card-bg)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className={styles.sectionTitle} style={{ color: 'var(--lp-text)' }}>لماذا نحن الخيار الأمثل</h2>
          <p className={styles.sectionSubtitle}>
            لقطها ليس مجرد اداة للحجز والطلب، انه رفيقك في رحلاتك ومساعدك في وقت الطلبات الديقة
          </p>
        </div>

        <div className="row g-4 lg-g-5">
          <div className="col-md-6">
            <div className={styles.advantageCard}>
              <h3 className={styles.advantageTitle} style={{ color: 'var(--lp-text)', marginBottom: '140px' }}>
                لا مزيد من التطبيقات! <br /> <span className={styles.gradientText}>لقطها يغنيك</span>
              </h3>
              {/* Mock phone embedded in card bottom */}
              <div className="position-absolute bottom-0 end-0 ps-5" style={{ transform: 'translateY(20px)', width: '80%' }}>
                <div style={{ height: 160, background: 'var(--lp-bg)', borderTopLeftRadius: 30, border: '1px solid var(--lp-border)', borderBottom: 'none', padding: 20 }}>
                  <div style={{ width: 100, height: 10, background: 'var(--gradient-primary)', borderRadius: 5, marginBottom: 15 }}></div>
                  <div style={{ width: '100%', height: 40, background: 'var(--lp-card-bg)', borderRadius: 10, marginBottom: 10 }}></div>
                  <div style={{ width: '100%', height: 40, background: 'var(--lp-card-bg)', borderRadius: 10 }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className={styles.advantageCard} style={{ background: 'var(--color-bg-2)', overflow: 'hidden' }}>
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.4, background: 'radial-gradient(circle at bottom, rgba(112, 45, 231, 0.4), transparent 60%)' }}></div>
              <h3 className={styles.advantageTitle} style={{ color: '#fff', marginBottom: '140px' }}>
                شاحنات الحمولات <br /> الثقيلة بين يديك
              </h3>
              <div className="position-absolute bottom-0 start-0 w-100 text-center pb-2">
                <span style={{ fontSize: '4rem' }}>🚛</span>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className={styles.advantageCard} style={{ minHeight: '180px', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <h3 className={styles.advantageTitle} style={{ color: 'var(--lp-text)', margin: 0 }}>
                تجربة جديدة <span className={styles.gradientText}>للاستخدام</span>
              </h3>
              {/* decorative logo float */}
              <div className="position-absolute" style={{ right: '10%', opacity: 0.1, fontSize: '6rem', color: 'var(--color-primary)' }}>ل</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
