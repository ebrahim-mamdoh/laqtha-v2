"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // { name, email, profileComplete, onboarding, etc. }
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false); // للتحقق من الجلسة من الـ backend لاحقًا

  // ✅ تحميل بيانات المستخدم من localStorage عند فتح التطبيق
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("laqtaha_token");
      const storedUser = localStorage.getItem("laqtaha_user");
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ دالة لتسجيل الدخول أو التسجيل
  function setAuth({ token: newToken, user: newUser, isRegister = false }) {
    setToken(newToken);

    // لو مستخدم جديد نضيف له خاصية profileComplete
    const preparedUser = isRegister
      ? { ...newUser, profileComplete: false }
      : newUser;

    setUser(preparedUser);
    localStorage.setItem("laqtaha_token", newToken);
    localStorage.setItem("laqtaha_user", JSON.stringify(preparedUser));
    
    // ✅ حفظ في الكوكيز للـ middleware
    document.cookie = `laqtaha_token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    document.cookie = `laqtaha_user=${encodeURIComponent(JSON.stringify(preparedUser))}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }

  // ✅ تحديث بيانات المستخدم في أي وقت (مثلاً بعد تعديل الاسم أو الصورة)
  function updateUser(updates) {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("laqtaha_user", JSON.stringify(updated));
      return updated;
    });
  }

  // ✅ إكمال الـ Onboarding
  function completeOnboarding(onboardData) {
    const updated = {
      ...(user || {}),
      profileComplete: true,
      onboarding: onboardData,
    };
    setUser(updated);
    localStorage.setItem("laqtaha_user", JSON.stringify(updated));
  }

  // ✅ تسجيل الخروج
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("laqtaha_token");
    localStorage.removeItem("laqtaha_user");
    
    // ✅ حذف الكوكيز
    document.cookie = "laqtaha_token=; path=/; max-age=0";
    document.cookie = "laqtaha_user=; path=/; max-age=0";
  }

  // ✅ تحقق اختياري من الجلسة مع الباك إند (يمكن ربطه لاحقًا بـ axios أو React Query)
  async function verifySession() {
    if (!token) return;
    try {
      setIsVerifying(true);
      // 🔹 مستقبلاً: استدعاء API للتحقق من صلاحية الجلسة
      // const res = await axios.get("/api/verify", { headers: { Authorization: `Bearer ${token}` } });
      // if (!res.data.valid) logout();
    } catch (err) {
      logout();
    } finally {
      setIsVerifying(false);
    }
  }

  useEffect(() => {
    if (token) verifySession();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isVerifying,
        setAuth,
        updateUser,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
