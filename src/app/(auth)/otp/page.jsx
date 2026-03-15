"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // ✅ استيراد router من App Router
import styles from "./otp.module.css";


import apiClient from '@/lib/api';

export default function Otp() {
  const router = useRouter(); // ✅ تهيئة الـ router
  // Make OTP length configurable -- default to 6
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // 📩 قراءة الإيميل من localStorage عند تحميل الصفحة
  useEffect(() => {
    try {
      const userData = localStorage.getItem("laqtaha_user");
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.email) setEmail(parsed.email);
      } else {
        console.warn("⚠️ لم يتم العثور على laqtaha_user في localStorage");
      }
    } catch (err) {
      console.error("❌ خطأ في قراءة بيانات المستخدم من localStorage", err);
    }
  }, []);


  // 🧩 التحكم في حقول OTP
  const handleChange = (index, value) => {
    // Keep only digits and a single character
    const cleaned = String(value).replace(/\D/g, "").slice(0, 1);

    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    // Auto move to next input when a digit was entered
    if (cleaned !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: move to prev input
    if (e.key === "Backspace") {
      // If current has a value, clear it (default browser behavior will do that),
      // but if it's already empty, move focus to previous and clear it.
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        e.preventDefault();
      }
    }

    // Allow arrow navigation between inputs
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const raw = e.clipboardData.getData("text") || "";
    const pastedData = raw.replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pastedData) return;

    // Determine start index based on the element that received the paste
    let startIndex = 0;
    try {
      const targetId = e.target?.id || "";
      const parts = String(targetId).split("-");
      const maybeIndex = Number(parts[1]);
      if (!Number.isNaN(maybeIndex)) startIndex = maybeIndex;
    } catch (err) {
      // ignore and start from 0
    }

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      const pos = startIndex + i;
      if (pos < OTP_LENGTH) newOtp[pos] = char;
    });
    setOtp(newOtp);

    // Focus the input after the last pasted character (or last input)
    const focusIndex = Math.min(startIndex + pastedData.length - 1, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  // 🧠 عند الضغط على زر التحقق
  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError(`الرجاء إدخال رمز مكون من ${OTP_LENGTH} أرقام`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post('/auth/verify-account', {
        email,
        otp: code,
      });

      const data = response.data;

      // ⚠️ فحص النتيجة
      if (!data.success) {
        setError(
          data?.message?.ar ||
          "فشل التحقق من الرمز، تأكد من صحته أو أعد المحاولة لاحقًا."
        );
        return;
      }

      // ✅ نجاح التحقق
      setVerified(true);
      setError("");
      localStorage.removeItem("registerEmail");
    } catch (err) {
      console.error("Verification error:", err);
      const errorMessage = err.response?.data?.message?.ar || "حدث خطأ أثناء الاتصال بالخادم، حاول مجددًا.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ منطق الانتقال بعد التحقق بنجاح
  const handleNext = () => {
    router.replace("/onboarding");
  };

  return (
    <>
      <div className={styles.registerWrapper}>
        <div className="row align-items-center min-vh-100 g-3 g-md-4">
          {/* Left visual */}
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
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center  order-2 order-md-1 text-center">
            {!verified ? (
              <>
                <h2 className={`${styles.heading}`}>
                  قد قمنا بإرسال رمز التحقق إليك، المرجو التحقق منه في بريدك الإلكتروني
                </h2>

                <div className={styles.otpInputs} onPaste={handlePaste}>
                  {otp.map((v, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      maxLength="1"
                      value={v}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      disabled={loading}
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      className={styles.otpBox}
                    />
                  ))}
                </div>

                {error && <p className={styles.errorText}>{error}</p>}

                <p className={styles.resendText}>لم يصلك الرمز؟</p>
                <button className={styles.resendLink} onClick={() => alert("سيتم إرسال الكود مجددًا")}
                >
                  إعادة إرسال رمز التحقق
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`${styles.primaryBtn}  mx-auto`}
                >
                  {loading ? "جارٍ التحقق..." : "التالي"}
                </button>
              </>
            ) : (
              <>
                <div className={styles.sccessWrapper}>
                  <h2 className={styles.heading}>
                    تم التحقق من البريد الإلكتروني بنجاح!!
                    <br />
                    لنقم بإعداد التطبيق من أجلك
                  </h2>

                  <div className={styles.successIcon}>
                    <img
                      src="/images/success-check.svg"
                      alt="Success"
                      width="300"
                      height="300"
                    />
                  </div>

                  {/* ✅ تم استبدال الـ alert بالتوجيه */}
                  <button onClick={handleNext} className={styles.primaryBtn}>
                    التالي
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
