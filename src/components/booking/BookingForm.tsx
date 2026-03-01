"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, Loader2, CheckCircle2 } from "lucide-react";

interface Teacher {
  id: string;
  user: { name: string; image?: string };
  instruments: string[];
  bio?: string;
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getTimeSlots(start: string, end: string): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let hour = sh;
  let min = sm;
  while (hour < eh || (hour === eh && min < em)) {
    slots.push(`${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
    min += 60;
    if (min >= 60) { hour++; min = 0; }
  }
  return slots;
}

export function BookingForm({ teachers, userId }: { teachers: Teacher[]; userId: string }) {
  const router = useRouter();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const getAvailableSlots = () => {
    if (!selectedTeacher || !selectedDate) return [];
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const avail = selectedTeacher.availability.find((a) => a.dayOfWeek === dayOfWeek);
    if (!avail) return [];
    return getTimeSlots(avail.startTime, avail.endTime);
  };

  const availableSlots = getAvailableSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedDate || !selectedTime) return;
    setLoading(true);

    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId: selectedTeacher.id,
        scheduledAt: scheduledAt.toISOString(),
        notes,
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-24">
        <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
        <h2 className="font-display text-4xl text-cream mb-2">Booking Confirmed!</h2>
        <p className="text-cream/40">You'll receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Select Teacher */}
      <div>
        <h2 className="font-display text-2xl text-cream mb-4 flex items-center gap-2">
          <span className="w-8 h-8 border border-gold/40 flex items-center justify-center text-gold text-sm">1</span>
          Select a Teacher
        </h2>
        {teachers.length === 0 ? (
          <p className="text-cream/40">No teachers available at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => { setSelectedTeacher(teacher); setSelectedTime(""); }}
                className={`text-left p-5 border transition-all duration-200 ${
                  selectedTeacher?.id === teacher.id
                    ? "border-gold bg-gold/5"
                    : "border-gold/20 hover:border-gold/40"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <User size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-cream font-medium">{teacher.user.name}</p>
                    <p className="text-cream/40 text-xs">{teacher.instruments.join(", ")}</p>
                  </div>
                </div>
                {teacher.bio && <p className="text-cream/40 text-sm line-clamp-2">{teacher.bio}</p>}
                <div className="mt-3 flex flex-wrap gap-1">
                  {teacher.availability.map((a) => (
                    <span key={a.dayOfWeek} className="text-gold/50 text-xs border border-gold/20 px-2 py-0.5">
                      {DAYS[a.dayOfWeek].slice(0, 3)}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Select Date */}
      {selectedTeacher && (
        <div>
          <h2 className="font-display text-2xl text-cream mb-4 flex items-center gap-2">
            <span className="w-8 h-8 border border-gold/40 flex items-center justify-center text-gold text-sm">2</span>
            Select a Date
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
            min={today}
            className="input-field max-w-xs"
          />
          {selectedDate && availableSlots.length === 0 && (
            <p className="text-cream/40 text-sm mt-3">
              {selectedTeacher.user.name} is not available on {DAYS[new Date(selectedDate).getDay()]}s.
            </p>
          )}
        </div>
      )}

      {/* Step 3: Select Time */}
      {availableSlots.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-cream mb-4 flex items-center gap-2">
            <span className="w-8 h-8 border border-gold/40 flex items-center justify-center text-gold text-sm">3</span>
            Select a Time
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className={`px-4 py-2 border text-sm font-serif transition-all duration-200 ${
                  selectedTime === slot
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-gold/20 text-cream/60 hover:border-gold/40"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes & Submit */}
      {selectedTeacher && selectedDate && selectedTime && (
        <div>
          <h2 className="font-display text-2xl text-cream mb-4 flex items-center gap-2">
            <span className="w-8 h-8 border border-gold/40 flex items-center justify-center text-gold text-sm">4</span>
            Confirm Booking
          </h2>

          {/* Summary */}
          <div className="border border-gold/20 bg-gold/5 p-5 mb-5 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User size={14} className="text-gold" />
              <span className="text-cream/60">Teacher:</span>
              <span className="text-cream">{selectedTeacher.user.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-gold" />
              <span className="text-cream/60">Date:</span>
              <span className="text-cream">{new Date(selectedDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-gold" />
              <span className="text-cream/60">Time:</span>
              <span className="text-cream">{selectedTime} · 60 min</span>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-cream/60 text-xs tracking-widest uppercase mb-2">
              Notes for your teacher (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field resize-none h-24"
              placeholder="What would you like to work on?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-4 px-8 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Confirm Booking"}
          </button>
        </div>
      )}
    </form>
  );
}
