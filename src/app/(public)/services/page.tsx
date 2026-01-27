// ============================================================================
// Services Browse Page - All Service Types
// Lists all available service types for browsing
// ============================================================================

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

// ============================================================================
// Data Fetching
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

// ============================================================================
// Page Component
// ============================================================================

export default async function ServicesPage() {
  const serviceTypes = await getServiceTypes();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>الخدمات</h1>
          <p className={styles.subtitle}>
            استكشف مجموعة متنوعة من الخدمات المتاحة في المملكة
          </p>
        </header>

        {/* Service Types Grid */}
        {serviceTypes.length > 0 ? (
          <div className={styles.grid}>
            {serviceTypes.map((type) => (
              <Link
                key={type.key}
                href={`/services/${type.key}`}
                className={styles.card}
              >
                <span className={styles.icon}>{type.icon}</span>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{type.label.ar}</h2>
                  <p className={styles.cardDescription}>
                    تصفح {type.itemLabel.ar}
                  </p>
                  {(type.partnersCount !== undefined || type.itemsCount !== undefined) && (
                    <div className={styles.cardStats}>
                      {type.partnersCount !== undefined && (
                        <span className={styles.stat}>
                          {type.partnersCount} شريك
                        </span>
                      )}
                      {type.itemsCount !== undefined && (
                        <span className={styles.stat}>
                          {type.itemsCount} {type.itemLabel.ar}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <span className={styles.arrow}>←</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <h3 className={styles.emptyTitle}>لا توجد خدمات متاحة</h3>
            <p className={styles.emptyDescription}>
              عذراً، لا توجد خدمات متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Metadata
// ============================================================================

export const metadata = {
  title: 'الخدمات - لقطة',
  description: 'استكشف مجموعة متنوعة من الخدمات المتاحة في المملكة العربية السعودية',
};
