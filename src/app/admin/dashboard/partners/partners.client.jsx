"use client";

import { useState } from "react";
import { usePartners, useApprovePartner, useRejectPartner } from "./usePartners";
import PartnersFilters from "./_components/PartnersFilters.client";
import PartnersTable from "./_components/PartnersTable.server";
import styles from "./partners.module.css";

export default function PartnersClient() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        search: "",
        sector: "",
        status: "",
    });

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: null,
        partnerId: null,
    });
    const [rejectReason, setRejectReason] = useState("");

    const { data, isLoading, isError } = usePartners({
        page,
        limit: 20,
        state: "pending_approval"
    });

    const approveMutation = useApprovePartner();
    const rejectMutation = useRejectPartner();

    const openModal = (type, partnerId) => {
        setModalConfig({ isOpen: true, type, partnerId });
        setRejectReason("");
    };

    const closeModal = () => {
        if (approveMutation.isPending || rejectMutation.isPending) return;
        setModalConfig({ isOpen: false, type: null, partnerId: null });
        setRejectReason("");
    };

    const handleConfirm = () => {
        if (modalConfig.type === "approve") {
            approveMutation.mutate(modalConfig.partnerId, {
                onSuccess: closeModal
            });
        } else if (modalConfig.type === "reject") {
            rejectMutation.mutate({ partnerId: modalConfig.partnerId, reason: rejectReason }, {
                onSuccess: closeModal
            });
        }
    };

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل البيانات...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ في تحميل بيانات الشركاء</div>;
    }

    const partners = data?.partners || [];
    const isPendingAct = approveMutation.isPending || rejectMutation.isPending;

    return (
        <div>
            <PartnersFilters filters={filters} setFilters={setFilters} />
            <PartnersTable 
                partners={partners} 
                onApprove={(id) => openModal("approve", id)}
                onReject={(id) => openModal("reject", id)}
                isApproving={approveMutation.isPending}
                isRejecting={rejectMutation.isPending}
            />

            {modalConfig.isOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalTitle}>
                            {modalConfig.type === "reject" ? "تحذير" : "تأكيد"}
                        </div>
                        <div className={styles.modalText}>
                            {modalConfig.type === "reject" 
                                ? "عملية الرفض هي قرار لا يمكن التراجع عنه. ان قمت برفض الطلب فلن تتمكن من التراجع عن هذا القرار"
                                : "هل أنت متأكد من رغبتك في قبول طلب هذا الشريك؟"
                            }
                        </div>

                        {modalConfig.type === "reject" && (
                            <textarea 
                                className={styles.modalInput}
                                placeholder="اكتب سبب الرفض هنا..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                        )}

                        <div className={styles.modalActions}>
                            <button 
                                className={styles.modalBtnCancel} 
                                onClick={closeModal}
                                disabled={isPendingAct}
                            >
                                إلغاء
                            </button>
                            <button 
                                className={`${styles.modalBtnConfirm} ${modalConfig.type === "approve" ? styles.approve : ""}`} 
                                onClick={handleConfirm}
                                disabled={isPendingAct || (modalConfig.type === "reject" && !rejectReason.trim())}
                            >
                                {isPendingAct ? "جاري..." : modalConfig.type === "reject" ? "رفض" : "قبول"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
