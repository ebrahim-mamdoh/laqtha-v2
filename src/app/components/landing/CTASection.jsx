import Link from "next/link";
import styles from "./landing.module.css";

export default function CTASection() {
  const steps = [
    { title: "التسجيل", desc: "أدخل معلوماتك الأساسية لإنشاء حسابك" },
    { title: "الخطوة الأولى", desc: "أكمل ملفك الشخصي بمعلومات إضافية" },
    { title: "الخطوة الثانية", desc: "اختر نوع الخدمة التي ترغب بتقديمها" },
    { title: "الخطوة الثالثة", desc: "انطلق وابدأ في استقبال طلباتك" }
  ];

  return (
    <section className="lp-section position-relative border-top" style={{ backgroundColor: 'var(--lp-card-bg)', borderColor: 'var(--lp-border)' }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-md-6 order-md-2">
            <div className="text-md-start text-center ps-md-5">
               <h2 className={styles.sectionTitle} style={{ color: 'var(--color-primary)' }}>
                 لقطها
               </h2>
               <p className={styles.sectionSubtitle} style={{ fontSize: '1.4rem', margin: '20px 0 30px' }}>
                 انضم إلينا كشريك استراتيجي!
               </p>
               <p className="lead mb-4" style={{ color: 'var(--lp-text-muted)' }}>
                 هل تبحث عن زيادة مبيعاتك وتوسيع قاعدة عملائك؟ انضم لشبكتنا الموثوقة من شركاء النقل واستفد من طلبات العملاء المتزايدة والتقارير المتقدمة.
               </p>
               <Link href="/register" className={styles.btnPrimaryCustom} style={{ padding: '14px 40px', fontSize: '1.1rem' }}>
                 سجل كشريك الآن
               </Link>

               {/* Partner Logos */}
               <div className="mt-5 pt-4 border-top" style={{ borderColor: 'var(--lp-border)' }}>
                 <p className="mb-3 fw-bold" style={{ color: 'var(--lp-text)' }}>الموثوقية مع كبرى الشركات</p>
                 <div className={styles.partnerLogos}>
                   <span>Aramex</span>
                   <span>Amazon</span>
                   <span>FedEx</span>
                   <span>DHL</span>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="col-md-6 order-md-1">
            <div className="p-5 rounded-4" style={{ background: 'var(--lp-bg)', border: '1px solid var(--lp-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              {steps.map((step, idx) => (
                <div key={idx} className={styles.stepItem}>
                  <div className={styles.stepNumber}>{idx + 1}</div>
                  <div className={styles.stepContent}>
                    <h5 className={styles.stepTitle} style={{ color: 'var(--lp-text)' }}>{step.title}</h5>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
