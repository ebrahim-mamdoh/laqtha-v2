// ===== ChatPage.jsx (UI Component Only) =====

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import WaveSurfer from "wavesurfer.js";
import { useChatLogic } from "./ChatLogic";
import HotelsMsg from "./components/hotelsCard/HotelsMsg";
import styles from "./chat.module.css";

// ===== Suggestions Data =====
const SUGGESTIONS = [
  { id: "bookings", title: "حجوزات", subtitle: "استفد من أفضل عروض الحجوزات للفنادق، السكن، السيارات وغيرها...", icon: "📅" },
  { id: "food", title: "طلبات أكل ومطاعم", subtitle: "طلبات الأكل والوجبات السريعة من أفضل المطاعم بالقرب منك...", icon: "🍽️" },
  { id: "products", title: "منتجات ومتاجر", subtitle: "كتب، طاولات، مكاتب، وكل ما تحتاجه لتجهيز بيتك من أفضل المتاجر...", icon: "🛍️" },
];

// ===== AudioMessage Component =====
function AudioMessage({ src, id }) {
  const containerRef = useRef(null);
  const waveRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !src) return;
    let isCancelled = false;
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#ffd6f0",
      progressColor: "#ff2fcf",
      cursorColor: "transparent",
      barWidth: 2,
      barRadius: 2,
      responsive: true,
      height: 48,
      normalize: true,
    });
    waveRef.current = ws;

    ws.on("ready", () => {
      if (isCancelled) return;
      setReady(true);
      setDuration(ws.getDuration() || 0);
    });

    ws.on("finish", () => {
      setPlaying(false);
      ws.seekTo(0);
    });

    try {
      ws.load(src);
    } catch (err) {
      console.warn("WaveSurfer load error:", err);
    }

    return () => {
      isCancelled = true;
      try {
        if (ws && typeof ws.destroy === "function") {
          ws.unAll?.();
        }
      } catch (e) {
        console.log("safe cleanup skipped:", e?.message || e);
      }
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    if (!waveRef.current || !ready) return;
    waveRef.current.playPause();
    setPlaying((p) => !p);
  }, [ready]);

  const fmt = useCallback((s) => {
    if (!s) return "00:00";
    const mm = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }, []);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: "none",
          background: playing ? "#ff2fcf" : "rgba(255,255,255,0.06)",
          color: "#fff",
          cursor: "pointer",
          flex: "0 0 auto",
        }}
      >
        {playing ? "▌▌" : "▶"}
      </button>

      <div style={{ flex: 1 }}>
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 8,
            overflow: "hidden",
            background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          }}
        />
      </div>

      <div style={{ minWidth: 48, textAlign: "right", color: "#fff", fontSize: 13 }}>
        {fmt(duration)}
      </div>
    </div>
  );
}

// ===== Main ChatPage Component =====
export default function ChatPage() {
  // ====== Use Custom Chat Logic Hook ======
  const {
    user,
    isMobile,
    messages,
    input,
    showSuggestions,
    isRecording,
    messagesEndRef,
    handleInputChange,
    handleKeyDown,
    toggleRecording,
    handleSend,
    handleSuggestionClick,
  } = useChatLogic();

  const noMessages = messages.length === 0;

  // ====== Render UI ======

  return (
    <div className={styles.chatPage}>
      <div className="row justify-content-center">
        <div className={`${styles.chatShell} ${noMessages ? styles.noMessages : ""}`}>
          {messages.length > 0 && (
            <div className={styles.messagesArea}>
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.msgRow} ${msg.from === "user" ? styles.msgLeft : styles.msgRight}`}>
                  <div className={`${styles.message} ${msg.from === "user" ? styles.userMsg : styles.botMsg}`}>
                    {msg.type === "audio" ? (
                      <AudioMessage src={msg.src} id={msg.id} />
                    ) : msg.type === "hotels" ? (
                      <HotelsMsg data={msg.hotels} />
                    ) : msg.type === "loading" && msg.component ? (
                      msg.component
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {showSuggestions && (
            <div className={styles.suggestionsWrap}>
              <div className={styles.welcomeSection}>
                <Image src="/images/bubble.png" alt="bubble" width={90} height={90} className={styles.bubbleImg} />
                <div className={styles.welcomeMsg}>
                  مرحباً {user?.name || "بك"}! 👋 <br /> خبرني شنو تريد تطلب اليوم وأنا ألقطها 😉
                </div>
              </div>

              <div className={styles.suggestionsInner}>
                {isMobile ? (
                  <Swiper spaceBetween={12} slidesPerView="auto" className={styles.suggestionsScroll}>
                    {SUGGESTIONS.map((s) => (
                      <SwiperSlide key={s.id} className={styles.slide}>
                        <button className={styles.suggestionCard} onClick={() => handleSuggestionClick(s)}>
                          <div className={styles.suggIcon}>{s.icon}</div>
                          <div className={styles.suggText}>
                            <div className={styles.suggTitle}>{s.title}</div>
                            <div className={styles.suggSubtitle}>{s.subtitle}</div>
                          </div>
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className={styles.desktopList}>
                    {SUGGESTIONS.map((s) => (
                      <button key={s.id} className={styles.suggestionCard} onClick={() => handleSuggestionClick(s)}>
                        <div className={styles.suggIcon}>{s.icon}</div>
                        <div className={styles.suggText}>
                          <div className={styles.suggTitle}>{s.title}</div>
                          <div className={styles.suggSubtitle}>{s.subtitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.inputBar}>
            <div className={`${styles.inputInner} d-flex align-items-center`}>
              <input
                className={styles.textInput}
                placeholder="اكتب طلبك أو استخدم الصوت..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />

              <button
                className={styles.micBtn}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                onClick={toggleRecording}
                title={isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
                style={{ background: isRecording ? "#ff2fcf" : "transparent", borderRadius: 8, padding: 8 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 11v1a7 7 0 0 1-14 0v-1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 19v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()} title={!input.trim() ? "اكتب رسالة أولاً" : "إرسال"}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill={input.trim() ? "#ff2fcf" : "#a0a0a0"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
