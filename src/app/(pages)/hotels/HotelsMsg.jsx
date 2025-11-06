"use client";
import React from "react";
import styles from "./hotels.module.css";
import Image from "next/image";

export default function HotelsMsg({ data }) {
  // ✅ استقبال بيانات الفنادق من props
  if (!data || data.length === 0) return null;

  // 🔁 تجهيز البيانات بالشكل المطلوب للعرض
  const formattedHotels = data.map((hotel) => ({
    name: hotel.name || "فندق غير محدد",
    rating: `${hotel.rating || "N/A"} ⭐ تقييم جيد`,
    distance: hotel.distance || "يبعد 5 كم عن وسط المدينة",
    price: hotel.price || "غير متوفر",
    offer:
      hotel.features && hotel.features.length > 0
        ? hotel.features.join(" + ")
        : "بدون عروض حالياً",
    image:
      hotel.image ||
      "/images/hotel-default.png", // صورة افتراضية لو ما فيه صورة
  }));

  return (
    <>
      {formattedHotels.map((hotel, index) => (
        <div className={styles.hotelCard} key={index}>
          <div className="container">
            <div className="row align-items-center">
              {/* التفاصيل */}
              <div className="col-6 col-md-4">
                <div className={styles.hotelDetails}>
                  <strong>{hotel.name}</strong>
                  <ul>
                    <li>{hotel.rating}</li>
                    <li>{hotel.distance}</li>
                    <li>السعر: {hotel.price}</li>
                    <li>{hotel.offer}</li>
                  </ul>
                </div>
              </div>

              {/* الصورة */}
              <div className="col-6 col-md-4 text-center">
                <div className={styles.hotelimage}>
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    width={240}
                    height={130}
                    className={styles.bubbleImg}
                  />
                </div>
              </div>

              {/* الزر */}
              <div className="col-12 col-md-4 mt-3 mt-md-0 text-center">
                <div className={styles.bookBtn}>
                  <button className={styles.deletepic}>حجز</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
