"use client";

import { useSettings } from "./useSettings";
import SystemSettingsSection from "./_components/SystemSettingsSection.client";
import WalletSettingsSection from "./_components/WalletSettingsSection.client";
import FlagsSection from "./_components/FlagsSection.client";
import SecuritySection from "./_components/SecuritySection.client";
import WebhooksSection from "./_components/WebhooksSection.client";
import styles from "./settings.module.css";

export default function SettingsClient() {
    const { data, isLoading, isError } = useSettings();

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل الإعدادات...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ في تحميل الإعدادات.</div>;
    }

    return (
        <div className={styles.columnsGrid}>
            {/* ── RIGHT COLUMN (إعدادات النظام، إعدادات المحفظة) ── */}
            <div>
                <SystemSettingsSection data={data.system} />
                <WalletSettingsSection data={data.wallet} />
            </div>

            {/* ── LEFT COLUMN (فاصل التحارير، الجلسة، Webhooks) ── */}
            <div>
                <FlagsSection data={data.flags} />
                <SecuritySection data={data.session} />
                <WebhooksSection data={data.webhooks} />
            </div>
        </div>
    );
}
