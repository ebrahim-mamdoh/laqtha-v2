import Link from "next/link";
import Image from "next/image";
import styles from "./landing.module.css";

export default function Footer() {
  return (
    <footer className="py-4 border-top" style={{ backgroundColor: 'var(--lp-bg)', borderColor: 'var(--lp-border)' }}>
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
        {/* Brand & Rights */}
        <div className="d-flex flex-column gap-2 text-center text-md-start">
          <Link href="/" className="d-inline-flex align-items-center text-decoration-none">
             <Image 
               src="/landing/logo.svg" 
               alt="Laqtaha Logo" 
               width={100} 
               height={40} 
               style={{ width: 'auto', height: '40px' }} 
             />
          </Link>
          <small style={{ color: 'var(--lp-text-muted)' }}>
             &copy; {new Date().getFullYear()} لقطة. جميع الحقوق محفوظة.
          </small>
        </div>

        {/* Links */}
        <div className="d-flex gap-4">
          <Link href="#" className="text-decoration-none fw-medium" style={{ color: 'var(--lp-text)' }}>من نحن</Link>
          <Link href="#" className="text-decoration-none fw-medium" style={{ color: 'var(--lp-text)' }}>تواصل معنا</Link>
          <Link href="#" className="text-decoration-none fw-medium" style={{ color: 'var(--lp-text)' }}>طاقم العمل</Link>
          <Link href="#" className="text-decoration-none fw-medium" style={{ color: 'var(--lp-text)' }}>الأسئلة</Link>
        </div>

        {/* Badges / Apps */}
        <div className="d-flex gap-2">
          <div className="rounded border px-3 py-1 bg-opacity-10 d-flex align-items-center gap-2" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-card-bg)', cursor: 'pointer' }}>
             <span className="fs-6" style={{ color: 'var(--lp-text)' }}>Google Play</span>
          </div>
          <div className="rounded border px-3 py-1 bg-opacity-10 d-flex align-items-center gap-2" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-card-bg)', cursor: 'pointer' }}>
             <span className="fs-6" style={{ color: 'var(--lp-text)' }}>App Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
