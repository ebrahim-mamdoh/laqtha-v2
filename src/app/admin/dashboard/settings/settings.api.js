import { apiClient } from "@/lib/api";

const MOCK_SETTINGS = {
    system: {
        name: "لقطها",
        email: "admin@laqtha.com",
        phone: "920004124",
        country: "ريال سعودي (SAR)",
    },
    wallet: {
        stripeKey: "sk_live_••••••••••••••••••••••••",
        stripePublicKey: "pk_live_••••••••••••••••••••••••",
        minPayout: 15,
        payoutWindowDays: "14",
        description: "حصة من العقود يتلقى نظام الدفع المتكامل المالكة 5%...",
        withdrawalDescription: "دعم طريقة شاملة للنظام المالكة المتكاملة بنسبة 5%...",
    },
    flags: {
        maintenanceMode: false,
        featuredListings: true,
        liveChat: true,
        mfApiId: "MF-#####133-0231",
        mfapiUrl1: "192.168.1.1",
        mfapiUrl2: "192.168.1.1",
    },
    session: {
        currentLogin: "وكيل الكليل",
        callbackUrl: "https://dashboard.laqtha.com/callback",
        ttl: "100,000",
        webhook: "أعد تشغيل الجلسة بدون قائل ⚡",
    },
    webhooks: {
        webhook1: "عنوان الوصول في الوقت الأسلوب الذي RRR للأحداث...",
        webhook2: "شبك الاتصال على إرسال إشعار لكل حدث ERC0935...",
    },
};

export async function fetchSettings() {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_SETTINGS;
}

export async function saveSystemSettings(payload) {
    await new Promise((res) => setTimeout(res, 600));
    return { success: true };
}

export async function saveWalletSettings(payload) {
    await new Promise((res) => setTimeout(res, 600));
    return { success: true };
}
