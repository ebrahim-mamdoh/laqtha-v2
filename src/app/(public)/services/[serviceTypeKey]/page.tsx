// ============================================================================
// Browse by Service Type Page - Dynamic Route
// Lists partners/items for a specific service type
// ============================================================================

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { servicesApi } from '@/lib/api/services/services.api';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

interface ServiceType {
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
}

interface ServiceItem {
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

interface PageProps {
  params: Promise<{
    serviceTypeKey: string;
  }>;
  searchParams: Promise<{
    page?: string;
    city?: string;
  }>;
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getServiceType(key: string): Promise<ServiceType | null> {
  try {
    const response = await servicesApi.getServiceType(key);
    return response.serviceType;
  } catch (error) {
    console.error('Failed to fetch service type:', error);
    return null;
  }
}

async function getItemsByServiceType(
  serviceTypeKey: string,
  page: number = 1,
  city?: string
): Promise<{ items: ServiceItem[]; total: number; totalPages: number }> {
  try {
    const response = await servicesApi.search({
      serviceType: serviceTypeKey,
      city,
      page,
      limit: 12,
    });
    return {
      items: response.data || [],
      total: response.pagination?.total || 0,
      totalPages: response.pagination?.totalPages || 1,
    };
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return { items: [], total: 0, totalPages: 1 };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatPrice(data: Record<string, unknown>): string | null {
  const price = data.price || data.price_per_night || data.daily_rate;
  if (typeof price === 'number') {
    return `${price.toLocaleString('ar-SA')} ر.س`;
  }
  if (typeof price === 'object' && price !== null) {
    const priceObj = price as { amount?: number };
    return priceObj.amount ? `${priceObj.amount.toLocaleString('ar-SA')} ر.س` : null;
  }
  return null;
}

function getCity(data: Record<string, unknown>): string | null {
  return (data.city as string) || null;
}

// ============================================================================
// Components
// ============================================================================

function ItemCard({ item, itemLabel }: { item: ServiceItem; itemLabel: string }) {
  const price = formatPrice(item.data);
  const city = getCity(item.data);

  return (
    <Link
      href={`/services/partner/${item.partnerId}/${item.id}`}
      className={styles.itemCard}
    >
      <div className={styles.itemImagePlaceholder}>
        <span className={styles.itemImageIcon}>🖼️</span>
      </div>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{item.name.ar}</h3>
        {item.partnerName && (
          <p className={styles.itemPartner}>{item.partnerName}</p>
        )}
        <div className={styles.itemMeta}>
          {city && (
            <span className={styles.itemCity}>
              <span className={styles.metaIcon}>📍</span>
              {city}
            </span>
          )}
        </div>
        {item.description?.ar && (
          <p className={styles.itemDescription}>
            {item.description.ar.slice(0, 60)}
            {item.description.ar.length > 60 && '...'}
          </p>
        )}
        <div className={styles.itemFooter}>
          {price && <span className={styles.itemPrice}>{price}</span>}
          <span className={styles.itemAction}>عرض التفاصيل</span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className={styles.pagination}>
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className={styles.paginationLink}
        >
          السابق
        </Link>
      )}
      
      {pages.map((page) => (
        <Link
          key={page}
          href={`${baseUrl}?page=${page}`}
          className={`${styles.paginationLink} ${page === currentPage ? styles.paginationActive : ''}`}
        >
          {page}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className={styles.paginationLink}
        >
          التالي
        </Link>
      )}
    </nav>
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.grid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  );
}

// ============================================================================
// Page Component
// ============================================================================

export default async function ServiceTypePage({ params, searchParams }: PageProps) {
  const { serviceTypeKey } = await params;
  const { page: pageParam, city } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  // Fetch service type
  const serviceType = await getServiceType(serviceTypeKey);
  
  if (!serviceType) {
    notFound();
  }

  // Fetch items
  const { items, total, totalPages } = await getItemsByServiceType(
    serviceTypeKey,
    page,
    city
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>الرئيسية</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/services" className={styles.breadcrumbLink}>الخدمات</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{serviceType.label.ar}</span>
        </nav>

        {/* Page Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>{serviceType.icon}</span>
            <div>
              <h1 className={styles.title}>{serviceType.label.ar}</h1>
              <p className={styles.subtitle}>
                {total} {serviceType.itemLabel.ar} متاحة
              </p>
            </div>
          </div>
        </header>

        {/* Filters (Basic - can be expanded) */}
        <div className={styles.filters}>
          <div className={styles.filterInfo}>
            <span>عرض {items.length} من {total} نتيجة</span>
          </div>
        </div>

        {/* Items Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          {items.length > 0 ? (
            <>
              <div className={styles.grid}>
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    itemLabel={serviceType.itemLabel.ar}
                  />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/services/${serviceTypeKey}`}
              />
            </>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📭</span>
              <h3 className={styles.emptyTitle}>لا توجد نتائج</h3>
              <p className={styles.emptyDescription}>
                عذراً، لا توجد {serviceType.itemLabel.ar} متاحة حالياً في هذه الفئة.
              </p>
              <Link href="/services" className={styles.emptyLink}>
                تصفح خدمات أخرى
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

// ============================================================================
// Generate Metadata
// ============================================================================

export async function generateMetadata({ params }: PageProps) {
  const { serviceTypeKey } = await params;
  const serviceType = await getServiceType(serviceTypeKey);

  if (!serviceType) {
    return {
      title: 'غير موجود - لقطة',
    };
  }

  return {
    title: `${serviceType.label.ar} - لقطة`,
    description: `تصفح أفضل ${serviceType.itemLabel.ar} في المملكة العربية السعودية`,
  };
}
