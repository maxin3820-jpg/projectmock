"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { university } from "@/config/university";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 1px 12px rgba(0,0,0,0.06)"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{
              width: 42, height: 42,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 14,
              boxShadow: "0 4px 12px rgba(30,58,95,0.3)",
              flexShrink: 0
            }}>
              {university.logoText}
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, lineHeight: 1.2 }}>
                {university.name}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Mock Test Platform</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${pathname === link.href ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="desktop-nav">
            <Link href="/login" style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: "#475569", textDecoration: "none", transition: "color 0.2s"
            }}>
              Log in
            </Link>
            <Link href="/pricing" className="btn-primary" style={{ padding: "9px 20px", fontSize: 14 }}>
              ✦ Unlock Premium
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              display: "none",
              padding: 8, borderRadius: 8, border: "none",
              background: menuOpen ? "#f1f5f9" : "transparent",
              cursor: "pointer", color: "#475569"
            }}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="menu-open" style={{
            borderTop: "1px solid #f1f5f9",
            padding: "12px 0 16px",
            display: "flex", flexDirection: "column", gap: 4
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link${pathname === link.href ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                padding: "10px 16px", borderRadius: 10, textAlign: "center",
                border: "1.5px solid #e2e8f0", color: "#475569",
                fontSize: 14, fontWeight: 600, textDecoration: "none"
              }}>
                Log in
              </Link>
              <Link href="/pricing" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ justifyContent: "center" }}>
                ✦ Unlock Premium
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
