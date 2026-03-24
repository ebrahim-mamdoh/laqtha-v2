import styles from "./landing.module.css";

export default function ScreensSection() {
  const screens = [
    {
      title: "دردشة ذكية مع نموذج ذكاء",
      desc: "استمتع بمحادثات حية وتوجيه ذكي من خلال مساحتنا التفاعلية لتسهيل مهامك.",
      reverse: false
    },
    {
      title: "تجربة بصرية ممتعة ومريحة",
      desc: "تصميم متقن يجمع بين الجمال والعملية ليوفر لك رحلة مستخدم سلسة ومميزة.",
      reverse: true
    },
    {
      title: "اطلب الفزعة من أصدقائك",
      desc: "شارك طلباتك مع المجتمع المتفاعل واسأل للحصول على أفضل التوصيات بسرعة.",
      reverse: false
    },
    {
      title: "خدمة عملاء على مدار الساعة",
      desc: "فريقنا متواجد دائماً للإجابة على استفساراتك وضمان أفضل تجربة لك ولحجوزاتك.",
      reverse: true
    }
  ];

  return (
    <section className="lp-section position-relative" style={{ backgroundColor: 'var(--lp-bg)' }}>
      <div className="container">
        <div className="text-center mb-5 pb-4">
          <h2 className={styles.sectionTitle} style={{ color: 'var(--lp-text)' }}>أفضل المزايا في مكان واحد</h2>
          <p className={styles.sectionSubtitle}>
            لقطها ليس مجرد اداة للحجز والطلب، انه رفيقك في رحلاتك ومساعدك في وقت الطلبات الديقة
          </p>
        </div>

        <div className="d-flex flex-column gap-5">
          {screens.map((item, idx) => (
            <div key={idx} className={`row align-items-center ${item.reverse ? 'flex-row-reverse' : ''}`} style={{ marginBottom: '60px' }}>
              <div className="col-md-6 col-lg-5 mb-4 mb-md-0 text-center">
                <div className="position-relative d-inline-block">
                  <div className={styles.heroGlow} style={{ width: '400px', height: '400px', opacity: 0.5 }}></div>
                  <div style={{ position: 'relative', zIndex: 2, background: 'var(--lp-card-bg)', border: '1px solid var(--lp-border)', borderRadius: '35px', padding: '12px', width: '280px', height: '580px', margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                    <div style={{ height: '100%', background: 'var(--lp-bg)', borderRadius: '25px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                      {/* Mock UI lines */}
                      <div style={{ width: '40%', height: '10px', background: 'var(--gradient-primary)', borderRadius: '5px', marginBottom: '20px' }}></div>
                      <div style={{ width: '100%', height: '80px', background: 'var(--lp-card-bg)', borderRadius: '15px', marginBottom: '15px' }}></div>
                      <div style={{ width: '100%', height: '150px', background: 'var(--color-purple)', opacity: 0.1, borderRadius: '15px', marginBottom: '15px' }}></div>
                      <div style={{ width: '100%', height: '80px', background: 'var(--lp-card-bg)', borderRadius: '15px', marginBottom: '15px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`col-md-6 col-lg-5 ${item.reverse ? 'pe-lg-5 text-md-end' : 'ps-lg-5'}`}>
                <h3 className="fw-bold mb-4" style={{ color: 'var(--lp-text)', fontSize: '2rem' }}>{item.title}</h3>
                <p className="lead" style={{ color: 'var(--lp-text-muted)', lineHeight: '1.8' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
