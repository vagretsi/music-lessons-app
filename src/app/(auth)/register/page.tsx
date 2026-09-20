"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocale } from "@/app/providers";

export default function RegisterPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
    } else {
      router.push("/login?registered=1");
    }
  };

  return (
    <div className="min-h-screen px-6 pt-24 pb-14 staff-lines">
      <div className="mx-auto w-full max-w-md">
        <div className="glass rounded-[32px] p-7 md:p-9">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Music size={22} className="text-gold" />
            </div>
            <h1 className="font-display text-3xl text-cream">
              {locale === "el" ? "Ξεκινήστε δωρεάν σήμερα" : "Start free today"}
            </h1>
            <p className="mt-2 text-cream/40">
              {locale === "el" ? "Θα βρίσκεστε στο δωρεάν πλάνο μέχρι να αναβαθμίσετε." : "You’ll stay on the free plan until you decide to upgrade."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/60">
                {locale === "el" ? "Πλήρες Όνομα" : "Full Name"}
              </label>
              <input
                type="text"
                aria-label={locale === "el" ? "Ονοματεπώνυμο" : "Full name"}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder={locale === "el" ? "Γιώργος Παπαδόπουλος" : "John Smith"}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                aria-label="Email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/60">
                {locale === "el" ? "Κωδικός" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label={locale === "el" ? "Κωδικός" : "Password"}
                  autoComplete="new-password"
                  className="input-field pr-12"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 transition-colors hover:text-cream/60"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-cream/70">
              <span className="font-medium text-gold">Prelude</span> —{" "}
              {locale === "el"
                ? "Ξεκινάτε με το δωρεάν πλάνο. Αναβαθμίστε ανά πάσα στιγμή."
                : "You'll start on the free plan. Upgrade anytime."}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : locale === "el" ? (
                "Δημιουργία Λογαριασμού"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-cream/40">
            {locale === "el" ? "Έχετε ήδη λογαριασμό;" : "Already have an account?"}{" "}
            <Link href="/login" className="text-gold transition-colors hover:text-gold-light">
              {locale === "el" ? "Συνδεθείτε" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
