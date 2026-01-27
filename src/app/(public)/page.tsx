// ============================================================================
// Landing Page - Server Component with SSR
// Homepage with hero section, service types grid, and featured items
// ============================================================================

import { Suspense } from 'react';
import Link from 'next/link';
import { servicesApi } from '@/lib/api/services/services.api';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

interface ServiceTypeCard {
  key: string;
  icon: string;
  label: {
    ar: string;
    en?: string;
  };
  itemLabel: {
    ar: string;
    en?: string;
  };
  itemsCount?: number;
  partnersCount?: number;
}

interface FeaturedItem {
  id: string;
  partnerId: string;
  partnerName?: string;
  serviceTypeKey: string;
  name: {
    ar: string;
    en?: string;
  };
  description?: {
    ar?: string;
    en?: string;
  };
  data: Record<string, unknown>;
}

// ============================================================================
// Data Fetching Functions
// ============================================================================

async function getServiceTypes(): Promise<ServiceTypeCard[]> {
  try {
    const response = await servicesApi.getServiceTypes();
    return response.serviceTypes || [];
  } catch (error) {
    console.error('Failed to fetch service types:', error);
    return [];
  }
}

async function getFeaturedItems(): Promise<FeaturedItem[]> {
  try {
    // BACKEND GAP: featured filter may not be implemented
    // Using limit=6 and hoping for best items
    const response = await servicesApi.search({ featured: true, limit: 6 });
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch featured items:', error);
    return [];
  }
}

// ============================================================================
// Server Components
// ============================================================================

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>اكتشف أفضل الخدمات في المملكة</h1>
        <p className={styles.heroSubtitle}>
          فنادق، مطاعم، شاليهات، تأجير سيارات والمزيد
        </p>
        <form className={styles.searchForm} action="/services/search" method="GET">
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              name="q"
              placeholder="ابحث عن فنادق، مطاعم، وأكثر..."
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            بحث
          </button>
        </form>
      </div>
      <div className={styles.heroOverlay} />
    </section>
  );
}

async function ServiceTypesSection() {
  const serviceTypes = await getServiceTypes();

  if (serviceTypes.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>استكشف حسب نوع الخدمة</h2>
        <Link href="/services" className={styles.sectionLink}>
          عرض الكل
        </Link>
      </div>
      <div className={styles.serviceTypesGrid}>
        {serviceTypes.map((type) => (
          <Link
            key={type.key}
            href={`/services/${type.key}`}
            className={styles.serviceTypeCard}
          >
            <span className={styles.serviceTypeIcon}>{type.icon}</span>
            <h3 className={styles.serviceTypeLabel}>{type.label.ar}</h3>
            {type.partnersCount !== undefined && (
              <span className={styles.serviceTypeCount}>
                {type.partnersCount} {type.itemLabel.ar}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

async function FeaturedItemsSection() {
  const items = await getFeaturedItems();

  if (items.length === 0) {
    return null;
  }

  const formatPrice = (data: Record<string, unknown>) => {
    const price = data.price || data.price_per_night || data.daily_rate;
    if (typeof price === 'number') {
      return `${price.toLocaleString('ar-SA')} ر.س`;
    }
    if (typeof price === 'object' && price !== null) {
      const priceObj = price as { amount?: number };
      return priceObj.amount ? `${priceObj.amount.toLocaleString('ar-SA')} ر.س` : null;
    }
    return null;
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>العروض المميزة</h2>
        <Link href="/services/search?featured=true" className={styles.sectionLink}>
          عرض الكل
        </Link>
      </div>
      <div className={styles.featuredGrid}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/services/${item.partnerId}/${item.id}`}
            className={styles.featuredCard}
          >
            <div className={styles.featuredImagePlaceholder}>
              <span className={styles.featuredImageIcon}>🖼️</span>
            </div>
            <div className={styles.featuredContent}>
              <h3 className={styles.featuredTitle}>{item.name.ar}</h3>
              {item.partnerName && (
                <p className={styles.featuredPartner}>{item.partnerName}</p>
              )}
              {item.description?.ar && (
                <p className={styles.featuredDescription}>
                  {item.description.ar.slice(0, 80)}
                  {item.description.ar.length > 80 && '...'}
                </p>
              )}
              {formatPrice(item.data) && (
                <span className={styles.featuredPrice}>
                  {formatPrice(item.data)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ServiceTypesSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.skeletonTitle} />
      </div>
      <div className={styles.serviceTypesGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>
    </section>
  );
}

function FeaturedSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.skeletonTitle} />
      </div>
      <div className={styles.featuredGrid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeletonFeaturedCard} />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Statistics Section
// ============================================================================

function StatsSection() {
  const stats = [
    { value: '500+', label: 'شريك موثوق' },
    { value: '2000+', label: 'خدمة متاحة' },
    { value: '50+', label: 'مدينة' },
    { value: '10000+', label: 'عميل سعيد' },
  ];

  return (
    <section className={styles.statsSection}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// CTA Section
// ============================================================================

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>هل لديك منشأة تجارية؟</h2>
        <p className={styles.ctaDescription}>
          انضم إلى منصة لقطة واعرض خدماتك لآلاف العملاء المحتملين
        </p>
        <Link href="/partner/register" className={styles.ctaButton}>
          انضم كشريك الآن
        </Link>
      </div>
    </section>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <HeroSection />
      
      <div className={styles.container}>
        <Suspense fallback={<ServiceTypesSkeleton />}>
          <ServiceTypesSection />
        </Suspense>

        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedItemsSection />
        </Suspense>

        <StatsSection />
      </div>

      <CTASection />
    </div>
  );
}

// ============================================================================
// Metadata
// ============================================================================

export const metadata = {
  title: 'لقطة - اكتشف أفضل الخدمات في المملكة',
  description: 'منصة لاكتشاف وحجز أفضل الفنادق والمطاعم والشاليهات وتأجير السيارات في المملكة العربية السعودية',
};
