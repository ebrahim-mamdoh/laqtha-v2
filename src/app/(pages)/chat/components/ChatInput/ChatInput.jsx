"use client";

import React, { useState, useRef } from "react";

export default function ChatInput({ onSendText, onSendAudio }) {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        // send audio up
        onSendAudio({ blob, url });
        // stop tracks
        stream.getTracks().forEach(t => t.stop());
      };

      mr.start();
      setRecording(true);
    } catch (err) {
      console.error("mic error", err);
      alert("يرجى منح الأذن للاستخدام الميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSendText(text.trim());
    setText("");
  };

  return (
    <div className="chat-input-bar">
      <button
        className="mic-btn"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        aria-label="record"
        title="اضغط للتسجيل الصوتي"
      >
        {recording ? "⏺️" : "🎤"}
      </button>

      <input
        className="chat-input"
        placeholder="اكتب لي طلبك واترك الباقي علينا..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />

      <button className="btn btn-primary" onClick={handleSend}>إرسال</button>
    </div>
  );
}
