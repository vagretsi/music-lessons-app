import Link from "next/link";
import { Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-6 pb-10 pt-2">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-[32px] border border-white/10 bg-white/5 px-6 py-10 shadow-[0_24px_60px_rgba(2,6,23,0.16)] backdrop-blur-sm md:px-10">
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div className="max-w-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Music size={16} className="text-gold" />
                </div>
                <span className="font-display text-xl text-cream">Maestro</span>
              </div>
              <p className="text-sm leading-relaxed text-cream/50">
                Professional music education with a calmer interface, clearer rhythm, and less visual heaviness.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-3">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold/75">Platform</p>
                <div className="flex flex-col gap-2">
                  <Link href="/lessons" className="text-cream/60 transition-colors hover:text-cream">Lessons</Link>
                  <Link href="/booking" className="text-cream/60 transition-colors hover:text-cream">Book a Session</Link>
                  <Link href="/pricing" className="text-cream/60 transition-colors hover:text-cream">Pricing</Link>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold/75">Account</p>
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="text-cream/60 transition-colors hover:text-cream">Sign In</Link>
                  <Link href="/register" className="text-cream/60 transition-colors hover:text-cream">Register</Link>
                  <Link href="/dashboard" className="text-cream/60 transition-colors hover:text-cream">Dashboard</Link>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold/75">Legal</p>
                <div className="flex flex-col gap-2">
                  <Link href="/privacy" className="text-cream/60 transition-colors hover:text-cream">Privacy</Link>
                  <Link href="/terms" className="text-cream/60 transition-colors hover:text-cream">Terms</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/40 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Maestro. All rights reserved.</p>
            <p className="tracking-[0.25em] text-cream/30">PRELUDE · SONATA · SYMPHONY</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
