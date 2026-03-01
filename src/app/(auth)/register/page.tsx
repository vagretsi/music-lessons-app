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
    <div className="min-h-screen flex items-center justify-center px-6 pt-16 staff-lines">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 border border-gold/30 items-center justify-center mb-4">
            <Music size={20} className="text-gold" />
          </div>
          <h1 className="font-display text-4xl text-cream mb-2">
            {locale === "el" ? "Δημιουργήστε λογαριασμό" : "Create your account"}
          </h1>
          <p className="text-cream/40">
            {locale === "el" ? "Ξεκινήστε δωρεάν σήμερα" : "Start free today"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">
              {locale === "el" ? "Πλήρες Όνομα" : "Full Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder={locale === "el" ? "Γιώργος Παπαδόπουλος" : "John Smith"}
              required
            />
          </div>

          <div>
            <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Email</label>
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
            <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">
              {locale === "el" ? "Κωδικός" : "Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="Min. 8 characters"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Free tier note */}
          <div className="border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-cream/60">
            <span className="text-gold">✦ Prelude</span> —{" "}
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

        <p className="text-center mt-8 text-cream/40 text-sm">
          {locale === "el" ? "Έχετε ήδη λογαριασμό;" : "Already have an account?"}{" "}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            {locale === "el" ? "Συνδεθείτε" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
