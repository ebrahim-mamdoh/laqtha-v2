"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./login.module.css";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("بريد إلكتروني غير صالح").required("مطلوب"),
      password: Yup.string().min(6, "على الأقل 6 أحرف").required("مطلوب"),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("🔹 API URL:", apiUrl);
      
      try {
        const res = await fetch(`${apiUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        console.log("🔹 Login Response:", data);

        // ❌ في حالة فشل الطلب أو رسالة خطأ من السيرفر
        if (!res.ok || !data.success) {
          throw new Error(data?.message?.ar || "فشل تسجيل الدخول، تحقق من البيانات");
        }

        // ✅ استخراج البيانات المطلوبة من الاستجابة
        const { user, accessToken, refreshToken, timezone, currency } = data.data;

        // ✅ تخزين التوكن وبيانات المستخدم داخل الـ AuthContext بدلاً من localStorage
        if (auth && typeof auth.setAuth === "function") {
          auth.setAuth({
            token: accessToken,
            refresh: refreshToken,
            user: {
              userId: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
              timezone,
              currency,
              isAccountVerified: user.isAccountVerified,
            },
          });
          console.log("✅ Auth data saved successfully");
        } else {
          console.error("❌ auth.setAuth is not available");
        }

        // ✅ تسجيل الدخول ناجح - التوجيه إلى صفحة الدردشة
        console.log("✅ Login successful, redirecting to chat...");
        setSubmitting(false);
        router.push("/chat");
        return;
      } catch (err) {
        console.error("❌ login error:", err);
        alert(err.message || "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
        setSubmitting(false);
      }
    },
  });

  // Mock social handlers
  const handleGoogleSignIn = () => {
    alert("Google sign-in (mock) — ربط الـ API لاحقاً");
  };

  return (
    <div className={styles.registerWrapper}>
      <div className="row align-items-center min-vh-100 g-3 g-md-4">
        {/* Left visual (الصورة) */}
        <div className="col-12 col-md-6 d-flex justify-content-center order-1 order-md-2">
          <div className={styles.leftCard}>
            <div className={styles.imageText}>
              <h1>
                <img src="/images/logo.png" alt="Logo" width="24" height="24" />
              </h1>
              <h2>مرحبا بكم في لقطها</h2>
              <p>اطلب مني اللي تريده وخليني ألقطها عشانك</p>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="col-12 col-md-6 d-flex justify-content-center order-2 order-md-1">
          <div className={styles.formCard}>
            <h2 className={`${styles.heading} text-center`}>تسجيل الدخول</h2>
            <p className={`${styles.hint} text-center`}>من فضلك ادخل بيانات حسابك</p>

            <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
              <div className="mb-3">
                <input
                  name="email"
                  type="email"
                  placeholder="البريد"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${formik.touched.email && formik.errors.email ? styles.invalid : ""
                    }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className={styles.err}>{formik.errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <input
                  name="password"
                  type="password"
                  placeholder="كلمة المرور"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${formik.touched.password && formik.errors.password ? styles.invalid : ""
                    }`}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className={styles.err}>{formik.errors.password}</div>
                )}
              </div>

              <button type="submit" className={styles.primaryBtn} disabled={submitting}>
                {submitting ? "جاري الدخول..." : "دخول"}
              </button>

              <div className={styles.socialRow}>
                <button
                  type="button"
                  className={styles.socialBtn + " " + styles.google}
                  onClick={handleGoogleSignIn}
                >
                  <Image src="/images/google-logo.svg" alt="Google" width={18} height={18} />
                  <span>تسجيل عبر Google</span>
                </button>
              </div>

              <p className={`${styles.terms} text-center`}>
                من خلال تسجيل الدخول فأنت توافق تلقائياً على
                <span className={styles.highlight}> سياسة الخصوصية </span> و
                <span className={styles.highlight}> شروط الاستخدام </span>
              </p>

              <p className={`${styles.hint} text-center`} style={{ marginTop: 8 }}>
                ليس لديك حساب؟{" "}
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => router.push("/register")}
                >
                  سجل الآن
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
