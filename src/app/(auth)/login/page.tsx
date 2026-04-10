"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Music, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocale } from "@/app/providers";

export default function LoginPage() {
  const { locale } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    title: locale === "el" ? "Καλώς ορίσατε ξανά" : "Welcome back",
    subtitle: locale === "el" ? "Συνδεθείτε για να συνεχίσετε" : "Sign in to continue",
    email: locale === "el" ? "Email" : "Email",
    password: locale === "el" ? "Κωδικός" : "Password",
    signIn: locale === "el" ? "Σύνδεση" : "Sign In",
    noAccount: locale === "el" ? "Δεν έχετε λογαριασμό;" : "Don't have an account?",
    register: locale === "el" ? "Εγγραφείτε" : "Create one",
    error: locale === "el" ? "Λάθος email ή κωδικός." : "Invalid email or password.",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t.error);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen px-6 pb-14 pt-24 staff-lines">
      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-gold/75">
            <Music size={14} className="text-gold" />
            {locale === "el" ? "Συνεχίστε τη ρουτίνα σας" : "Continue your routine"}
          </div>
          <h1 className="font-display text-4xl text-cream md:text-5xl">{t.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-cream/60">
            {locale === "el"
              ? "Μπείτε ξανά στο dashboard σας και συνεχίστε από εκεί που σταματήσατε."
              : "Get back to your dashboard and continue exactly where you left off."}
          </p>

          <div className="mt-8 space-y-4">
            {[
              locale === "el" ? "Συνεχίστε lessons και practice logs" : "Continue lessons and practice logs",
              locale === "el" ? "Κλείστε νέα live sessions" : "Book new live sessions",
              locale === "el" ? "Δείτε πρόοδο και AI feedback" : "Review progress and AI feedback",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream/60">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[32px] p-7 md:p-9">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Music size={22} className="text-gold" />
            </div>
            <h2 className="font-display text-3xl text-cream">{t.title}</h2>
            <p className="mt-2 text-cream/40">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/60">
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/60">
                {t.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 transition-colors hover:text-cream/60"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : t.signIn}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-cream/40">
            {t.noAccount}{" "}
            <Link href="/register" className="text-gold transition-colors hover:text-gold-light">
              {t.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
