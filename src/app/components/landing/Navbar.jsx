"use client";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down and past 50px, hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        // If scrolling up or at top, show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav 
      className="navbar navbar-expand-lg py-3 sticky-top" 
      style={{ 
        backgroundColor: 'rgba(10, 10, 10, 0.4)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'transform 0.3s ease-in-out',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)'
      }}
    >
      <div className="container">
        {/* Brand/Logo right side */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image
            src="/landing/logo.svg"
            alt="Laqtaha Logo"
            width={100}
            height={40}
            style={{ width: 'auto', height: '40px' }}
            priority
          />
        </Link>
        
        <button
          className="navbar-toggler outline-none shadow-none border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarLanding"
          aria-controls="navbarLanding"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarLanding">
          {/* Centered navigation links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center gap-4">
            <li className="nav-item">
              <Link href="/" className="nav-link" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>
                الرئيسية
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#about" className="nav-link" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>
                حول التطبيق
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#features" className="nav-link" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>
                الميزات
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#faq" className="nav-link" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>
                الاسئلة الشائعة
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#partner" className="nav-link" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>
                انضم كشريك
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#contact" className="nav-link" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>
                تواصل معنا
              </Link>
            </li>
          </ul>

          {/* Left side button and ThemeToggle */}
          <div className="d-flex align-items-center gap-3 ms-auto ms-lg-0 mt-3 mt-lg-0">
            <ThemeToggle />
            <Link 
              href="/download" 
              style={{ 
                background: 'linear-gradient(90deg, #D434FE, #5B42F3)', 
                padding: '2px', 
                borderRadius: '12px', 
                display: 'inline-block', 
                textDecoration: 'none' 
              }}
            >
              <div 
                className="d-flex align-items-center justify-content-center"
                style={{ 
                  background: '#0F1012', 
                  padding: '8px 30px', 
                  borderRadius: '10px', 
                  color: '#ffffff', 
                  fontSize: '0.95rem', 
                  fontWeight: '500',
                  transition: 'background 0.3s ease'
                }}
              >
                تحميل التطبيق
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
