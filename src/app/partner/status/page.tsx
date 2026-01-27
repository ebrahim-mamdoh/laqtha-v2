'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PartnerLayout } from '@/layouts';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import { StateBadge } from '@/components/ui/Badge/Badge';
import { useToast } from '@/components/ui/Toast/Toast';
import { PartnerState } from '@/types';
import styles from './page.module.css';

// ============================================================================
// Status Configuration
// ============================================================================

interface StatusConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  showEditProfile: boolean;
  showLogout: boolean;
  additionalInfo?: string;
}

const statusConfigs: Record<PartnerState, StatusConfig> = {
  pending_otp: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
    title: 'في انتظار التحقق',
    description: 'يرجى التحقق من بريدك الإلكتروني وإدخال رمز التحقق لإتمام التسجيل.',
    color: 'warning',
    showEditProfile: false,
    showLogout: true,
    additionalInfo: 'لم تستلم الرمز؟ يمكنك طلب إعادة الإرسال.',
  },
  pending_approval: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    ),
    title: 'قيد المراجعة',
    description: 'تم استلام طلبك بنجاح وهو قيد المراجعة من قبل فريقنا. سيتم إعلامك عند اتخاذ قرار.',
    color: 'info',
    showEditProfile: true,
    showLogout: true,
    additionalInfo: 'عادةً ما تستغرق المراجعة من 1-3 أيام عمل.',
  },
  changes_required: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    title: 'مطلوب تعديلات',
    description: 'تم مراجعة طلبك ويتطلب بعض التعديلات. يرجى مراجعة الملاحظات وتحديث ملفك الشخصي.',
    color: 'warning',
    showEditProfile: true,
    showLogout: true,
  },
  rejected: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
      </svg>
    ),
    title: 'تم الرفض',
    description: 'نأسف، تم رفض طلبك. يمكنك مراجعة السبب والتقدم مرة أخرى إذا رغبت.',
    color: 'danger',
    showEditProfile: false,
    showLogout: true,
  },
  approved: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: 'تم الموافقة',
    description: 'تهانينا! تمت الموافقة على طلبك. يمكنك الآن الوصول إلى لوحة التحكم الكاملة.',
    color: 'success',
    showEditProfile: false,
    showLogout: false,
  },
  suspended: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
      </svg>
    ),
    title: 'تم التعليق',
    description: 'تم تعليق حسابك. يرجى التواصل مع الدعم الفني للمزيد من المعلومات.',
    color: 'danger',
    showEditProfile: false,
    showLogout: true,
  },
};

// ============================================================================
// Timeline Component
// ============================================================================

interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
}

function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className={styles.timeline}>
      {events.map((event, index) => (
        <div
          key={index}
          className={`${styles.timelineItem} ${styles[event.status]}`}
        >
          <div className={styles.timelineDot}>
            {event.status === 'completed' && (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
          </div>
          {index < events.length - 1 && <div className={styles.timelineLine} />}
          <div className={styles.timelineContent}>
            <span className={styles.timelineDate}>{event.date}</span>
            <h4 className={styles.timelineTitle}>{event.title}</h4>
            {event.description && (
              <p className={styles.timelineDescription}>{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Admin Notes Component
// ============================================================================

interface AdminNotesProps {
  notes: string | undefined;
}

function AdminNotes({ notes }: AdminNotesProps) {
  if (!notes) return null;

  return (
    <Card variant="bordered" className={styles.notesCard}>
      <div className={styles.notesHeader}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
        <h3>ملاحظات المراجع</h3>
      </div>
      <div className={styles.notesContent}>
        {notes.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function PartnerStatusPage() {
  const router = useRouter();
  const { partner, partnerLogout, isPartnerLoading } = useAuth();
  const { showToast } = useToast();

  // Redirect approved partners to dashboard
  React.useEffect(() => {
    if (partner?.state === 'approved') {
      router.replace('/partner/dashboard');
    }
  }, [partner?.state, router]);

  // Handle logout
  const handleLogout = () => {
    partnerLogout();
    router.push('/partner/login');
    showToast({
      type: 'success',
      message: 'تم تسجيل الخروج بنجاح',
    });
  };

  // Loading state
  if (isPartnerLoading) {
    return (
      <PartnerLayout>
        <div className={styles.loadingContainer}>
          <Spinner size="lg" />
          <p>جاري التحميل...</p>
        </div>
      </PartnerLayout>
    );
  }

  // No partner
  if (!partner) {
    return (
      <div className={styles.errorContainer}>
        <p>يرجى تسجيل الدخول للوصول إلى هذه الصفحة</p>
        <Link href="/partner/login">
          <Button variant="primary">تسجيل الدخول</Button>
        </Link>
      </div>
    );
  }

  const config = statusConfigs[partner.state];

  // Generate timeline based on partner state
  const getTimeline = (): TimelineEvent[] => {
    const baseEvents: TimelineEvent[] = [
      {
        date: new Date(partner.createdAt).toLocaleDateString('ar-SA'),
        title: 'تم إنشاء الحساب',
        description: 'تم تسجيل طلب الشراكة',
        status: 'completed',
      },
      {
        date: '-',
        title: 'التحقق من البريد',
        description: partner.state === 'pending_otp' ? 'في انتظار التحقق' : 'تم التحقق',
        status: partner.state === 'pending_otp' ? 'current' : 'completed',
      },
    ];

    if (partner.state === 'pending_otp') {
      return baseEvents;
    }

    // Add approval step
    baseEvents.push({
      date: '-',
      title: 'مراجعة الطلب',
      description: 
        partner.state === 'pending_approval' ? 'جاري المراجعة' :
        partner.state === 'changes_required' ? 'مطلوب تعديلات' :
        partner.state === 'rejected' ? 'تم الرفض' :
        partner.state === 'approved' ? 'تمت الموافقة' :
        'تم التعليق',
      status: 
        partner.state === 'pending_approval' ? 'current' :
        partner.state === 'approved' ? 'completed' : 'current',
    });

    if (partner.state === 'approved') {
      baseEvents.push({
        date: partner.approvedAt ? new Date(partner.approvedAt).toLocaleDateString('ar-SA') : '-',
        title: 'بدء النشاط',
        description: 'يمكنك الآن إضافة عناصر الخدمة',
        status: 'completed',
      });
    }

    return baseEvents;
  };

  return (
    <PartnerLayout>
      <div className={styles.statusPage}>
        <div className={styles.container}>
          {/* Status Card */}
          <Card variant="default" className={styles.statusCard}>
            <div className={`${styles.statusIcon} ${styles[config.color]}`}>
              {config.icon}
            </div>
            
            <div className={styles.statusContent}>
              <div className={styles.statusHeader}>
                <h1>{config.title}</h1>
                <StateBadge state={partner.state} type="partner" />
              </div>
              
              <p className={styles.statusDescription}>{config.description}</p>
              
              {config.additionalInfo && (
                <p className={styles.additionalInfo}>{config.additionalInfo}</p>
              )}
            </div>

            <div className={styles.statusActions}>
              {config.showEditProfile && (
                <Link href="/partner/profile">
                  <Button variant="primary" size="lg">
                    تعديل الملف الشخصي
                  </Button>
                </Link>
              )}
              {config.showLogout && (
                <Button variant="outline" size="lg" onClick={handleLogout}>
                  تسجيل الخروج
                </Button>
              )}
            </div>
          </Card>

          {/* Admin Notes (if changes_required or rejected) */}
          {(partner.state === 'changes_required' || partner.state === 'rejected') && (
            <AdminNotes notes={partner.adminNotes} />
          )}

          {/* Timeline */}
          <Card variant="bordered" className={styles.timelineCard}>
            <h2>مراحل الطلب</h2>
            <Timeline events={getTimeline()} />
          </Card>

          {/* Partner Info Summary */}
          <Card variant="bordered" className={styles.infoCard}>
            <h2>معلومات الحساب</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>اسم النشاط</span>
                <span className={styles.infoValue}>{partner.businessName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>البريد الإلكتروني</span>
                <span className={styles.infoValue} dir="ltr">{partner.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>رقم الهاتف</span>
                <span className={styles.infoValue} dir="ltr">{partner.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>نوع الخدمة</span>
                <span className={styles.infoValue}>
                  {typeof partner.serviceTypeId === 'object' 
                    ? partner.serviceTypeId.name 
                    : 'غير محدد'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>تاريخ التسجيل</span>
                <span className={styles.infoValue}>
                  {new Date(partner.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </Card>

          {/* Help Section */}
          <Card variant="flat" className={styles.helpCard}>
            <h3>هل تحتاج مساعدة؟</h3>
            <p>إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.</p>
            <div className={styles.helpLinks}>
              <a href="mailto:support@example.com">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                support@example.com
              </a>
              <a href="tel:+966500000000">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                +966 50 000 0000
              </a>
            </div>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}
