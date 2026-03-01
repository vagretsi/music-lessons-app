"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, X } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const INSTRUMENTS_LIST = ["Guitar", "Piano", "Bass", "Drums", "Violin", "Cello", "Trumpet", "Saxophone", "Voice", "Ukulele"];

export function TeacherForm({ users }: { users: User[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    userId: users[0]?.id ?? "",
    bio: "",
    bioEl: "",
    instruments: [] as string[],
    experience: "",
  });

  const [availability, setAvailability] = useState<{ dayOfWeek: number; startTime: string; endTime: string }[]>([]);
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

  const addAvailability = () => {
    setAvailability((prev) => [...prev, { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }]);
  };

  const updateAvailability = (index: number, key: string, value: string | number) => {
    setAvailability((prev) => prev.map((a, i) => i === index ? { ...a, [key]: value } : a));
  };

  const removeAvailability = (index: number) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, experience: form.experience || null, availability }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/admin/teachers");
    router.refresh();
  };

  if (users.length === 0) {
    return (
      <div className="card-dark max-w-2xl">
        <p className="text-yellow-400 text-sm">
          ⚠️ No users with TEACHER role found. Go to <strong>Users</strong> and change a user's role to TEACHER first, then come back here.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">User Account *</label>
        <select
          value={form.userId}
          onChange={(e) => setForm((prev) => ({ ...prev, userId: e.target.value }))}
          className="input-field"
          required
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
        <p className="text-cream/20 text-xs mt-1">Only users with TEACHER role appear here.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Bio (EN)</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            className="input-field resize-none h-28"
            placeholder="Teacher bio in English..."
          />
        </div>
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Bio (ΕΛ)</label>
          <textarea
            value={form.bioEl}
            onChange={(e) => setForm((prev) => ({ ...prev, bioEl: e.target.value }))}
            className="input-field resize-none h-28"
            placeholder="Βιογραφικό στα ελληνικά..."
          />
        </div>
      </div>

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Years of Experience</label>
        <input
          type="number"
          value={form.experience}
          onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
          className="input-field max-w-xs"
          placeholder="10"
          min="0"
        />
      </div>

      {/* Instruments */}
      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Instruments</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.instruments.map((i) => (
            <span key={i} className="flex items-center gap-1 border border-gold/30 text-gold text-xs px-3 py-1">
              {i}
              <button type="button" onClick={() => removeInstrument(i)}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <select
            value={newInstrument}
            onChange={(e) => setNewInstrument(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">Select instrument...</option>
            {INSTRUMENTS_LIST.filter((i) => !form.instruments.includes(i)).map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <button type="button" onClick={() => addInstrument(newInstrument)} className="btn-secondary px-4 py-2 text-sm">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Availability */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-cream/60 text-xs tracking-widest uppercase">Availability</label>
          <button type="button" onClick={addAvailability} className="btn-secondary text-xs py-1.5 px-3">
            <Plus size={12} /> Add Day
          </button>
        </div>
        <div className="space-y-3">
          {availability.map((slot, i) => (
            <div key={i} className="flex items-center gap-3 border border-gold/10 p-3">
              <select
                value={slot.dayOfWeek}
                onChange={(e) => updateAvailability(i, "dayOfWeek", parseInt(e.target.value))}
                className="input-field flex-1"
              >
                {DAYS.map((day, idx) => <option key={idx} value={idx}>{day}</option>)}
              </select>
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => updateAvailability(i, "startTime", e.target.value)}
                className="input-field w-32"
              />
              <span className="text-cream/40 text-sm">to</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => updateAvailability(i, "endTime", e.target.value)}
                className="input-field w-32"
              />
              <button type="button" onClick={() => removeAvailability(i)} className="text-red-400/60 hover:text-red-400">
                <X size={16} />
              </button>
            </div>
          ))}
          {availability.length === 0 && (
            <p className="text-cream/20 text-sm">No availability set. Students won't be able to book this teacher.</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary py-3 px-8 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={16} /> Create Teacher</>}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary py-3 px-6">
          Cancel
        </button>
      </div>
    </form>
  );
}
