"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  userId: string;
  currentRole: string;
}

export function UserRoleSelect({ userId, currentRole }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    await fetch("/api/admin/users/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: e.target.value }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 size={12} className="animate-spin text-gold" />}
      <select
        defaultValue={currentRole}
        onChange={handleChange}
        disabled={loading}
        className="bg-ink-50 border border-gold/20 text-cream text-xs px-2 py-1.5 focus:outline-none focus:border-gold/60 transition-colors"
      >
        <option value="STUDENT">STUDENT</option>
        <option value="TEACHER">TEACHER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
    </div>
  );
}
