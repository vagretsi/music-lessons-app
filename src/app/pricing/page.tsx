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
    <div className="min-h-screen pt-24 pb-20 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-gold/60 tracking-[0.3em] uppercase text-xs mb-4">Plans</p>
        <h1 className="font-display text-5xl md:text-6xl text-cream mb-4">
          {locale === "el" ? "Βρείτε το Ιδανικό Πλάνο" : "Find Your Perfect Plan"}
        </h1>
        <p className="text-cream/50 text-lg">
          {locale === "el"
            ? "Ξεκινήστε δωρεάν, αναβαθμίστε όταν είστε έτοιμοι."
            : "Start free, upgrade when you're ready."}
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={cn("text-sm", billing === "monthly" ? "text-cream" : "text-cream/40")}>
            {locale === "el" ? "Μηνιαία" : "Monthly"}
          </span>
          <button
            onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
            className={cn(
              "relative w-14 h-7 border border-gold/30 transition-colors duration-300",
              billing === "yearly" ? "bg-gold/20" : "bg-ink-50"
            )}
          >
            <div
              className={cn(
                "absolute top-1 w-5 h-5 bg-gold transition-all duration-300",
                billing === "yearly" ? "left-8" : "left-1"
              )}
            />
          </button>
          <span className={cn("text-sm flex items-center gap-2", billing === "yearly" ? "text-cream" : "text-cream/40")}>
            {locale === "el" ? "Ετήσια" : "Yearly"}
            <span className="bg-gold/20 text-gold text-xs px-2 py-0.5 border border-gold/30">
              {locale === "el" ? "−20%" : "Save 20%"}
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const plan = PLANS[tier.key];
          const price = billing === "monthly" ? plan.price.monthly : plan.price.yearly;
          const monthlyEquiv = billing === "yearly" ? Math.round(plan.price.yearly / 12) : plan.price.monthly;
          const features = locale === "el" ? tier.features_el : tier.features_en;

          return (
            <div
              key={tier.key}
              className={cn(
                "relative flex flex-col p-8 border transition-all duration-300",
                tier.featured
                  ? "border-gold bg-gold/5 gold-glow"
                  : "border-gold/20 hover:border-gold/40"
              )}
            >
              {tier.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-ink text-xs px-4 py-1 font-bold tracking-widest uppercase">
                  {locale === "el" ? "Πιο Δημοφιλές" : "Most Popular"}
                </div>
              )}

              <div className="mb-6">
                <h2 className="font-display text-3xl text-cream mb-1">{plan.name}</h2>
                <p className="text-cream/40 text-sm">
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
                      <span className="text-lg text-cream/40 font-sans">/mo</span>
                    </p>
                    {billing === "yearly" && (
                      <p className="text-cream/40 text-sm mt-1">
                        {formatPrice(price)} {locale === "el" ? "ετησίως" : "billed yearly"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-cream/70">
                    <Check size={14} className="text-gold mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.key === "PRELUDE" ? "/register" : `/api/stripe/checkout?tier=${tier.key}&billing=${billing}`}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-6 font-serif tracking-wide transition-all duration-200 text-sm",
                  tier.featured
                    ? "bg-gold text-ink hover:bg-gold-light"
                    : "border border-gold/40 text-gold hover:bg-gold/10"
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

      {/* FAQ stub */}
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <p className="text-cream/30 text-sm">
          {locale === "el"
            ? "Έχετε ερωτήσεις; Επικοινωνήστε μαζί μας."
            : "Have questions? Contact us anytime."}
        </p>
      </div>
    </div>
  );
}
