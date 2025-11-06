"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function ChatMessages({ messages }) {
  const { user } = useAuth(); // 👈 هات بيانات اليوزر من الكونتكست

  return (
    <div className="chat-messages">
      {(!messages || messages.length === 0) ? (
        <div className="card chat-hero">
          <h1>👋 مرحباً {user?.name || "ضيف"}</h1>
          <p>جرب اكتب أو اطلب ما تريد. يمكنك أيضاً استخدام زر الميكروفون للتسجيل الصوتي.</p>
        </div>
      ) : (
        messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: m.from === "me" ? "row-reverse" : "row",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div style={{ maxWidth: "70%" }}>
              {/* رسالة نصية */}
              {m.type === "text" && (
                <div
                  style={{
                    background:
                      m.from === "me"
                        ? "linear-gradient(90deg,#702DE7,#FF00C8)"
                        : "rgba(255,255,255,0.05)",
                    padding: "10px 14px",
                    borderRadius: 14,
                    color: "#fff",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
              )}

              {/* رسالة صوتية */}
              {m.type === "audio" && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: 12,
                    borderRadius: 14,
                  }}
                >
                  <audio controls src={m.audioUrl} style={{ width: "100%" }} />
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
