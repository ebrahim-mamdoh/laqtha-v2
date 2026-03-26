import Image from "next/image";
import styles from "./ScreensSection.module.css";

/**
 * Feature data
 * imageTop: true  → image rendered above text
 * imageTop: false → image rendered below text
 */
const leftFeatures = [
  {
    title: "تجربة بصرية ممتعة ومريحة",
    desc: "تصميم متقن يجمع بين الجمال والعملية ليوفر لك رحلة مستخدم سلسة ومميزة.",
    img: "/landing/screen-home.svg",
    imageTop: true  // image → text
  },
  {
    title: "اطلب الفزعة من أصدقائك",
    desc: "شارك طلباتك مع المجتمع المتفاعل واسأل للحصول على أفضل التوصيات بسرعة.",
    img: "/landing/screen-recording.svg",
    imageTop: false // text → image
  }
];

const rightFeatures = [
  {
    title: "دردشة ذكية مع نموذج ذكاء",
    desc: "استمتع بمحادثات حية وتوجيه ذكي من خلال مساحتنا التفاعلية لتسهيل مهامك.",
    img: "/landing/screen-chat.svg",
    imageTop: false // text → image (right column starts offset, so text first)
  },
  {
    title: "خدمة عملاء على مدار الساعة",
    desc: "فريقنا متواجد دائماً للإجابة على استفساراتك وضمان أفضل تجربة لك ولحجوزاتك.",
    img: "/landing/screen-analysis.svg",
    imageTop: true  // image → text
  }
];

function FeatureItem({ title, desc, img, imageTop }) {
  return (
    <div className={styles.item} dir="rtl">
      {imageTop && (
        <div className={styles.imageWrapper}>
          <Image
            src={img}
            width={300}
            height={600}
            alt={title}
            className={styles.screenImage}
            style={{ maxWidth: '300px', width: '100%', height: 'auto', borderRadius: '28px' }}
          />
        </div>
      )}

      <div className={styles.text}>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>

      {!imageTop && (
        <div className={styles.imageWrapper}>
          <Image
            src={img}
            width={300}
            height={600}
            alt={title}
            className={styles.screenImage}
            style={{ maxWidth: '300px', width: '100%', height: 'auto', borderRadius: '28px' }}
          />
        </div>
      )}
    </div>
  );
}

export default function ScreensSection() {
  return (
    <section className={styles.section}>
      <div className="container">

        {/* Section Header */}
        <div className={styles.header}>
          <h2>أفضل المزايا في مكان واحد</h2>
          <p>
            لقطها ليس مجرد أداة للحجز والطلب، إنه رفيقك في رحلاتك ومساعدك في وقت الطلبات الدقيقة
          </p>
        </div>

        {/* Staggered Two-Column Layout */}
        <div className={styles.columnsWrapper}>

          {/* LEFT COLUMN — starts at top */}
          <div className={styles.leftColumn}>
            {leftFeatures.map((item, idx) => (
              <FeatureItem key={`left-${idx}`} {...item} />
            ))}
          </div>

          {/* RIGHT COLUMN — vertically offset for stagger */}
          <div className={styles.rightColumn}>
            {rightFeatures.map((item, idx) => (
              <FeatureItem key={`right-${idx}`} {...item} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
