"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function UserSubscriptionSelect({ userId, currentTier }: { userId: string; currentTier: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    await fetch("/api/admin/users/subscription", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, tier: e.target.value }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 size={12} className="animate-spin text-gold" />}
      <select
        defaultValue={currentTier}
        onChange={handleChange}
        disabled={loading}
        className="bg-ink-50 border border-gold/20 text-cream text-xs px-2 py-1.5 focus:outline-none focus:border-gold/60 transition-colors"
      >
        <option value="PRELUDE">PRELUDE</option>
        <option value="SONATA">SONATA</option>
        <option value="SYMPHONY">SYMPHONY</option>
      </select>
    </div>
  );
}