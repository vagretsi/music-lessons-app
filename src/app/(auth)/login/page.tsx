"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Music, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocale } from "@/app/providers";

export default function LoginPage() {
  const { locale } = useLocale();
  const router = useRouter();
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
    <div className="min-h-screen flex items-center justify-center px-6 pt-16 staff-lines">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 border border-gold/30 items-center justify-center mb-4">
            <Music size={20} className="text-gold" />
          </div>
          <h1 className="font-display text-4xl text-cream mb-2">{t.title}</h1>
          <p className="text-cream/40">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">
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
            <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60"
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

        <p className="text-center mt-8 text-cream/40 text-sm">
          {t.noAccount}{" "}
          <Link href="/register" className="text-gold hover:text-gold-light transition-colors">
            {t.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
