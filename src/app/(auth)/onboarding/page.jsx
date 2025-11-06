"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./onboarding.module.css";

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  const [step, setStep] = useState(1);
  const [onboardData, setOnboardData] = useState({
    about: "",
    purpose: "",
    source: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("onboarding");
    if (saved) setOnboardData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("onboarding", JSON.stringify(onboardData));
  }, [onboardData]);

  const aboutOptions = ["طالب", "موظف", "رائد أعمال", "تاجر", "شيء آخر"];
  const purposeOptions = [
    "تسهيل الحجوزات والشراء",
    "تسهيل البحث عن المقتنيات والحجوزات",
    "من أجل ميزة الفزعة",
  ];
  const sourceOptions = [
    "من مواقع التواصل الاجتماعي",
    "حملات اعلانية",
    "اماكن اخرى",
  ];

  const isDisabled =
    (step === 1 && !onboardData.about) ||
    (step === 2 && !onboardData.purpose) ||
    (step === 3 && !onboardData.source);

  const handleNext = () => {
    if (isDisabled) return;
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePrev = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinish = async () => {
    if (isDisabled) return;
    completeOnboarding(onboardData);
    localStorage.removeItem("onboarding");
    router.replace("/chat");
  };

  return (
    <div className={styles.pageWrap}>
      <div className={`row ${styles.cardWrap}`}>
        {/* Left side */}
        <div
          className={`col-12 col-md-6 order-1 order-md-2 ${styles.leftCard}`}
          aria-hidden
        >
          <div className={styles.leftOverlay}>
            <div className={styles.imageText}>
              <img src="/images/logo.png" alt="logo" width={160} height={50} />
              <h2>مرحبا بكم في لقطها</h2>
              <p>اطلب مني اللي تريده وخليني ألقطها عشانك</p>
            </div>
          </div>
        </div>

        {/* Right side (steps form) */}
        <div className={`col-12 col-md-6 order-2 order-md-1 ${styles.formCard}`}>
          {/* Progress */}
          <div className={styles.progressWrap}>
            <div className={styles.progress}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${styles.segment} ${
                    i < step
                      ? styles.completed
                      : i === step
                      ? styles.active
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className={styles.stepContainer}>
            {step === 1 && (
              <div className={styles.step}>
                <h2>أخبرنا المزيد عنك للحصول على أفضل تجربة</h2>
                <div className={styles.options}>
                  {aboutOptions.map((opt) => (
                    <button
                      key={opt}
                      className={`${styles.optionBtn} ${
                        onboardData.about === opt ? styles.optionActive : ""
                      }`}
                      onClick={() =>
                        setOnboardData({ ...onboardData, about: opt })
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.step}>
                <h2>أريد استخدام لقطها من أجل...</h2>
                <div className={styles.radioOptions}>
                  {purposeOptions.map((opt) => (
                    <div
                      key={opt}
                      className={`${styles.radioOption} ${
                        onboardData.purpose === opt ? styles.active : ""
                      }`}
                      onClick={() =>
                        setOnboardData({ ...onboardData, purpose: opt })
                      }
                    >
                      <span className={styles.radioCircle}></span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.step}>
                <h2>كيف سمعت عنا...</h2>
                <div className={styles.radioOptions}>
                  {sourceOptions.map((opt) => (
                    <div
                      key={opt}
                      className={`${styles.radioOption} ${
                        onboardData.source === opt ? styles.active : ""
                      }`}
                      onClick={() =>
                        setOnboardData({ ...onboardData, source: opt })
                      }
                    >
                      <span className={styles.radioCircle}></span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className={styles.navBtns}>
            {step > 1 ? (
              <button className={styles.secondaryBtn} onClick={handlePrev}>
                السابق
              </button>
            ) : (
              <div className={styles.prevPlaceholder} />
            )}

            {step < 3 ? (
              <button
                className={styles.primaryBtn}
                onClick={handleNext}
                disabled={isDisabled}
                aria-disabled={isDisabled}
              >
                التالي
              </button>
            ) : (
              <button
                className={styles.primaryBtn}
                onClick={handleFinish}
                disabled={isDisabled}
                aria-disabled={isDisabled}
              >
                إنهاء
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
