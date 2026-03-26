"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./landing.module.css";

export default function HeroSection() {
  return (
    <section
      className={styles.heroSection}
      style={{
        backgroundImage: "url('/landing/hero-bg-gradient.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className={styles.heroGlow}></div>
      <div className={`container ${styles.heroContent}`}>
        <h1 className={styles.heroTitle}>
          <span className="d-block" style={{ color: 'var(--lp-text)' }}>انت اطلب بس!</span>
          <span className={`d-block ${styles.gradientText}`}>وخلي الباقي علينا</span>
        </h1>
        <p className="lead mt-3 mb-5 fw-medium mx-auto" style={{ maxWidth: 600, color: 'var(--lp-text-muted)' }}>
          افضل تطبيق ذكاء اصطناعي للطلبات والحجوزات في الوطن العربي كل ما تحتاجه هو اخباره بما تريد وسيتكفل لك بالباقي
        </p>

        {/* CTA Buttons */}
        <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap mt-4" dir="rtl">
          {/* Download App Button */}
          <Link
            href="/download"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, rgba(158, 120, 255, 0.8) 0%, #615CF7 23%, #9A44F0 56%, #FA58D0 81%, rgba(247, 149, 229, 0.6) 100%)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(154, 68, 240, 0.5)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(154, 68, 240, 0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(154, 68, 240, 0.5)'; }}
          >
            <span style={{ fontSize: '1rem' }}>←</span>
            تحميل التطبيق
          </Link>

          {/* Open Chat Button */}
          <Link
            href="/chat"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, rgba(158, 120, 255, 0.8) 0%, #615CF7 23%, #9A44F0 56%, #FA58D0 81%, rgba(247, 149, 229, 0.6) 100%)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(154, 68, 240, 0.5)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(154, 68, 240, 0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(154, 68, 240, 0.5)'; }}
          >
            <span style={{ fontSize: '1rem' }}>←</span>
            فتح الدردشة
          </Link>
        </div>

        {/* Star rating social proof */}
        <div className="text-center mt-4" dir="rtl">
          <div style={{ color: '#FFD700', fontSize: '1.1rem', letterSpacing: '4px', marginBottom: '6px' }}>
            ★★★★★
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>
            حمله الان انه مجاني تماما
          </p>
        </div>

        {/* Mock Phone Frame Replacement with actual Figma file */}
        <div
          className="position-relative mx-auto mt-5"
          style={{
            maxWidth: '380px',
            zIndex: 10,
            marginBottom: '-250px'
          }}
        >
          <Image
            src="/landing/Group1.svg"
            alt="Laqtaha app mockup"
            width={380}
            height={800} /* Assuming typical smartphone aspect ratio */
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
