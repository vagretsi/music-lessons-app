"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, X } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const INSTRUMENTS_LIST = ["Guitar", "Piano", "Bass", "Drums", "Violin", "Cello", "Trumpet", "Saxophone", "Voice", "Ukulele"];

interface Teacher {
  id: string;
  bio?: string;
  bioEl?: string;
  instruments: string[];
  experience?: number;
  isActive: boolean;
  availability: { id: string; dayOfWeek: number; startTime: string; endTime: string }[];
}

export function TeacherEditForm({ teacher }: { teacher: Teacher }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    bio: teacher.bio ?? "",
    bioEl: teacher.bioEl ?? "",
    instruments: teacher.instruments,
    experience: teacher.experience?.toString() ?? "",
    isActive: teacher.isActive,
  });

  const [newInstrument, setNewInstrument] = useState("");

  const addInstrument = (instrument: string) => {
    if (instrument && !form.instruments.includes(instrument)) {
      setForm((prev) => ({ ...prev, instruments: [...prev.instruments, instrument] }));
    }
    setNewInstrument("");
  };

  const removeInstrument = (i: string) => {
    setForm((prev) => ({ ...prev, instruments: prev.instruments.filter((x) => x !== i) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/teachers/${teacher.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, experience: form.experience || null }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && <div className="border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 text-sm">{error}</div>}
      {success && <div className="border border-green-500/30 bg-green-500/10 text-green-400 px-4 py-3 text-sm">✓ Saved successfully!</div>}

      <div className="flex items-center gap-4">
        <label className="text-cream/60 text-xs tracking-widest uppercase">Status:</label>
        <button
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
          className={`text-xs px-3 py-1.5 border transition-colors ${form.isActive ? "border-green-400/50 text-green-400" : "border-red-400/50 text-red-400"}`}
        >
          {form.isActive ? "Active" : "Inactive"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Bio (EN)</label>
          <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} className="input-field resize-none h-28" />
        </div>
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Bio (ΕΛ)</label>
          <textarea value={form.bioEl} onChange={(e) => setForm((p) => ({ ...p, bioEl: e.target.value }))} className="input-field resize-none h-28" />
        </div>
      </div>

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Years of Experience</label>
        <input type="number" value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} className="input-field max-w-xs" min="0" />
      </div>

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Instruments</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.instruments.map((i) => (
            <span key={i} className="flex items-center gap-1 border border-gold/30 text-gold text-xs px-3 py-1">
              {i}
              <button type="button" onClick={() => removeInstrument(i)}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <select value={newInstrument} onChange={(e) => setNewInstrument(e.target.value)} className="input-field max-w-xs">
            <option value="">Add instrument...</option>
            {INSTRUMENTS_LIST.filter((i) => !form.instruments.includes(i)).map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <button type="button" onClick={() => addInstrument(newInstrument)} className="btn-secondary px-4 py-2 text-sm">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary py-3 px-8 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
        </button>
        <button type="button" onClick={() => router.push("/admin/teachers")} className="btn-secondary py-3 px-6">
          Back
        </button>
      </div>
    </form>
  );
}
