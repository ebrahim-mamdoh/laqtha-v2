"use client";

import React from "react";

export default function ChatSuggestions({ onPick }) {
  const cards = [
    { id: "products", title: "منتجات ومتاجر", desc: "كتب، قوالب، متجر... اختر المنتج الذي تريده." },
    { id: "food", title: "طلبات أكل ومطاعم", desc: "الوجبات السريعة وأفضل المطاعم بالقرب منك." },
    { id: "bookings", title: "حجوزات", desc: "حجوزات الفنادق، السيارات، الطاولات." },
  ];

  return (
    <div className="suggestions">
      {cards.map(c => (
        <div key={c.id} className="suggestion-card" onClick={() => onPick(c)}>
          <div>
            <div className="title">{c.title}</div>
            <div className="desc">{c.desc}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button className="btn btn-outline">فتح</button>
          </div>
        </div>
      ))}
    </div>
  );
}
