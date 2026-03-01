import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PLANS = {
  PRELUDE: {
    name: "Prelude",
    tier: "PRELUDE" as const,
    price: { monthly: 0, yearly: 0 },
    priceId: { monthly: null, yearly: null },
  },
  SONATA: {
    name: "Sonata",
    tier: "SONATA" as const,
    price: { monthly: 1499, yearly: 14390 }, // cents
    priceId: {
      monthly: process.env.STRIPE_PRICE_SONATA_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_SONATA_YEARLY!,
    },
  },
  SYMPHONY: {
    name: "Symphony",
    tier: "SYMPHONY" as const,
    price: { monthly: 2999, yearly: 28790 }, // cents
    priceId: {
      monthly: process.env.STRIPE_PRICE_SYMPHONY_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_SYMPHONY_YEARLY!,
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingInterval = "monthly" | "yearly";

export function formatPrice(cents: number, currency = "eur"): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
