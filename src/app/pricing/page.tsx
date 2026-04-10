"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PLANS, formatPrice } from "@/lib/stripe";
import { useLocale } from "@/app/providers";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    key: "PRELUDE" as const,
    features_en: PLANS.PRELUDE ? [
      "5 free video lessons per month",
      "Basic progress tracking",
      "Community access",
      "Mobile & desktop access",
    ] : [],
    features_el: [
      "5 δωρεάν βιντεομαθήματα τον μήνα",
      "Βασική παρακολούθηση προόδου",
      "Πρόσβαση στην κοινότητα",
      "Πρόσβαση από κινητό και υπολογιστή",
    ],
  },
  {
    key: "SONATA" as const,
    featured: true,
    features_en: [
      "Unlimited video lessons",
      "2 live 1-on-1 sessions / month",
      "Full progress tracking & practice log",
      "5 AI feedback sessions / month",
      "Sheet music library",
      "Priority support",
    ],
    features_el: [
      "Απεριόριστα βιντεομαθήματα",
      "2 ζωντανές συνεδρίες 1-ον-1 / μήνα",
      "Πλήρης παρακολούθηση προόδου",
      "5 συνεδρίες AI / μήνα",
      "Βιβλιοθήκη παρτιτούρων",
      "Προτεραιότητα υποστήριξης",
    ],
  },
  {
    key: "SYMPHONY" as const,
    features_en: [
      "Everything in Sonata",
      "Unlimited live 1-on-1 sessions",
      "Unlimited AI feedback",
      "Exclusive masterclasses",
      "Direct teacher messaging",
      "Custom practice plans",
      "Early access to new features",
    ],
    features_el: [
      "Τα πάντα από τη Σονάτα",
      "Απεριόριστες ζωντανές συνεδρίες",
      "Απεριόριστη αξιολόγηση AI",
      "Αποκλειστικά μαστεράτα",
      "Άμεση επικοινωνία με καθηγητή",
      "Εξατομικευμένα πλάνα εξάσκησης",
      "Πρώιμη πρόσβαση σε νέες λειτουργίες",
    ],
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { locale } = useLocale();

  return (
    <div className="min-h-screen px-6 pb-20 pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold/75">Plans</p>
          <h1 className="font-display text-5xl text-cream md:text-6xl">
            {locale === "el" ? "Βρείτε το Ιδανικό Πλάνο" : "Find Your Perfect Plan"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-cream/60">
            {locale === "el"
              ? "Ξεκινήστε δωρεάν και αναβαθμίστε μόνο όταν θέλετε περισσότερο βάθος."
              : "Start free and upgrade only when you want more depth in your routine."}
          </p>
        </div>

        <div className="mb-8 rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="text-sm text-cream/60">
                {locale === "el"
                  ? "Επιλέξτε χρέωση που ταιριάζει στον ρυθμό σας."
                  : "Choose the billing rhythm that fits your schedule."}
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-full border border-white/10 bg-ink/40 px-4 py-3">
              <span className={cn("text-sm transition-colors", billing === "monthly" ? "text-cream" : "text-cream/40")}>
                {locale === "el" ? "Μηνιαία" : "Monthly"}
              </span>
              <button
                onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
                className={cn(
                  "relative h-8 w-16 rounded-full border transition-colors duration-300",
                  billing === "yearly" ? "border-gold/30 bg-gold/20" : "border-white/10 bg-white/5"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 h-6 w-6 rounded-full bg-gold transition-all duration-300",
                    billing === "yearly" ? "left-9" : "left-1"
                  )}
                />
              </button>
              <span className={cn("flex items-center gap-2 text-sm transition-colors", billing === "yearly" ? "text-cream" : "text-cream/40")}>
                {locale === "el" ? "Ετήσια" : "Yearly"}
                <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs text-gold">
                  {locale === "el" ? "−20%" : "Save 20%"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => {
            const plan = PLANS[tier.key];
            const price = billing === "monthly" ? plan.price.monthly : plan.price.yearly;
            const monthlyEquiv = billing === "yearly" ? Math.round(plan.price.yearly / 12) : plan.price.monthly;
            const features = locale === "el" ? tier.features_el : tier.features_en;

            return (
              <div
                key={tier.key}
                className={cn(
                  "relative flex flex-col rounded-[32px] border p-8 transition-all duration-300 backdrop-blur-sm",
                  tier.featured
                    ? "border-gold/30 bg-gold/10 gold-glow md:-translate-y-2"
                    : "border-white/10 bg-white/5 hover:border-gold/25"
                )}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold uppercase tracking-widest text-ink">
                    {locale === "el" ? "Πιο Δημοφιλές" : "Most Popular"}
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="mb-1 font-display text-3xl text-cream">{plan.name}</h2>
                  <p className="text-sm text-cream/40">
                    {locale === "el"
                      ? tier.key === "PRELUDE" ? "Ξεκινήστε το μουσικό σας ταξίδι"
                      : tier.key === "SONATA" ? "Για τον αφοσιωμένο μαθητή"
                      : "Για τον σοβαρό μουσικό"
                      : tier.key === "PRELUDE" ? "Begin your musical journey"
                      : tier.key === "SONATA" ? "For the dedicated student"
                      : "For the serious musician"}
                  </p>
                </div>

                <div className="mb-8">
                  {price === 0 ? (
                    <p className="font-display text-5xl text-cream">
                      {locale === "el" ? "Δωρεάν" : "Free"}
                    </p>
                  ) : (
                    <div>
                      <p className="font-display text-5xl text-cream">
                        {formatPrice(billing === "yearly" ? monthlyEquiv : price)}
                        <span className="font-sans text-lg text-cream/40">/mo</span>
                      </p>
                      {billing === "yearly" && (
                        <p className="mt-1 text-sm text-cream/40">
                          {formatPrice(price)} {locale === "el" ? "ετησίως" : "billed yearly"}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-cream/70">
                      <Check size={14} className="mt-0.5 shrink-0 text-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.key === "PRELUDE" ? "/register" : `/api/stripe/checkout?tier=${tier.key}&billing=${billing}`}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-display transition-all duration-200",
                    tier.featured
                      ? "bg-gold text-ink hover:bg-gold-light"
                      : "border border-white/10 bg-white/5 text-cream hover:border-gold/25 hover:bg-white/10"
                  )}
                >
                  {locale === "el"
                    ? tier.key === "PRELUDE" ? "Ξεκινήστε Δωρεάν" : "Αναβαθμίστε"
                    : tier.key === "PRELUDE" ? "Get Started Free" : "Upgrade Now"}
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-[28px] border border-white/10 bg-white/5 px-6 py-5 text-center text-sm text-cream/40 backdrop-blur-sm">
          {locale === "el"
            ? "Έχετε ερωτήσεις; Επικοινωνήστε μαζί μας και θα σας βοηθήσουμε να διαλέξετε το σωστό πλάνο."
            : "Have questions? Contact us and we’ll help you choose the plan that actually fits."}
        </div>
      </div>
    </div>
  );
}
