// ============================================================================
// Search Results Page
// Displays search results with filters
// ============================================================================

import { Suspense } from 'react';
import Link from 'next/link';
import { servicesApi } from '@/lib/api/services/services.api';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

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
  searchParams: Promise<{
    q?: string;
    serviceType?: string;
    city?: string;
    featured?: string;
    page?: string;
  }>;
}

// ============================================================================
// Data Fetching
// ============================================================================

async function searchItems(params: {
  q?: string;
  serviceType?: string;
  city?: string;
  featured?: boolean;
  page?: number;
}): Promise<{
  items: ServiceItem[];
  total: number;
  totalPages: number;
}> {
  try {
    const response = await servicesApi.search({
      q: params.q,
      serviceType: params.serviceType,
      city: params.city,
      featured: params.featured,
      page: params.page || 1,
      limit: 12,
    });
    return {
      items: response.data || [],
      total: response.pagination?.total || 0,
      totalPages: response.pagination?.totalPages || 1,
    };
  } catch (error) {
    console.error('Search failed:', error);
    return { items: [], total: 0, totalPages: 1 };
  }
}

async function getServiceTypes() {
  try {
    const response = await servicesApi.getServiceTypes();
    return response.serviceTypes || [];
  } catch {
    return [];
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

// ============================================================================
// Components
// ============================================================================

function ItemCard({ item }: { item: ServiceItem }) {
  const price = formatPrice(item.data);
  const city = item.data.city as string | undefined;

  return (
    <Link
      href={`/services/${item.partnerId}/${item.id}`}
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
        {city && (
          <span className={styles.itemCity}>
            📍 {city}
          </span>
        )}
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
  searchQuery,
}: {
  currentPage: number;
  totalPages: number;
  searchQuery: string;
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
          href={`/services/search?${searchQuery}&page=${currentPage - 1}`}
          className={styles.paginationLink}
        >
          السابق
        </Link>
      )}
      
      {pages.map((page) => (
        <Link
          key={page}
          href={`/services/search?${searchQuery}&page=${page}`}
          className={`${styles.paginationLink} ${page === currentPage ? styles.paginationActive : ''}`}
        >
          {page}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link
          href={`/services/search?${searchQuery}&page=${currentPage + 1}`}
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

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const query = params.q || '';
  const serviceType = params.serviceType;
  const city = params.city;
  const featured = params.featured === 'true';

  // Fetch search results
  const { items, total, totalPages } = await searchItems({
    q: query,
    serviceType,
    city,
    featured,
    page,
  });

  // Fetch service types for filter
  const serviceTypes = await getServiceTypes();

  // Build search query string for pagination
  const searchQuery = new URLSearchParams();
  if (query) searchQuery.set('q', query);
  if (serviceType) searchQuery.set('serviceType', serviceType);
  if (city) searchQuery.set('city', city);
  if (featured) searchQuery.set('featured', 'true');

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Search Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {query ? `نتائج البحث: "${query}"` : 'البحث'}
          </h1>
          <p className={styles.resultCount}>{total} نتيجة</p>
        </header>

        <div className={styles.content}>
          {/* Filters Sidebar */}
          <aside className={styles.filtersSidebar}>
            <form className={styles.filtersForm} method="GET">
              {/* Search Input */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>البحث</label>
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="ابحث..."
                  className={styles.filterInput}
                />
              </div>

              {/* Service Type Filter */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>نوع الخدمة</label>
                <select
                  name="serviceType"
                  defaultValue={serviceType || ''}
                  className={styles.filterSelect}
                >
                  <option value="">الكل</option>
                  {serviceTypes.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.icon} {type.label.ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter - Basic */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>المدينة</label>
                <select
                  name="city"
                  defaultValue={city || ''}
                  className={styles.filterSelect}
                >
                  <option value="">الكل</option>
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة">مكة المكرمة</option>
                  <option value="المدينة">المدينة المنورة</option>
                </select>
              </div>

              {/* Featured Only */}
              <div className={styles.filterGroup}>
                <label className={styles.filterCheckboxLabel}>
                  <input
                    type="checkbox"
                    name="featured"
                    value="true"
                    defaultChecked={featured}
                    className={styles.filterCheckbox}
                  />
                  العروض المميزة فقط
                </label>
              </div>

              <button type="submit" className={styles.filterButton}>
                بحث
              </button>

              {(query || serviceType || city || featured) && (
                <Link href="/services/search" className={styles.clearFilters}>
                  مسح الفلاتر
                </Link>
              )}
            </form>
          </aside>

          {/* Results */}
          <main className={styles.results}>
            <Suspense fallback={<LoadingSkeleton />}>
              {items.length > 0 ? (
                <>
                  <div className={styles.grid}>
                    {items.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>

                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    searchQuery={searchQuery.toString()}
                  />
                </>
              ) : (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>🔍</span>
                  <h3 className={styles.emptyTitle}>لا توجد نتائج</h3>
                  <p className={styles.emptyDescription}>
                    {query
                      ? `لم نجد نتائج لـ "${query}"`
                      : 'جرب تعديل الفلاتر للحصول على نتائج'}
                  </p>
                  <Link href="/services" className={styles.emptyLink}>
                    تصفح جميع الخدمات
                  </Link>
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q;

  return {
    title: query ? `نتائج البحث: ${query} - لقطة` : 'البحث - لقطة',
    description: 'ابحث عن أفضل الخدمات في المملكة العربية السعودية',
  };
}
