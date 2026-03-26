import Image from "next/image";

export default function WhyChooseUsSection() {
  return (
    <section className="lp-section position-relative py-5" style={{ backgroundColor: 'var(--lp-bg)' }}>
      <div className="container py-5">
        <div className="text-center mb-5 pb-4">
          <h2 className="fw-bold mb-3" style={{ color: 'var(--lp-text, #ffffff)', fontSize: '3rem', letterSpacing: '-1px' }}>لماذا نحن الخيار الأمثل</h2>
          <p className="mx-auto" style={{ color: 'var(--lp-text-muted, #a1a1a1)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
            لقطها ليس مجرد أداة للحجز والطلب، إنه رفيقك في رحلاتك ومساعدك في وقت الطلبات الدقيقة
          </p>
        </div>

        <div className="w-100 d-flex justify-content-center mt-5">
          <Image 
            src="/landing/Why_Choose_Us_section.svg" 
            alt="لماذا نحن الخيار الأمثل" 
            width={1200} 
            height={800} 
            className="img-fluid" 
            style={{ width: '100%', height: 'auto', borderRadius: '35px' }} 
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
