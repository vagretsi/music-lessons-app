"use client";
import Link from "next/link";
import { useLocale } from "@/app/providers";
export function Footer() {
  const { locale } = useLocale();
  return <footer className="site-footer"><span>© {new Date().getFullYear()} Maestro</span><span>{locale === "el" ? "Μουσική, κάθε μέρα." : "A little music, every day."}</span><Link href="/pricing">{locale === "el" ? "Πλάνα & τιμές" : "Plans & pricing"}</Link></footer>;
}
