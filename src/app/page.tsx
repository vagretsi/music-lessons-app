"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight, ArrowRight, Play, Calendar } from "lucide-react";
import { useLocale } from "./providers";

export default function HomePage() {
  const { locale } = useLocale();
  const { status } = useSession();
  const el = locale === "el";
  return (
    <div className="home-shell">
      <section className="home-hero">
        <p className="eyebrow"><span className="status-dot" />{el ? "Ο δικός σου χώρος μουσικής" : "Your space for music"}</p>
        <h1><span>{el ? "Περισσότερη μουσική." : "More music."}</span></h1>
        <div className="hero-bottom">
          <p>{el ? "Μαθήματα στον ρυθμό σου. Προσωπική καθοδήγηση όταν τη χρειάζεσαι. Όλα σε έναν χώρο." : "Lessons at your pace. Personal guidance when you need it. Everything in one place."}</p>
          {status === "unauthenticated" && <Link href="/register" className="btn-primary">{el ? "Ξεκίνα εδώ" : "Get started"}<ArrowUpRight size={18} /></Link>}
        </div>
      </section>
      <section className="home-paths" aria-label={el ? "Μαθήματα και κρατήσεις" : "Lessons and bookings"}>
        <Link href="/lessons" className="path-card">
          <div className="path-top"><Play size={22} /><span>01 / {el ? "ΜΑΘΗΣΗ" : "LEARN"}</span><ArrowUpRight size={22} /></div>
          <h2>{el ? "Πάτα play. Προχώρα." : "Press play. Move forward."}</h2>
          <p>{el ? "Βρες το μάθημά σου και εξασκήσου όποτε σε βολεύει." : "Find your next lesson and practice whenever it suits you."}</p>
          <span className="path-link">{el ? "Δες τα μαθήματα" : "Explore lessons"}<ArrowRight size={16} /></span>
        </Link>
        <Link href="/booking" className="path-card">
          <div className="path-top"><Calendar size={22} /><span>02 / {el ? "ΜΑΖΙ" : "CONNECT"}</span><ArrowUpRight size={22} /></div>
          <h2>{el ? "Το επόμενο βήμα, μαζί." : "Your next step, together."}</h2>
          <p>{el ? "Διάλεξε καθηγητή και ώρα για το προσωπικό σου μάθημα." : "Choose a teacher and a time for your one-to-one session."}</p>
          <span className="path-link">{el ? "Κλείσε μάθημα" : "Book a session"}<ArrowRight size={16} /></span>
        </Link>
      </section>
      {status === "unauthenticated" && <div className="home-note"><span>{el ? "Έχεις ήδη λογαριασμό;" : "Already a student?"}</span><Link href="/login">{el ? "Συνέχισε από εκεί που έμεινες" : "Pick up where you left off"}<ArrowRight size={16} /></Link></div>}
    </div>
  );
}
