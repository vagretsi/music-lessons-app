"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, AudioLines } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/app/providers";

export function Navbar() {
  const { data: session } = useSession();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const el = locale === "el";
  const accountName = session?.user.name?.trim() || session?.user.email || (el ? "Λογαριασμός" : "Account");
  const links = [
    ...(session ? [{ href: "/dashboard", label: el ? "Ο χώρος μου" : "My space" }] : []),
    ...(session?.user.role === "TEACHER" ? [{ href: "/availability", label: el ? "Διαθεσιμότητα" : "Availability" }] : []),
    { href: "/lessons", label: el ? "Μαθήματα" : "Lessons" },
    { href: "/booking", label: el ? "Κρατήσεις" : "Bookings" },
    ...(session?.user.role === "ADMIN" ? [{ href: "/admin", label: el ? "Διαχείριση" : "Admin" }] : []),
  ];
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label={el ? "Κύρια πλοήγηση" : "Main navigation"}>
        <Link href="/" className="brand" onClick={() => setOpen(false)}><AudioLines size={25} /><span>maestro<span className="text-gold">.</span></span></Link>
        <div className="desktop-links">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.label}</Link>)}</div>
        <div className="nav-actions">
          {session && <Link href="/dashboard" className="nav-account" title={accountName} aria-label={`${el ? "Συνδεδεμένος ως" : "Signed in as"} ${accountName}`}><span className="account-initial" aria-hidden="true">{accountName.slice(0, 1).toUpperCase()}</span><span className="account-name">{accountName}</span></Link>}
          <button className="language-switch" aria-label={el ? "Switch to English" : "Αλλαγή σε ελληνικά"} onClick={() => setLocale(el ? "en" : "el")}>{el ? "EN" : "ΕΛ"}</button>
          {session ? <button className="desktop-signout" onClick={() => signOut({ callbackUrl: "/" })}>{el ? "Έξοδος" : "Sign out"}</button> : <Link className="nav-login" href="/login">{el ? "Σύνδεση" : "Sign in"}</Link>}
          <button className="mobile-toggle" aria-label={el ? "Μενού" : "Menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </nav>
      {open && <div id="mobile-navigation" className="mobile-links">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.label}</Link>)}{session && <button onClick={() => signOut({ callbackUrl: "/" })}>{el ? "Έξοδος" : "Sign out"}</button>}</div>}
    </header>
  );
}
