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

        <Link href="/register" className={styles.btnPrimaryCustom}>
          احجز عرضك الآن
        </Link>

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
