"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLocale } from "@/app/providers";
import { TIME_ZONE } from "@/lib/availability";

type Booking = {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  notes: string | null;
  student: { name: string | null };
};

export function TeacherDashboard({ name, bookings }: { name: string | null; bookings: Booking[] }) {
  const { locale } = useLocale();
  const el = locale === "el";
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const dateLocale = el ? "el-GR" : "en-GB";
  const time = (date: Date) => date.toLocaleTimeString(dateLocale, { timeZone: TIME_ZONE, hour12: false, hour: "2-digit", minute: "2-digit" });
  return <div className="mx-auto max-w-5xl px-6 py-16">
    <p className="text-sm text-gold">{el ? "Ο χώρος του καθηγητή" : "Teacher space"}</p>
    <h1 className="mt-3 text-3xl font-display">{el ? "Καλώς ήρθες" : "Welcome"}{name ? `, ${name}` : ""}</h1>
    <div className="my-8 flex flex-wrap items-center justify-between gap-4 card-dark">
      <div><h2 className="text-xl">{el ? "Η διαθεσιμότητά μου" : "My availability"}</h2><p className="mt-2 text-sm text-cream/60">{el ? "Όρισε τις ημέρες και ώρες που διδάσκεις." : "Set your weekly teaching hours."}</p></div>
      <Link className="btn-primary" href="/availability">{el ? "Ρύθμιση ωραρίου" : "Manage hours"}</Link>
    </div>
    <section aria-labelledby="teacher-bookings">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="teacher-bookings" className="text-2xl">{el ? "Οι κρατήσεις των μαθητών σου" : "Your students’ bookings"}</h2>
        <button className="btn-secondary" disabled={refreshing} onClick={() => startTransition(() => router.refresh())}>{refreshing ? (el ? "Ανανέωση…" : "Refreshing…") : (el ? "Ανανέωση" : "Refresh")}</button>
      </div>
      <p className="mt-3 mb-6 text-sm text-cream/60">{el ? "Τρέχοντα και επόμενα μαθήματα · Ώρα Ελλάδας (Europe/Athens)" : "Current and upcoming lessons · Greece time (Europe/Athens)"}</p>
      {bookings.length === 0 ? <p className="card-dark text-cream/60">{el ? "Δεν έχεις κρατήσεις μαθητών αυτή τη στιγμή." : "You have no student bookings at the moment."}</p> : <div className="space-y-4">{bookings.map(booking => {
        const start = new Date(booking.scheduledAt);
        const end = new Date(start.getTime() + booking.duration * 60000);
        return <article className="card-dark" key={booking.id}>
          <div className="flex flex-wrap justify-between gap-4">
            <div><h3 className="text-lg">{booking.student.name || (el ? "Μαθητής" : "Student")}</h3><p className="mt-2 text-cream/70">{start.toLocaleDateString(dateLocale, { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p><p className="mt-1 text-gold">{time(start)} – {time(end)} <span className="text-sm text-cream/60">· {booking.duration} {el ? "λεπτά" : "min"}</span></p></div>
            <span className="text-sm text-cream/60">{booking.status === "CONFIRMED" ? (el ? "Επιβεβαιωμένη" : "Confirmed") : (el ? "Σε αναμονή" : "Pending")}</span>
          </div>
          {booking.notes && <p className="mt-4 whitespace-pre-wrap break-words border-t border-white/10 pt-4 text-sm text-cream/70">{booking.notes}</p>}
        </article>;
      })}</div>}
    </section>
  </div>;
}
