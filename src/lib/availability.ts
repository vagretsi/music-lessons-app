import { z } from "zod";
export const TIME_ZONE = "Europe/Athens";
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const minutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
export const availabilitySchema = z.array(z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: time,
  endTime: time,
})).max(28).superRefine((slots, ctx) => {
  slots.forEach((slot, i) => {
    if (minutes(slot.endTime) - minutes(slot.startTime) < 60)
      ctx.addIssue({ code: "custom", message: "Each period must be at least 60 minutes.", path: [i] });
    if (slots.some((other, j) => j < i && other.dayOfWeek === slot.dayOfWeek && other.startTime < slot.endTime && slot.startTime < other.endTime))
      ctx.addIssue({ code: "custom", message: "Periods on the same day cannot overlap.", path: [i] });
  });
});
export type AvailabilitySlot = z.infer<typeof availabilitySchema>[number];
export function timeSlots(start: string, end: string) {
  const slots: string[] = [];
  for (let m = minutes(start); m + 60 <= minutes(end); m += 60)
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  return slots;
}
export function athensParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return { date: `${part("year")}-${part("month")}-${part("day")}`, time: `${part("hour")}:${part("minute")}` };
}
export function athensDate(date: string, time: string) {
  const target = Date.parse(`${date}T${time}:00Z`);
  let result = new Date(target);
  for (let i = 0; i < 3; i++) {
    const local = athensParts(result);
    result = new Date(result.getTime() + target - Date.parse(`${local.date}T${local.time}:00Z`));
  }
  const local = athensParts(result);
  if (local.date !== date || local.time !== time) throw new Error("Invalid Athens time");
  return result;
}
export function isAvailable(date: Date, slots: AvailabilitySlot[]) {
  const local = athensParts(date);
  const day = new Date(`${local.date}T12:00:00Z`).getUTCDay();
  return date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0 && slots.some(s => s.dayOfWeek === day && timeSlots(s.startTime, s.endTime).includes(local.time));
}
