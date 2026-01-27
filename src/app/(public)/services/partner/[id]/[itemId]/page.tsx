// ============================================================================
// Public Service Item Details Page
// Full item details with partner info and booking placeholder
// ============================================================================

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
  isFeatured?: boolean;
  displayOrder?: number;
}

interface PageProps {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getItemDetails(
  partnerId: string,
  itemId: string
): Promise<{ item: ServiceItem | null; partner: PartnerInfo | null }> {
  try {
    const response = await servicesApi.getItemDetails(partnerId, itemId);
    return {
      item: response.item,
      partner: response.partner,
    };
  } catch (error) {
    console.error('Failed to fetch item details:', error);
    return { item: null, partner: null };
  }
}

async function getServiceTypeInfo(key: string): Promise<{
  label: string;
  itemLabel: string;
}> {
  try {
    const response = await servicesApi.getServiceType(key);
    return {
      label: response.serviceType?.label?.ar || key,
      itemLabel: response.serviceType?.itemLabel?.ar || 'عنصر',
    };
  } catch {
    return { label: key, itemLabel: 'عنصر' };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatValue(value: unknown, key: string): string {
  if (value === null || value === undefined) return '-';
  
  if (typeof value === 'boolean') {
    return value ? 'نعم' : 'لا';
  }
  
  if (typeof value === 'number') {
    // Check if it's a price field
    if (key.includes('price') || key.includes('rate') || key.includes('cost')) {
      return `${value.toLocaleString('ar-SA')} ر.س`;
    }
    return value.toLocaleString('ar-SA');
  }
  
  if (Array.isArray(value)) {
    return value.join('، ');
  }
  
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // Handle price object
    if ('amount' in obj) {
      return `${Number(obj.amount).toLocaleString('ar-SA')} ر.س`;
    }
    return JSON.stringify(value);
  }
  
  return String(value);
}

function getMainPrice(data: Record<string, unknown>): { amount: number; label: string } | null {
  // Common price field names
  const priceFields = [
    { key: 'price_per_night', label: 'السعر / ليلة' },
    { key: 'daily_rate', label: 'السعر / يوم' },
    { key: 'price', label: 'السعر' },
    { key: 'hourly_rate', label: 'السعر / ساعة' },
    { key: 'rate', label: 'السعر' },
  ];

  for (const field of priceFields) {
    const value = data[field.key];
    if (typeof value === 'number') {
      return { amount: value, label: field.label };
    }
    if (typeof value === 'object' && value !== null) {
      const obj = value as { amount?: number };
      if (obj.amount) {
        return { amount: obj.amount, label: field.label };
      }
    }
  }

  return null;
}

// Label mapping for common field keys
const fieldLabels: Record<string, string> = {
  room_type: 'نوع الغرفة',
  capacity: 'السعة',
  area: 'المساحة',
  size: 'الحجم',
  bed_config: 'تكوين الأسرّة',
  amenities: 'المرافق',
  features: 'الميزات',
  facilities: 'التسهيلات',
  view: 'الإطلالة',
  floor: 'الطابق',
  max_guests: 'الحد الأقصى للضيوف',
  min_stay: 'الحد الأدنى للإقامة',
  check_in: 'وقت تسجيل الدخول',
  check_out: 'وقت تسجيل الخروج',
  cancellation_policy: 'سياسة الإلغاء',
  // Car rental fields
  brand: 'الماركة',
  model: 'الموديل',
  year: 'سنة الصنع',
  color: 'اللون',
  seats: 'عدد المقاعد',
  transmission: 'ناقل الحركة',
  fuel_type: 'نوع الوقود',
  mileage_limit: 'حد الكيلومترات',
  // Restaurant fields
  cuisine: 'نوع المطبخ',
  seating_capacity: 'سعة الجلوس',
  min_order: 'الحد الأدنى للطلب',
  delivery: 'توصيل',
  reservation_required: 'الحجز مطلوب',
};

function getFieldLabel(key: string): string {
  return fieldLabels[key] || key.replace(/_/g, ' ');
}

// Fields to exclude from display
const excludedFields = [
  'price', 'price_per_night', 'daily_rate', 'hourly_rate', 'rate',
  'images', 'gallery', 'image', 'photo', 'photos',
];

// ============================================================================
// Page Component
// ============================================================================

export default async function ItemDetailsPage({ params }: PageProps) {
  const { id: partnerId, itemId } = await params;

  // Fetch item details
  const { item, partner } = await getItemDetails(partnerId, itemId);

  if (!item || !partner) {
    notFound();
  }

  // Get service type info
  const { label: serviceTypeLabel, itemLabel } = await getServiceTypeInfo(
    partner.serviceTypeKey
  );

  // Get main price
  const mainPrice = getMainPrice(item.data);

  // Get display fields (excluding price and image fields)
  const displayFields = Object.entries(item.data)
    .filter(([key]) => !excludedFields.some(excluded => key.includes(excluded)))
    .slice(0, 10); // Limit to 10 fields

  // Extract amenities/features if available
  const amenities = item.data.amenities || item.data.features || item.data.facilities;
  const amenitiesArray = Array.isArray(amenities) ? amenities.slice(0, 12) : [];

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
          <Link
            href={`/services/partner/${partnerId}`}
            className={styles.breadcrumbLink}
          >
            {partner.businessName}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{item.name.ar}</span>
        </nav>

        <div className={styles.content}>
          {/* Main Content */}
          <div className={styles.mainColumn}>
            {/* Image Gallery Placeholder */}
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <span className={styles.imageIcon}>🖼️</span>
                <span className={styles.imageText}>صورة {itemLabel}</span>
              </div>
              <div className={styles.thumbnails}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={styles.thumbnail}>
                    <span className={styles.thumbnailIcon}>🖼️</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Item Info */}
            <div className={styles.infoSection}>
              <div className={styles.headerRow}>
                <div>
                  {item.isFeatured && (
                    <span className={styles.featuredBadge}>⭐ مميز</span>
                  )}
                  <h1 className={styles.title}>{item.name.ar}</h1>
                  {item.name.en && (
                    <p className={styles.titleEn}>{item.name.en}</p>
                  )}
                </div>
              </div>

              {/* Partner Link */}
              <Link href={`/services/${partnerId}`} className={styles.partnerLink}>
                <span className={styles.partnerIcon}>🏢</span>
                <div>
                  <span className={styles.partnerName}>{partner.businessName}</span>
                  <span className={styles.partnerLocation}>
                    📍 {partner.city}
                  </span>
                </div>
              </Link>

              {/* Description */}
              {item.description?.ar && (
                <div className={styles.description}>
                  <h2 className={styles.sectionTitle}>الوصف</h2>
                  <p>{item.description.ar}</p>
                  {item.description.en && (
                    <p className={styles.descriptionEn}>{item.description.en}</p>
                  )}
                </div>
              )}

              {/* Details Table */}
              {displayFields.length > 0 && (
                <div className={styles.details}>
                  <h2 className={styles.sectionTitle}>التفاصيل</h2>
                  <div className={styles.detailsGrid}>
                    {displayFields.map(([key, value]) => (
                      <div key={key} className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {getFieldLabel(key)}
                        </span>
                        <span className={styles.detailValue}>
                          {formatValue(value, key)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {amenitiesArray.length > 0 && (
                <div className={styles.amenities}>
                  <h2 className={styles.sectionTitle}>المرافق والميزات</h2>
                  <div className={styles.amenitiesGrid}>
                    {amenitiesArray.map((amenity, index) => (
                      <div key={index} className={styles.amenityItem}>
                        <span className={styles.amenityIcon}>✓</span>
                        <span>{String(amenity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <aside className={styles.sidebar}>
            <div className={styles.bookingCard}>
              <div className={styles.priceSection}>
                {mainPrice ? (
                  <>
                    <span className={styles.price}>
                      {mainPrice.amount.toLocaleString('ar-SA')}
                      <span className={styles.currency}> ر.س</span>
                    </span>
                    <span className={styles.priceLabel}>{mainPrice.label}</span>
                  </>
                ) : (
                  <span className={styles.priceContact}>اتصل للسعر</span>
                )}
              </div>

              <div className={styles.bookingActions}>
                {/* Booking functionality is out of scope */}
                <button className={styles.bookButton} disabled>
                  <span className={styles.bookButtonIcon}>🔒</span>
                  الحجز غير متاح حالياً
                </button>
                <p className={styles.comingSoon}>
                  خدمة الحجز قادمة قريباً
                </p>
              </div>

              <div className={styles.contactSection}>
                <h3 className={styles.contactTitle}>للاستفسار</h3>
                <p className={styles.contactText}>
                  تواصل مع {partner.businessName} مباشرة للحصول على مزيد من المعلومات
                </p>
                <Link
                  href={`/services/${partnerId}`}
                  className={styles.contactLink}
                >
                  زيارة صفحة المنشأة
                </Link>
              </div>
            </div>

            {/* Share & Actions */}
            <div className={styles.actionsCard}>
              <button className={styles.actionButton} disabled>
                <span>❤️</span>
                إضافة للمفضلة
              </button>
              <button className={styles.actionButton} disabled>
                <span>📤</span>
                مشاركة
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Generate Metadata
// ============================================================================

export async function generateMetadata({ params }: PageProps) {
  const { id: partnerId, itemId } = await params;
  const { item, partner } = await getItemDetails(partnerId, itemId);

  if (!item || !partner) {
    return {
      title: 'غير موجود - لقطة',
    };
  }

  return {
    title: `${item.name.ar} - ${partner.businessName} - لقطة`,
    description: item.description?.ar || `${item.name.ar} من ${partner.businessName}`,
  };
}
