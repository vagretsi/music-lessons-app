import Link from "next/link";
import { Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold/10 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 border border-gold/50 flex items-center justify-center">
                <Music size={14} className="text-gold" />
              </div>
              <span className="font-display text-lg text-cream">Maestro</span>
            </div>
            <p className="text-cream/40 text-sm max-w-xs leading-relaxed">
              Professional music education, online and on demand.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <p className="text-gold/60 tracking-widest uppercase text-xs mb-3">Platform</p>
              <div className="flex flex-col gap-2">
                <Link href="/lessons" className="text-cream/50 hover:text-cream transition-colors">Lessons</Link>
                <Link href="/booking" className="text-cream/50 hover:text-cream transition-colors">Book a Session</Link>
                <Link href="/pricing" className="text-cream/50 hover:text-cream transition-colors">Pricing</Link>
              </div>
            </div>
            <div>
              <p className="text-gold/60 tracking-widest uppercase text-xs mb-3">Account</p>
              <div className="flex flex-col gap-2">
                <Link href="/login" className="text-cream/50 hover:text-cream transition-colors">Sign In</Link>
                <Link href="/register" className="text-cream/50 hover:text-cream transition-colors">Register</Link>
                <Link href="/dashboard" className="text-cream/50 hover:text-cream transition-colors">Dashboard</Link>
              </div>
            </div>
            <div>
              <p className="text-gold/60 tracking-widest uppercase text-xs mb-3">Legal</p>
              <div className="flex flex-col gap-2">
                <Link href="/privacy" className="text-cream/50 hover:text-cream transition-colors">Privacy</Link>
                <Link href="/terms" className="text-cream/50 hover:text-cream transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-cream/30 text-xs">
          <p>© {new Date().getFullYear()} Maestro. All rights reserved.</p>
          <p className="tracking-widest">PRELUDE · SONATA · SYMPHONY</p>
        </div>
      </div>
    </footer>
  );
}
