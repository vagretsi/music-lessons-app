"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

interface Teacher {
  id: string;
  user: { name: string };
}

interface Props {
  teachers: Teacher[];
  lesson?: {
    id: string;
    title: string;
    titleEl?: string;
    description?: string;
    descriptionEl?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
    instrument?: string;
    level?: string;
    tier: string;
    teacherId: string;
    order: number;
  };
}

export function LessonForm({ teachers, lesson }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: lesson?.title ?? "",
    titleEl: lesson?.titleEl ?? "",
    description: lesson?.description ?? "",
    descriptionEl: lesson?.descriptionEl ?? "",
    videoUrl: lesson?.videoUrl ?? "",
    thumbnailUrl: lesson?.thumbnailUrl ?? "",
    duration: lesson?.duration?.toString() ?? "",
    instrument: lesson?.instrument ?? "",
    level: lesson?.level ?? "beginner",
    tier: lesson?.tier ?? "PRELUDE",
    teacherId: lesson?.teacherId ?? teachers[0]?.id ?? "",
    order: lesson?.order?.toString() ?? "0",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = lesson ? `/api/admin/lessons/${lesson.id}` : "/api/admin/lessons";
    const method = lesson ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        duration: form.duration ? parseInt(form.duration) : null,
        order: parseInt(form.order),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/admin/lessons");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 text-sm">{error}</div>
      )}

      {teachers.length === 0 && (
        <div className="border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 px-4 py-3 text-sm">
          ⚠️ No teachers yet. Create a teacher profile first.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Title (EN) *</label>
          <input type="text" value={form.title} onChange={set("title")} className="input-field" required />
        </div>
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Title (ΕΛ)</label>
          <input type="text" value={form.titleEl} onChange={set("titleEl")} className="input-field" placeholder="Greek title..." />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Description (EN)</label>
          <textarea value={form.description} onChange={set("description")} className="input-field resize-none h-28" />
        </div>
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Description (ΕΛ)</label>
          <textarea value={form.descriptionEl} onChange={set("descriptionEl")} className="input-field resize-none h-28" placeholder="Greek description..." />
        </div>
      </div>

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Video URL</label>
        <input type="url" value={form.videoUrl} onChange={set("videoUrl")} className="input-field" placeholder="https://..." />
        <p className="text-cream/20 text-xs mt-1">YouTube, Vimeo, or direct video URL</p>
      </div>

      <div>
        <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Thumbnail URL</label>
        <input type="url" value={form.thumbnailUrl} onChange={set("thumbnailUrl")} className="input-field" placeholder="https://..." />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Duration (min)</label>
          <input type="number" value={form.duration} onChange={set("duration")} className="input-field" placeholder="30" min="1" />
        </div>
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Instrument</label>
          <input type="text" value={form.instrument} onChange={set("instrument")} className="input-field" placeholder="Guitar..." />
        </div>
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Level</label>
          <select value={form.level} onChange={set("level")} className="input-field">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Order</label>
          <input type="number" value={form.order} onChange={set("order")} className="input-field" min="0" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Tier (Access Level)</label>
          <select value={form.tier} onChange={set("tier")} className="input-field">
            <option value="PRELUDE">Prelude (Free)</option>
            <option value="SONATA">Sonata+</option>
            <option value="SYMPHONY">Symphony only</option>
          </select>
        </div>
        <div>
          <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">Teacher *</label>
          <select value={form.teacherId} onChange={set("teacherId")} className="input-field" required>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.user.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || teachers.length === 0}
          className="btn-primary py-3 px-8 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={16} /> {lesson ? "Save Changes" : "Create Lesson"}</>}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary py-3 px-6"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
