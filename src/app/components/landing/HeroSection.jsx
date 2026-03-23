import Link from "next/link";
import styles from "./landing.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGlow}></div>
      <div className={`container ${styles.heroContent}`}>
        <h1 className={styles.heroTitle}>
          <span className="d-block" style={{ color: 'var(--lp-text)' }}>انت اطلب بس!</span>
          <span className={`d-block ${styles.gradientText}`}>وحنا الباقي علينا</span>
        </h1>
        <p className="lead mt-3 mb-5 fw-medium mx-auto" style={{ maxWidth: 600, color: 'var(--lp-text-muted)' }}>
          طوّرنا لقطة ليكون الحل الأمثل لإدارة حجوزاتك ومبيعاتك بكفاءة عالية.
        </p>

        <Link href="/register" className={styles.btnPrimaryCustom}>
          احجز عرضك الآن
        </Link>

        {/* Mock Phone Frame */}
        <div className={styles.phoneMockupContainer}>
          <div className={styles.phoneFrame}>
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-card-bg)' }}>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gradient-primary)' }}></div>
                <div>
                  <div style={{ width: 80, height: 8, background: 'var(--lp-text)', borderRadius: 4, marginBottom: 4 }}></div>
                  <div style={{ width: 50, height: 6, background: 'var(--lp-text-muted)', borderRadius: 4 }}></div>
                </div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(128,128,128,0.2)' }}></div>
            </div>
            {/* Feed Mock content */}
            <div className="p-3 d-flex flex-column gap-3">
              <div style={{ height: 160, borderRadius: 16, background: 'var(--gradient-hero)', border: '1px solid var(--lp-border)' }}></div>
              <div style={{ height: 60, borderRadius: 12, background: 'var(--lp-card-bg)', border: '1px solid var(--lp-border)' }}></div>
              <div style={{ height: 60, borderRadius: 12, background: 'var(--lp-card-bg)', border: '1px solid var(--lp-border)' }}></div>
              <div style={{ height: 60, borderRadius: 12, background: 'var(--lp-card-bg)', border: '1px solid var(--lp-border)' }}></div>
            </div>
            {/* Nav mock */}
            <div className="position-absolute bottom-0 w-100 p-3 border-top d-flex justify-content-between px-4" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-card-bg)' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)' }}></div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(128,128,128,0.3)' }}></div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(128,128,128,0.3)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
