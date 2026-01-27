// ============================================================================
// Partner Public Profile Page
// Displays partner business information and their service items
// ============================================================================

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { servicesApi } from '@/lib/api/services/services.api';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

interface PartnerInfo {
  id: string;
  businessName: string;
  city: string;
  serviceTypeKey: string;
  serviceTypeData: Record<string, unknown>;
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
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getPartnerWithItems(
  partnerId: string,
  page: number = 1
): Promise<{
  partner: PartnerInfo | null;
  items: ServiceItem[];
  total: number;
  totalPages: number;
}> {
  try {
    const response = await servicesApi.getPartnerItems(partnerId, {
      page,
      limit: 12,
    });
    
    return {
      partner: response.partner,
      items: response.items || [],
      total: response.pagination?.total || 0,
      totalPages: response.pagination?.totalPages || 1,
    };
  } catch (error) {
    console.error('Failed to fetch partner data:', error);
    return {
      partner: null,
      items: [],
      total: 0,
      totalPages: 1,
    };
  }
}

async function getServiceTypeLabel(key: string): Promise<string> {
  try {
    const response = await servicesApi.getServiceType(key);
    return response.serviceType?.label?.ar || key;
  } catch {
    return key;
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

function getStarRating(data: Record<string, unknown>): number | null {
  const rating = data.star_rating || data.rating || data.stars;
  if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
    return rating;
  }
  return null;
}

function getAmenities(data: Record<string, unknown>): string[] {
  const amenities = data.amenities || data.facilities || data.features;
  if (Array.isArray(amenities)) {
    return amenities.slice(0, 6);
  }
  return [];
}

// ============================================================================
// Components
// ============================================================================

function StarRating({ rating }: { rating: number }) {
  return (
    <span className={styles.starRating}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
          ⭐
        </span>
      ))}
    </span>
  );
}

function ItemCard({ item }: { item: ServiceItem }) {
  const price = formatPrice(item.data);

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
        {item.description?.ar && (
          <p className={styles.itemDescription}>
            {item.description.ar.slice(0, 80)}
            {item.description.ar.length > 80 && '...'}
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
    <div className={styles.itemsGrid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  );
}

// ============================================================================
// Page Component
// ============================================================================

export default async function PartnerPublicPage({ params, searchParams }: PageProps) {
  const { id: partnerId } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  // Fetch partner data and items
  const { partner, items, total, totalPages } = await getPartnerWithItems(partnerId, page);

  if (!partner) {
    notFound();
  }

  // Get service type label
  const serviceTypeLabel = await getServiceTypeLabel(partner.serviceTypeKey);

  // Extract partner profile data
  const starRating = getStarRating(partner.serviceTypeData);
  const amenities = getAmenities(partner.serviceTypeData);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>الرئيسية</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/services" className={styles.breadcrumbLink}>الخدمات</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link
            href={`/services/${partner.serviceTypeKey}`}
            className={styles.breadcrumbLink}
          >
            {serviceTypeLabel}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{partner.businessName}</span>
        </nav>

        {/* Partner Header / Hero */}
        <header className={styles.header}>
          <div className={styles.headerImagePlaceholder}>
            <span className={styles.headerImageIcon}>🏢</span>
          </div>
          <div className={styles.headerContent}>
            <div className={styles.headerTop}>
              <span className={styles.serviceTypeBadge}>{serviceTypeLabel}</span>
              {starRating && <StarRating rating={starRating} />}
            </div>
            <h1 className={styles.title}>{partner.businessName}</h1>
            
            <div className={styles.headerMeta}>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>📍</span>
                {partner.city}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>📦</span>
                {total} عنصر متاح
              </span>
            </div>

            {amenities.length > 0 && (
              <div className={styles.amenities}>
                {amenities.map((amenity, index) => (
                  <span key={index} className={styles.amenityTag}>
                    {typeof amenity === 'string' ? amenity : String(amenity)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Contact Info Card 
            BACKEND GAP: No public endpoint for partner contact details (phone, email, website)
            These would need to be added to the API response */}
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>معلومات المنشأة</h3>
            <div className={styles.infoCardContent}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>الموقع</span>
                <span className={styles.infoValue}>{partner.city}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>نوع الخدمة</span>
                <span className={styles.infoValue}>{serviceTypeLabel}</span>
              </div>
              {/* Note: Additional contact info would need backend support */}
            </div>
          </div>
        </div>

        {/* Items Section */}
        <section className={styles.itemsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>الخدمات المتاحة</h2>
            <span className={styles.sectionCount}>{total} عنصر</span>
          </div>

          <Suspense fallback={<LoadingSkeleton />}>
            {items.length > 0 ? (
              <>
                <div className={styles.itemsGrid}>
                  {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  baseUrl={`/services/partner/${partnerId}`}
                />
              </>
            ) : (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📭</span>
                <h3 className={styles.emptyTitle}>لا توجد خدمات</h3>
                <p className={styles.emptyDescription}>
                  لا توجد خدمات متاحة من هذا الشريك حالياً.
                </p>
              </div>
            )}
          </Suspense>
        </section>
      </div>
    </div>
  );
}

// ============================================================================
// Generate Metadata
// ============================================================================

export async function generateMetadata({ params }: PageProps) {
  const { id: partnerId } = await params;
  const { partner } = await getPartnerWithItems(partnerId);

  if (!partner) {
    return {
      title: 'غير موجود - لقطة',
    };
  }

  return {
    title: `${partner.businessName} - لقطة`,
    description: `تصفح خدمات ${partner.businessName} في ${partner.city}`,
  };
}
