"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Music, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/app/providers";

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
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/10 bg-ink/70 px-5 shadow-[0_20px_50px_rgba(2,6,23,0.18)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors group-hover:border-gold/30 group-hover:bg-gold/10">
            <Music size={16} className="text-gold" />
          </div>
          <span className="font-display text-lg text-cream md:text-xl">Maestro</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-cream/70 transition-colors hover:bg-white/10 hover:text-cream"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "el" : "en")}
            className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-xs uppercase tracking-[0.2em] text-cream/60 transition-colors hover:border-gold/25 hover:text-cream"
          >
            <Globe size={14} />
            {locale === "en" ? "ΕΛ" : "EN"}
          </button>

          {session ? (
            <div className="flex items-center gap-3">
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/20"
                >
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="btn-secondary px-5 py-2 text-sm">
                {locale === "el" ? "Πίνακας" : "Dashboard"}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-cream/40 transition-colors hover:text-cream"
              >
                {locale === "el" ? "Έξοδος" : "Sign Out"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-cream/60 transition-colors hover:text-cream">
                {locale === "el" ? "Σύνδεση" : "Sign In"}
              </Link>
              <Link href="/register" className="btn-primary px-5 py-2 text-sm">
                {locale === "el" ? "Εγγραφή" : "Get Started"}
              </Link>
            </div>
          )}
        </div>

        <button
          className="text-cream/60 transition-colors hover:text-cream md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="mx-auto mt-3 flex max-w-7xl flex-col gap-4 rounded-[28px] border border-white/10 bg-ink-50/95 px-6 py-5 shadow-[0_24px_50px_rgba(2,6,23,0.2)] backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-white/10 py-2 text-cream/70 transition-colors hover:text-cream"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setLocale(locale === "en" ? "el" : "en")}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/60"
          >
            <Globe size={14} />
            {locale === "en" ? "ΕΛ" : "EN"}
          </button>
          {session ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-full border border-gold/25 bg-gold/10 px-4 py-3 text-center text-xs uppercase tracking-[0.2em] text-gold"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                {locale === "el" ? "Πίνακας" : "Dashboard"}
              </Link>
              <button onClick={() => signOut()} className="text-sm text-cream/40">
                {locale === "el" ? "Έξοδος" : "Sign Out"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-center" onClick={() => setMobileOpen(false)}>
                {locale === "el" ? "Σύνδεση" : "Sign In"}
              </Link>
              <Link href="/register" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                {locale === "el" ? "Εγγραφή" : "Get Started"}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
