import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";

export default function FeaturesSection() {
  const cards = [
    {
      title: "حجوزات سريعة",
      desc: "ما أصله؟ خلافاً للاعتقاد السائد فإن لوريم إيبسوم ليس نصاً عشوائياً، بل إن له جذور في الأدب اللاتيني الكلاسيكي منذ العام 45 قبل الميلاد، مما يجعله أكثر من عام في القدم."
    },
    {
      title: "شركاء متعددين",
      desc: "ما أصله؟ خلافاً للاعتقاد السائد فإن لوريم إيبسوم ليس نصاً عشوائياً، بل إن له جذور في الأدب اللاتيني الكلاسيكي منذ العام 45 قبل الميلاد، مما يجعله أكثر من عام في القدم.",
      featured: true
    },
    {
      title: "فزعة الاصدقاء",
      desc: "ما أصله؟ خلافاً للاعتقاد السائد فإن لوريم إيبسوم ليس نصاً عشوائياً، بل إن له جذور في الأدب اللاتيني الكلاسيكي منذ العام 45 قبل الميلاد، مما يجعله أكثر من عام في القدم."
    }
  ];

  return (
    <section className={`lp-section position-relative py-5 ${styles.featuresSectionWrapper}`}>
      <div className={`container text-center ${styles.featuresContainer}`}>
        <h2 className={`fw-bolder mb-3 ${styles.featuresMainTitle}`}>ما هو لقطها</h2>
        <p className={`mx-auto fw-bold ${styles.featuresSubtitle}`}>
          افضل تطبيق ذكاء اصطناعي للطلبات والحجوزات<br/>في الوطن العربي
        </p>
        <p className={`mx-auto mt-4 mb-5 ${styles.featuresDesc}`}>
          يتيح لك امكانية الحجز في مختلف فنادق المملكة، بالاضافة الى امكانية الطلب من مطاعمك المفضلة عن طريق الدردشة مع وكيل الذكاء الاصطناعي واخباره بما تريد. لمزيد من الخطوات المعقدة استخدم صوتك فقط
        </p>

        <div className="row g-4 justify-content-center mt-5 mb-5 align-items-center">
          {cards.map((c, i) => (
            <div key={i} className="col-md-4">
              <div 
                className={`position-relative text-end p-4 ${styles.customFeatureCard} ${c.featured ? styles.customFeatureCardFeatured : ''}`}
              >
                {/* Star Image (Positioned to the left visually because text is RTL) */}
                <div className="text-start mt-2 mb-2 pe-2">
                  <Image src="/landing/stars.svg" width={110} height={110} alt="stars" />
                </div>
                
                <h4 className={`fw-bolder mb-3 px-2 ${styles.cardTitle}`}>{c.title}</h4>
                <p className={`px-2 mb-0 ${styles.cardDesc}`}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 pb-5">
          <Link href="/about" className={`btn px-5 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 ${styles.readMoreBtn}`}>
            <span dir="ltr">&larr;</span> عرض المزيد
          </Link>
        </div>
      </div>
    </section>
  );
}
