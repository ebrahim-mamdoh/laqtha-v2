import { Modal, Spinner } from "react-bootstrap";
import { useState } from "react";
import styles from "../orders.module.css";
import notify from "@/lib/notify";
import { useCancelBooking } from "../useOrders";

export default function CancelOrderModal({ show, onHide, orderId, onSuccess }) {
    const [reason, setReason] = useState("");
    const cancelMutation = useCancelBooking();

    const handleConfirm = () => {
        if (!reason.trim()) {
            notify.error("يرجى إدخال سبب الإلغاء");
            return;
        }

        cancelMutation.mutate({ id: orderId, reason }, {
            onSuccess: () => {
                notify.success("تم إلغاء الحجز بنجاح");
                setReason("");
                onSuccess?.();
            },
            onError: (error) => {
                notify.error(error?.response?.data?.message?.ar || "حدث خطأ أثناء إلغاء الحجز");
            }
        });
    };

    const handleHide = () => {
        setReason("");
        onHide();
    };

    return (
        <Modal show={show} onHide={handleHide} centered dir="rtl">
            <Modal.Header 
                closeButton 
                style={{ 
                    background: "var(--admin-card)", 
                    borderBottom: "1px solid var(--admin-border)",
                    color: "var(--admin-danger)" 
                }}
            >
                <Modal.Title style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                    إلغاء حجز ⚠️
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: "var(--admin-surface)", color: "var(--admin-text)", padding: "20px" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--admin-muted)", marginBottom: "16px" }}>
                    هل أنت متأكد أنك تريد إلغاء هذا الحجز؟ هذا الإجراء لا يمكن التراجع عنه. يرجى إدخال سبب الإلغاء للإدارة.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--admin-text)" }}>
                        سبب الإلغاء <span style={{ color: "var(--admin-danger)" }}>*</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="مثال: تم الإلغاء بواسطة المسؤول بسبب..."
                        rows={4}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "var(--admin-radius-sm)",
                            border: "1px solid var(--admin-border)",
                            background: "var(--admin-card)",
                            color: "var(--admin-text)",
                            fontFamily: "inherit",
                            fontSize: "0.85rem",
                            resize: "none",
                            outline: "none",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "var(--admin-danger)"}
                        onBlur={(e) => e.target.style.borderColor = "var(--admin-border)"}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer style={{ background: "var(--admin-card)", borderTop: "1px solid var(--admin-border)", display: "flex", gap: "10px" }}>
                <button 
                    onClick={handleHide}
                    style={{
                        padding: "8px 16px",
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: "var(--admin-radius-sm)",
                        color: "var(--admin-text)",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.8rem"
                    }}
                    disabled={cancelMutation.isPending}
                >
                    تراجع
                </button>
                <button 
                    onClick={handleConfirm}
                    disabled={cancelMutation.isPending || !reason.trim()}
                    style={{
                        padding: "8px 16px",
                        background: "var(--admin-danger)",
                        border: "none",
                        borderRadius: "var(--admin-radius-sm)",
                        color: "#fff",
                        cursor: (cancelMutation.isPending || !reason.trim()) ? "not-allowed" : "pointer",
                        opacity: (cancelMutation.isPending || !reason.trim()) ? 0.6 : 1,
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    {cancelMutation.isPending ? (
                        <>
                            <Spinner animation="border" size="sm" />
                            جاري الإلغاء...
                        </>
                    ) : (
                        "تأكيد وإلغاء الطلب"
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
}
