import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg py-3 sticky-top" style={{ backgroundColor: 'transparent', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--lp-border)' }}>
      <div className="container">
        {/* Brand/Logo right side */}
        <Link href="/" className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2">
          {/* Logo mock icon */}
          <span style={{ color: 'var(--color-primary)' }}>لقطة</span>
          <div style={{ width: 24, height: 24, background: 'var(--gradient-primary)', borderRadius: 6, display: 'inline-block' }}></div>
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center gap-3">
            <li className="nav-item">
              <ThemeToggle />
            </li>
            <li className="nav-item">
              <Link href="/login" className="nav-link fw-semibold" style={{ color: 'var(--lp-text)' }}>
                تسجيل الدخول
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/register" className="btn btn-outline px-4 rounded-pill" style={{ color: 'var(--lp-text)', border: '1px solid var(--lp-border)' }}>
                إنشاء حساب
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
