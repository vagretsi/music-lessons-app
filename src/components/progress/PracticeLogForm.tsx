"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const INSTRUMENTS = [
  "Guitar", "Piano", "Bass", "Drums", "Violin", "Cello",
  "Trumpet", "Saxophone", "Voice", "Ukulele", "Other"
];

export function PracticeLogForm() {
  const router = useRouter();
  const [instrument, setInstrument] = useState("");
  const [duration, setDuration] = useState("");
  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const moodLabels = ["Terrible", "Bad", "OK", "Good", "Great"];
  const moodEmojis = ["😤", "😕", "😐", "🙂", "🎉"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/progress/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instrument, duration: parseInt(duration), mood, notes }),
    });

    if (res.ok) {
      setSuccess(true);
      setInstrument("");
      setDuration("");
      setMood(3);
      setNotes("");
      setTimeout(() => {
        setSuccess(false);
        router.refresh();
      }, 2000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🎉</p>
        <p className="font-display text-2xl text-gold">Session logged!</p>
        <p className="text-cream/40 text-sm mt-2">Keep up the great work.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Instrument</label>
        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select instrument...</option>
          {INSTRUMENTS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="input-field"
          placeholder="30"
          min="1"
          max="480"
          required
        />
      </div>

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-3">How did it go?</label>
        <div className="flex gap-3">
          {moodEmojis.map((emoji, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMood(i + 1)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 border transition-all duration-200 ${
                mood === i + 1
                  ? "border-gold bg-gold/10 scale-105"
                  : "border-gold/20 hover:border-gold/40"
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-cream/40 text-xs hidden sm:block">{moodLabels[i]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field resize-none h-24"
          placeholder="What did you work on?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-4 disabled:opacity-50"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "Log Session"}
      </button>
    </form>
  );
}
