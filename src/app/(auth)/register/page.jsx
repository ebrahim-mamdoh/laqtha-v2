"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./register.module.css";

import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth?.() || null;
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null); // ✅ لإظهار الخطأ من السيرفر

  // ✅ regex مطابق للتحقق المستخدم في backend
  const phoneRegex = /^(?:\+9665\d{8}|05\d{8})$/;

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "", // ✅ أضف حقل الهاتف (backend يتطلبه)
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("مطلوب"),
      lastName: Yup.string().required("مطلوب"),
      email: Yup.string().email("بريد إلكتروني غير صالح").required("مطلوب"),
      password: Yup.string().min(6, "على الأقل 6 أحرف").required("مطلوب"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "كلمة المرور غير متطابقة")
        .required("مطلوب"),
      phone: Yup.string()
        .matches(phoneRegex, "يجب أن يبدأ بـ +966 أو 05 ويحتوي على 10 أرقام")
        .required("رقم الهاتف مطلوب"),
    }),

    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            password: values.password,
            phone: "055487921", // مؤقتاً
            role: "customer",
          }),
        });

        const data = await res.json();
        console.log("REGISTER RESPONSE:", data);

        if (!res.ok || data.success === false) {
          // ✅ لو فيه قائمة أخطاء من السيرفر (errors array)
          if (data.errors && Array.isArray(data.errors)) {
            const newErrors = {};
            data.errors.forEach((err) => {
              newErrors[err.field] = err.message;
            });

            // نحدّث أخطاء Formik لعرضها تحت كل حقل
            formik.setErrors(newErrors);
          } else {
            // أو نعرض رسالة عامة لو مفيش تفاصيل حقول
            alert(data.message?.ar || "حدث خطأ أثناء التسجيل");
          }
          return;
        }

        // ✅ نجاح التسجيل
        if (auth && typeof auth.setAuth === "function") {
          auth.setAuth({ token: "server-token", user: data.data });
        } else {
          localStorage.setItem("laqtaha_token", "server-token");
          localStorage.setItem("laqtaha_user", JSON.stringify(data.data));
        }

        alert(data.message?.ar || "تم التسجيل بنجاح!");
        router.replace("/otp");
      } catch (err) {
        console.error("REGISTER ERROR:", err);
        alert("فشل الاتصال بالخادم أو حدث خطأ غير متوقع");
      } finally {
        setSubmitting(false);
      }
    },

  });

  return (
    <div className={styles.registerWrapper}>
      <div className="row align-items-center min-vh-100 g-3 g-md-4">
        {/* Left visual */}
        <div className="col-12 col-md-6 d-flex justify-content-center order-1 order-md-2 LeftCardWrapper">
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
          <form
            className={styles.form}
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <h2 className={`${styles.heading} text-center`}>
              قم بإنشاء حسابك المجاني الآن
            </h2>
            <p className={`${styles.hint} text-center`}>
              او قم بتسجيل حسابك إن كنت تمتلك واحداً
            </p>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <input
                  name="firstName"
                  placeholder="الاسم الأول"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${formik.touched.firstName && formik.errors.firstName
                    ? styles.invalid
                    : ""
                    }`}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className={styles.err}>{formik.errors.firstName}</div>
                )}
              </div>

              <div className="col-12 col-md-6 mb-3">
                <input
                  name="lastName"
                  placeholder="اسم العائلة"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${formik.touched.lastName && formik.errors.lastName
                    ? styles.invalid
                    : ""
                    }`}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className={styles.err}>{formik.errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <input
                name="email"
                type="email"
                placeholder="البريد الإلكتروني"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${styles.input} ${formik.touched.email && formik.errors.email
                  ? styles.invalid
                  : ""
                  }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className={styles.err}>{formik.errors.email}</div>
              )}
            </div>

            {/* ✅ أضف حقل رقم الهاتف */}
            <div className="mb-3">
              <input
                name="phone"
                type="text"
                placeholder="رقم الجوال (05XXXXXXXX)"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${styles.input} ${formik.touched.phone && formik.errors.phone
                  ? styles.invalid
                  : ""
                  }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className={styles.err}>{formik.errors.phone}</div>
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
                className={`${styles.input} ${formik.touched.password && formik.errors.password
                  ? styles.invalid
                  : ""
                  }`}
              />
              {formik.touched.password && formik.errors.password && (
                <div className={styles.err}>{formik.errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <input
                name="confirmPassword"
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${styles.input} ${formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                  ? styles.invalid
                  : ""
                  }`}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className={styles.err}>
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>

            {/* ✅ عرض رسالة الخطأ من السيرفر */}
            {serverError && (
              <div className={`${styles.err} text-center mb-3`}>
                {serverError}
              </div>
            )}

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={submitting}
            >
              {submitting ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </button>

            <p className={`${styles.hint} text-center`} style={{ marginTop: 8 }}>
              لديك حساب بالفعل؟{" "}
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => router.push("/login")}
              >
                سجل الدخول
              </button>
            </p>


            <p className={`${styles.terms} text-center`}>
              بالضغط على إنشاء الحساب فأنت توافق تلقائياً على{" "}
              <span className={styles.highlight}>سياسة الخصوصية</span> و
              <span className={styles.highlight}>شروط الاستخدام</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
