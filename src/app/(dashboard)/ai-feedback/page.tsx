"use client";

import { useState } from "react";
import { Sparkles, Upload, Loader2, Music } from "lucide-react";
import { useLocale } from "@/app/providers";

export default function AIFeedbackPage() {
  const { locale } = useLocale();
  const [instrument, setInstrument] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const INSTRUMENTS = ["Guitar", "Piano", "Bass", "Drums", "Violin", "Violin", "Trumpet", "Voice", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFeedback("");

    const res = await fetch("/api/ai-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instrument, description }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
    } else {
      setFeedback(data.feedback);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">AI-Powered</p>
          <h1 className="font-display text-5xl text-cream mb-3 flex items-center gap-3">
            AI Feedback
            <Sparkles size={28} className="text-gold" />
          </h1>
          <p className="text-cream/40">
            Describe your playing or a specific challenge, and receive expert-level feedback powered by AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Instrument</label>
            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select your instrument...</option>
              {INSTRUMENTS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">
              Describe what you're working on
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none h-36"
              placeholder="e.g. I'm struggling with the F chord transition on guitar. My fingers don't move quickly enough and I lose the rhythm. I've been playing for 3 months..."
              required
              minLength={20}
            />
            <p className="text-cream/20 text-xs mt-1">Be as specific as possible for better feedback.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-4 px-8 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Get AI Feedback
              </>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-8 border border-red-500/30 bg-red-500/10 text-red-400 px-5 py-4">
            {error}
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="mt-8 border border-gold/30 bg-gold/5 p-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={18} className="text-gold" />
              <h2 className="font-display text-2xl text-cream">Your Feedback</h2>
            </div>
            <div className="text-cream/80 leading-relaxed whitespace-pre-wrap font-sans">
              {feedback}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
