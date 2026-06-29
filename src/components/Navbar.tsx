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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform duration-200"
              style={{ background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})` }}
            >
              {university.logoText}
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-slate-800 text-sm leading-tight">{university.name}</p>
              <p className="text-xs text-slate-500">Mock Test Platform</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                style={
                  pathname === link.href
                    ? { backgroundColor: university.colors.primary }
                    : {}
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm hover:opacity-90 transition-all duration-200"
              style={{ backgroundColor: university.colors.accent }}
            >
              Unlock Premium
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                style={pathname === link.href ? { backgroundColor: university.colors.primary } : {}}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2 px-1">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-center text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-center text-white rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: university.colors.accent }}
              >
                Unlock Premium
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
