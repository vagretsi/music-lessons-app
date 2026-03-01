"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LessonStatusToggle({ lessonId, currentStatus }: { lessonId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/admin/lessons/${lessonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <button onClick={toggle} disabled={loading} className="flex items-center gap-2">
      {loading ? (
        <Loader2 size={12} className="animate-spin text-gold" />
      ) : (
        <span className={`text-xs px-2 py-0.5 border cursor-pointer transition-colors ${
          currentStatus === "PUBLISHED"
            ? "border-green-400/50 text-green-400 hover:border-red-400/50 hover:text-red-400"
            : "border-cream/20 text-cream/40 hover:border-green-400/50 hover:text-green-400"
        }`}>
          {currentStatus}
        </span>
      )}
    </button>
  );
}
