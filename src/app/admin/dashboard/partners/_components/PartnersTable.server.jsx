"use client";

// PartnersTable.server.jsx
// Converted to Client Component to support interactive actions (Approve/Reject).

import { useState } from "react";
import styles from "../partners.module.css";

function getPillStyle(colorVar) {
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": "transparent",
        "--pill-bg": `color-mix(in srgb, ${colorVar} 15%, transparent)`,
    };
}

function getStatusPillColor(state) {
    switch (state) {
        case 'approved': return "var(--admin-success)";
        case 'pending_approval': return "var(--admin-warning)";
        case 'pending_otp': return "var(--admin-text-muted, gray)";
        default: return "var(--admin-primary)";
    }
}

function getStatusText(p) {
    switch (p.state) {
        case 'pending_approval': return "في انتظار الموافقة";
        case 'approved': return "تمت الموافقة";
        case 'pending_otp': return "في انتظار التحقق";
        default: return p.status;
    }
}

export default function PartnersTable({ partners, onApprove, onReject, isApproving, isRejecting }) {
    const [selectedPartner, setSelectedPartner] = useState(null);

    if (!partners || partners.length === 0) {
        return (
            <div className={styles.tableCard}>
                <div className={styles.centerContainer}>لا يوجد شركاء يطابقون بحثك.</div>
            </div>
        );
    }

    return (
        <div className={styles.tableCard}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>إدارة الشركاء 🤝</div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table} dir="rtl">
                    <thead>
                        <tr>
                            <th>الشريك</th>
                            <th>القطاع</th>
                            <th>المدينة</th>
                            <th>جهة الاتصال</th>
                            <th>الحالة</th>
                            <th>تاريخ التسجيل</th>
                            <th style={{ textAlign: 'center' }}>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <div className={styles.partnerNameWrap}>
                                        <div
                                            className={styles.partnerIcon}
                                            style={{
                                                "--icon-color": "var(--admin-primary)",
                                                "--icon-bg": `color-mix(in srgb, var(--admin-primary) 15%, transparent)`,
                                            }}
                                        >
                                            🏢
                                        </div>
                                        {p.partnerName}
                                    </div>
                                </td>
                                <td>{p.serviceType}</td>
                                <td>{p.city}</td>
                                <td>{p.contactName}</td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(getStatusPillColor(p.state))}
                                    >
                                        {getStatusText(p)}
                                    </span>
                                </td>
                                <td>
                                    {p.createdDate ? new Date(p.createdDate).toLocaleDateString("ar-SA") : ""}
                                </td>
                                <td>
                                    <div className={styles.actions} style={{ justifyContent: 'center' }}>
                                        {p.state === 'pending_approval' && (
                                            <>
                                                <button
                                                    className={styles.actionBtn}
                                                    style={{ color: "var(--admin-success)", borderColor: "transparent", background: "color-mix(in srgb, var(--admin-success) 10%, transparent)", opacity: isApproving ? 0.5 : 1 }}
                                                    title="قبول"
                                                    onClick={() => onApprove(p.id)}
                                                    disabled={isApproving || isRejecting}
                                                >
                                                    ✅
                                                </button>
                                                <button
                                                    className={styles.actionBtn}
                                                    style={{ color: "var(--admin-danger)", borderColor: "transparent", background: "color-mix(in srgb, var(--admin-danger) 10%, transparent)", opacity: isRejecting ? 0.5 : 1 }}
                                                    title="رفض"
                                                    onClick={() => onReject(p.id)}
                                                    disabled={isApproving || isRejecting}
                                                >
                                                    ❌
                                                </button>
                                            </>
                                        )}
                                        {p.state === 'approved' && (
                                            <button
                                                className={styles.actionBtn}
                                                style={{ color: "var(--admin-primary)", borderColor: "transparent", background: "color-mix(in srgb, var(--admin-primary) 10%, transparent)" }}
                                                title="عرض الملف"
                                                onClick={() => setSelectedPartner(p)}
                                            >
                                                👤
                                            </button>
                                        )}
                                        {p.state === 'pending_otp' && (
                                            <span style={{ fontSize: '0.85rem', color: "gray" }}>-</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Profile Modal */}
            {selectedPartner && (
                <div className={styles.modalOverlay} onClick={() => setSelectedPartner(null)}>
                    <div className={styles.modalContent} style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()} dir="rtl">
                        <div className={styles.modalTitle} style={{ marginBottom: "1rem", borderBottom: "1px solid var(--admin-border)", paddingBottom: "0.5rem" }}>
                            ملف الشريك: {selectedPartner.businessName}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
                            <div><strong>اسم النشاط:</strong> {selectedPartner.businessName}</div>
                            <div><strong>جهة الاتصال:</strong> {selectedPartner.contactFullName}</div>
                            <div><strong>البريد الإلكتروني:</strong> {selectedPartner.email || "غير متوفر"}</div>
                            <div><strong>رقم الهاتف:</strong> {selectedPartner.phone || "غير متوفر"}</div>
                            <div><strong>العنوان:</strong> {selectedPartner.fullAddress || selectedPartner.city || "غير متوفر"}</div>
                            <div><strong>الوصف:</strong> {selectedPartner.description || "لا يوجد وصف."}</div>
                        </div>
                        <div className={styles.modalActions} style={{ marginTop: "1.5rem" }}>
                            <button 
                                className={styles.modalBtnCancel} 
                                onClick={() => setSelectedPartner(null)}
                                style={{ margin: "0 auto", padding: "0.5rem 2rem" }}
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
