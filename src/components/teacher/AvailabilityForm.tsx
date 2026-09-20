"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, X, Loader2 } from "lucide-react";
import { useLocale } from "@/app/providers";
import { AvailabilitySlot, availabilitySchema } from "@/lib/availability";

export function AvailabilityForm({ initialSlots }: { initialSlots: AvailabilitySlot[] }) {
  const { locale } = useLocale();
  const el = locale === "el";
  const router = useRouter();
  const [slots, setSlots] = useState(initialSlots);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const days = el ? ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"] : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const update = (index: number, change: Partial<AvailabilitySlot>) => { setMessage(""); setSlots(slots.map((s, i) => i === index ? { ...s, ...change } : s)); };
  async function save(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    if (!availabilitySchema.safeParse(slots).success) { setMessage(el ? "Κάθε διάστημα πρέπει να διαρκεί τουλάχιστον 60 λεπτά, χωρίς επικαλύψεις την ίδια ημέρα." : "Each period must last at least 60 minutes, without overlaps on the same day."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/teacher/availability", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(slots) });
      if (!res.ok) throw new Error();
      setMessage(el ? "Η διαθεσιμότητά σου αποθηκεύτηκε." : "Your availability has been saved.");
      router.refresh();
    } catch { setMessage(el ? "Η αποθήκευση απέτυχε. Δοκίμασε ξανά." : "Could not save. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="mx-auto max-w-3xl px-6 py-16">
    <Link href="/dashboard" className="text-sm text-cream/60">{el ? "← Ο χώρος μου" : "← My space"}</Link>
    <h1 className="mt-6 text-3xl font-display">{el ? "Η διαθεσιμότητά μου" : "My availability"}</h1>
    <p className="mt-4 text-cream/60">{el ? "Όρισε τις ημέρες και ώρες που διδάσκεις κάθε εβδομάδα. Ώρα Ελλάδας (Europe/Athens). Τα μαθήματα διαρκούν 60 λεπτά." : "Set your weekly teaching hours. Greece time (Europe/Athens). Lessons last 60 minutes."}</p>
    <form onSubmit={save} className="mt-8 space-y-6">
      <fieldset disabled={busy} className="space-y-4">
        {slots.length === 0 && <p className="card-dark text-cream/60">{el ? "Δεν έχεις ορίσει διαθέσιμες ώρες. Πρόσθεσε ένα διάστημα για να δέχεσαι κρατήσεις." : "No hours set. Add a period to accept bookings."}</p>}
        {slots.map((slot, i) => <div key={i} className="card-dark flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-36 text-sm">{el ? "Ημέρα" : "Day"}<select className="input-field mt-2" value={slot.dayOfWeek} onChange={e => update(i, { dayOfWeek: Number(e.target.value) })}>{days.map((d, day) => <option value={day} key={day}>{d}</option>)}</select></label>
          <label className="text-sm">{el ? "Από" : "From"}<input required type="time" className="input-field mt-2" value={slot.startTime} onChange={e => update(i, { startTime: e.target.value })} /></label>
          <label className="text-sm">{el ? "Έως" : "Until"}<input required type="time" className="input-field mt-2" value={slot.endTime} onChange={e => update(i, { endTime: e.target.value })} /></label>
          <button type="button" className="p-3" aria-label={el ? "Αφαίρεση διαστήματος" : "Remove period"} onClick={() => { setSlots(slots.filter((_, index) => index !== i)); setMessage(""); }}><X size={20} /></button>
        </div>)}
        <button type="button" disabled={slots.length >= 28} className="btn-secondary" onClick={() => { setSlots([...slots, { dayOfWeek: 1, startTime: "09:00", endTime: "10:00" }]); setMessage(""); }}><Plus size={16} />{el ? "Προσθήκη ωρών" : "Add hours"}</button>
      </fieldset>
      <p className="text-sm text-cream/60">{el ? "Οι ήδη επιβεβαιωμένες κρατήσεις παραμένουν ως έχουν. Αν αφαιρέσεις όλες τις ώρες, δεν θα δέχεσαι νέες κρατήσεις." : "Existing confirmed bookings remain unchanged. Remove all hours to stop accepting new bookings."}</p>
      {message && <p role="status">{message}</p>}
      <button disabled={busy} className="btn-primary" type="submit">{busy && <Loader2 size={16} className="animate-spin" />}{el ? "Αποθήκευση" : "Save availability"}</button>
    </form>
  </div>;
}
