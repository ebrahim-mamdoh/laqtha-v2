"use client";
import React, { useState } from "react";
import styles from "./hotels.module.css";
import Image from "next/image";

export default function HotelsMsg({ data = [] }) {
  // Use passed data prop instead of local state and file
  const hotels = data;
  const [imageErrors, setImageErrors] = useState({});

  // Don't render anything if no hotels
  if (!hotels || hotels.length === 0) {
    return null;
  }

  const handleImageError = (hotelId) => {
    setImageErrors(prev => ({
      ...prev,
      [hotelId]: true
    }));
  };

  return (
    <>
      {hotels.map((hotel) => (
        <div className={styles.hotelCard} key={hotel.id}>
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
        {imageErrors[hotel.id] ? (
          <div 
            style={{
              width: 240,
              height: 130,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              color: '#666',
              fontSize: '14px',
              textAlign: 'center'
            }}
          >
            صورة الفندق
          </div>
        ) : (
          <Image
            src={hotel.image}
            alt={hotel.name}
            width={240}
            height={130}
            className={styles.bubbleImg}
            onError={() => handleImageError(hotel.id)}
            unoptimized={hotel.image?.startsWith('http')} // Disable optimization for external images
          />
        )}
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
