"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Music, Menu, X, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/app/providers";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const { locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/lessons", label: locale === "el" ? "Μαθήματα" : "Lessons" },
    { href: "/booking", label: locale === "el" ? "Κράτηση" : "Book a Lesson" },
    { href: "/pricing", label: locale === "el" ? "Τιμές" : "Pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold/10 bg-ink/90 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 border border-gold/50 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
            <Music size={16} className="text-gold" />
          </div>
          <span className="font-display text-xl text-cream tracking-wide">
            Maestro
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/60 hover:text-cream transition-colors text-sm tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language switcher */}
          <button
            onClick={() => setLocale(locale === "en" ? "el" : "en")}
            className="flex items-center gap-1 text-cream/50 hover:text-gold transition-colors text-xs tracking-widest uppercase"
          >
            <Globe size={14} />
            {locale === "en" ? "ΕΛ" : "EN"}
          </button>

          {session ? (
  <div className="flex items-center gap-3">
    {session.user.role === "ADMIN" && (
      <Link href="/admin" className="text-gold/60 hover:text-gold transition-colors text-xs tracking-widest uppercase border border-gold/30 px-3 py-1.5">
        Admin
      </Link>
    )}
    <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">
                {locale === "el" ? "Πίνακας" : "Dashboard"}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-cream/40 hover:text-cream transition-colors text-sm"
              >
                {locale === "el" ? "Έξοδος" : "Sign Out"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-cream/60 hover:text-cream transition-colors text-sm">
                {locale === "el" ? "Σύνδεση" : "Sign In"}
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-5">
                {locale === "el" ? "Εγγραφή" : "Get Started"}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-cream/60 hover:text-cream"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gold/10 bg-ink px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/70 hover:text-cream py-2 border-b border-gold/10"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/dashboard" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="text-cream/40 text-sm">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-center" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
