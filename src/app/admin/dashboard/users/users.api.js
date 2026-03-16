import apiClient from "@/lib/api";

const mapUser = (user) => ({
    id: user._id,
    name: user.name || "مستخدم غير محدد",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "customer",
    walletBalance: user.walletBalance || 0,
    status: user.isAccountVerified ? "active" : "pending",
    createdAt: user.createdAt,
    lastActive: user.lastActiveAt,
    friendsCount: user.friends?.length || 0,
    isGoogleUser: Boolean(user.isGoogleUser)
});

export async function fetchUsers({ page = 1, limit = 20, role = "customer" } = {}) {
    // If the role selected is 'partner_driver', we might fetch both or just default to partner. 
    // We will just pass the role directly.
    const { data } = await apiClient.get("/user/all-users", {
        params: { page, limit, role }
    });

    return {
        users: data.data.users.map(mapUser),
        pagination: data.data.pagination
    };
}
