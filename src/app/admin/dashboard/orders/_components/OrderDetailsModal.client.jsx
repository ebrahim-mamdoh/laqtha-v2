import { Modal, Spinner } from "react-bootstrap";
import { useBookingDetails } from "../useOrders";
import styles from "../orders.module.css";

export default function OrderDetailsModal({ show, onHide, bookingId }) {
    const { data: booking, isLoading, isError } = useBookingDetails(bookingId);

    return (
        <Modal show={show} onHide={onHide} centered size="lg" dir="rtl">
            <Modal.Header 
                closeButton 
                style={{ 
                    background: "var(--admin-card)", 
                    borderBottom: "1px solid var(--admin-border)",
                    color: "var(--admin-text)" 
                }}
            >
                <Modal.Title style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                    تفاصيل الحجز
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: "var(--admin-surface)", color: "var(--admin-text)", padding: "24px" }}>
                {isLoading ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <Spinner animation="border" style={{ color: "var(--admin-primary)" }} />
                        <div style={{ marginTop: "12px", color: "var(--admin-muted)" }}>جاري تحميل التفاصيل...</div>
                    </div>
                ) : isError ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--admin-danger)" }}>
                        حدث خطأ أثناء تحميل بيانات الحجز
                    </div>
                ) : !booking ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--admin-muted)" }}>
                        لم يتم العثور على الحجز
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {/* Summary / Status row */}
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            background: "var(--admin-card)",
                            padding: "16px",
                            borderRadius: "var(--admin-radius)",
                            border: "1px solid var(--admin-border)",
                            boxShadow: "var(--admin-shadow-sm)"
                        }}>
                            <div>
                                <div style={{ fontSize: "0.8rem", color: "var(--admin-muted)" }}>رقم الطلب</div>
                                <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--admin-primary)", letterSpacing: "1px", marginTop: "4px" }}>{booking.bookingNumber}</div>
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontSize: "0.8rem", color: "var(--admin-muted)" }}>الحالة</div>
                                <div style={{ 
                                    display: "inline-block", 
                                    padding: "6px 14px", 
                                    borderRadius: "var(--admin-radius-pill)", 
                                    fontSize: "0.85rem", 
                                    fontWeight: "700",
                                    marginTop: "4px",
                                    background: booking.state === 'completed' ? 'var(--admin-success-soft)' : 
                                                booking.state === 'cancelled' ? 'var(--admin-danger-soft)' : 
                                                booking.state === 'in-progress' ? 'var(--admin-warning-soft)' : 'var(--admin-info-soft)',
                                    color: booking.state === 'completed' ? 'var(--admin-success)' : 
                                           booking.state === 'cancelled' ? 'var(--admin-danger)' : 
                                           booking.state === 'in-progress' ? 'var(--admin-warning)' : 'var(--admin-info)'
                                }}>
                                    {booking.stateLabel}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {/* Service Details */}
                            <div style={{ background: "var(--admin-card)", padding: "16px", borderRadius: "10px", border: "1px solid var(--admin-border)" }}>
                                <h4 style={{ fontSize: "0.9rem", color: "var(--admin-text)", marginBottom: "12px", borderBottom: "1px solid var(--admin-border)", paddingBottom: "8px" }}>
                                    تفاصيل الخدمة 🛠️
                                </h4>
                                <div style={{ marginBottom: "8px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--admin-muted)", display: "block" }}>الخدمة المطلوبة:</span>
                                    <strong style={{ fontSize: "0.9rem" }}>{booking.service.nameAr}</strong>
                                </div>
                                <div style={{ marginBottom: "8px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--admin-muted)", display: "block" }}>التاريخ المجدول:</span>
                                    <strong style={{ fontSize: "0.9rem" }}>{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString('ar-EG') : 'غير محدد'}</strong>
                                </div>
                                <div>
                                    <span style={{ fontSize: "0.8rem", color: "var(--admin-muted)", display: "block" }}>الوقت المجدول:</span>
                                    <strong style={{ fontSize: "0.9rem", direction: "ltr", display: "inline-block" }}>{booking.scheduledTime || 'غير محدد'}</strong>
                                </div>
                            </div>

                            {/* Partner & Customer */}
                            <div style={{ background: "var(--admin-card)", padding: "16px", borderRadius: "10px", border: "1px solid var(--admin-border)" }}>
                                <h4 style={{ fontSize: "0.9rem", color: "var(--admin-text)", marginBottom: "12px", borderBottom: "1px solid var(--admin-border)", paddingBottom: "8px" }}>
                                    الجهات المشاركة 👥
                                </h4>
                                <div style={{ marginBottom: "12px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--admin-muted)", display: "block" }}>الشريك:</span>
                                    <strong style={{ fontSize: "0.9rem", color: "var(--admin-primary)" }}>{booking.partner.businessName}</strong>
                                    <div style={{ fontSize: "0.75rem", color: "var(--admin-text-secondary)" }}>{booking.partner.contactName}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: "0.8rem", color: "var(--admin-muted)", display: "block" }}>العميل:</span>
                                    <strong style={{ fontSize: "0.9rem" }}>{booking.customer ? booking.customer.name : 'بدون عميل'}</strong>
                                    {booking.customer?.email && <div style={{ fontSize: "0.75rem", color: "var(--admin-text-secondary)" }}>{booking.customer.email}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Extra info */}
                        {(booking.cancelReason || booking.internalNotes) && (
                            <div style={{ background: "var(--admin-card)", padding: "16px", borderRadius: "10px", border: "1px solid var(--admin-border)" }}>
                                {booking.cancelReason && (
                                    <div style={{ marginBottom: "12px" }}>
                                        <span style={{ fontSize: "0.8rem", color: "var(--admin-muted)", display: "block" }}>سبب الإلغاء:</span>
                                        <div style={{ color: "var(--admin-danger)", fontSize: "0.85rem", marginTop: "4px" }}>{booking.cancelReason}</div>
                                    </div>
                                )}
                                {booking.internalNotes && (
                                    <div>
                                        <span style={{ fontSize: "0.8rem", color: "var(--admin-muted)", display: "block" }}>ملاحظات داخلية:</span>
                                        <div style={{ color: "var(--admin-text)", fontSize: "0.85rem", marginTop: "4px" }}>{booking.internalNotes}</div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div style={{ fontSize: "0.75rem", color: "var(--admin-muted)", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
                            <span>وضع الحجز: <strong>{booking.bookingModeLabel}</strong></span>
                            <span>تاريخ الإنشاء: <span style={{ direction: "ltr", display: "inline-block" }}>{new Date(booking.createdAt).toLocaleString('ar-EG')}</span></span>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}
