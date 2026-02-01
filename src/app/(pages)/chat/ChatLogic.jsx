"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "./components/loading/Loading";

/**
 * Custom Hook: useChatLogic
 * Handles all chat page logic including:
 * - State management
 * - API calls
 * - Audio recording
 * - Message handling
 * - Mobile detection
 */
export function useChatLogic() {
  const { user, token } = useAuth();

  // ====== State Management ======
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestionsUsed, setSuggestionsUsed] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // ====== Refs ======
  const messagesEndRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // ====== Recording State ======
  const [isRecording, setIsRecording] = useState(false);
  const [recordError, setRecordError] = useState(null);

  // ====== Resize Handler ======
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ====== Auto Scroll ======
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // ====== API Call Function ======
  const sendChatMessage = useCallback(
    async (message, retryCount = 0) => {
      try {
        const body = {
          message,
          metadata: {
            source: "web",
            timestamp: new Date().toISOString(),
            language: "ar",
          },
          ...(sessionId ? { sessionId } : {}),
        };

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        const responseData = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("UNAUTHORIZED");
          }
          throw new Error(`Server error: ${response.status}`);
        }

        return responseData;
      } catch (error) {
        // Single retry for network errors
        if (retryCount === 0 && error.message !== "UNAUTHORIZED") {
          console.log("Retrying request...");
          await new Promise((resolve) => setTimeout(resolve, 600));
          return sendChatMessage(message, 1);
        }
        throw error;
      }
    },
    [sessionId, token]
  );

  // ====== Recording Functions ======
  const startRecording = useCallback(async () => {
    setRecordError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: chunksRef.current[0]?.type || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        const audioMsg = {
          id: Date.now(),
          from: "user",
          type: "audio",
          src: url,
          blob,
        };
        setMessages((m) => [...m, audioMsg]);

        if (!suggestionsUsed) {
          setShowSuggestions(false);
          setSuggestionsUsed(true);
        }

        try {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            mediaStreamRef.current = null;
          }
        } catch { }
      };

      mr.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording permission/error:", err);
      setRecordError("لا يمكن الوصول إلى الميكروفون. الرجاء السماح بالوصول.");
    }
  }, [suggestionsUsed]);

  const stopRecording = useCallback(() => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsRecording(false);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    isRecording ? stopRecording() : startRecording();
  }, [isRecording, startRecording, stopRecording]);

  // ====== Send Message Handler ======
  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), from: "user", text };
    setMessages((m) => [...m, userMsg]);

    if (!suggestionsUsed) {
      setShowSuggestions(false);
      setSuggestionsUsed(true);
    }
    setInput("");

    // Add loading message
    const loadingMsg = {
      id: Date.now() + 1,
      from: "bot",
      type: "loading",
      component: <Loading />,
    };
    setMessages((m) => [...m, loadingMsg]);

    // Send real API request
    sendChatMessage(text)
      .then((responseData) => {
        // Remove loading message
        setMessages((prev) => prev.filter((msg) => msg.id !== loadingMsg.id));

        const data = responseData.data || {};

        // Save sessionId if provided
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }

        // Add bot text message if exists
        if (data.message) {
          const botTextMsg = {
            id: Date.now() + 2,
            from: "bot",
            text: data.message,
          };
          setMessages((m) => [...m, botTextMsg]);
        }

        // Add hotels if they exist
        if (Array.isArray(data.hotels) && data.hotels.length > 0) {
          const normalizedHotels = data.hotels.map((hotel) => ({
            id: hotel.id || Math.random().toString(36).substr(2, 9),
            name: hotel.name || "فندق غير معروف",
            rating: hotel.rating ? `${hotel.rating} ⭐` : "غير محدد",
            distance: hotel.distance || "المسافة غير محددة",
            price: hotel.price || "السعر غير محدد",
            offer: hotel.offer || (hotel.features ? hotel.features.join(" + ") : ""),
            image: hotel.image || "/images/hotel-default.png",
          }));

          const hotelsMsg = {
            id: Date.now() + 3,
            from: "bot",
            type: "hotels",
            hotels: normalizedHotels,
          };
          setMessages((m) => [...m, hotelsMsg]);
        }
      })
      .catch((error) => {
        // Remove loading message and show error
        setMessages((prev) => prev.filter((msg) => msg.id !== loadingMsg.id));

        let errorMessage = "حدث خطأ أثناء التواصل مع السيرفر. حاول مرة أخرى.";

        if (error.message === "UNAUTHORIZED") {
          errorMessage = "سجل دخولك مرة أخرى.";
        }

        const errorMsg = {
          id: Date.now() + 4,
          from: "bot",
          text: errorMessage,
        };
        setMessages((m) => [...m, errorMsg]);

        console.error("Chat API error:", error);
      });
  }, [input, suggestionsUsed, sendChatMessage]);

  // ====== Suggestion Click Handler ======
  const handleSuggestionClick = useCallback((sugg) => {
    setSuggestionsUsed(true);
    setShowSuggestions(false);
    const msg = { id: Date.now(), from: "user", text: sugg.title };
    setMessages((m) => [...m, msg]);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: `عرض ${sugg.title} جاهز — اختر أحد العناصر للمتابعة`,
        },
      ]);
    }, 800);
  }, []);

  // ====== Input Change Handler ======
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  // ====== Key Down Handler ======
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // ====== Return All State & Handlers ======
  return {
    // User data
    user,
    token,

    // UI State
    isMobile,
    messages,
    input,
    showSuggestions,
    suggestionsUsed,

    // Recording State
    isRecording,
    recordError,

    // Refs
    messagesEndRef,

    // Handlers
    setInput,
    setShowSuggestions,
    setSuggestionsUsed,
    toggleRecording,
    handleSend,
    handleSuggestionClick,
    handleInputChange,
    handleKeyDown,
  };
}
