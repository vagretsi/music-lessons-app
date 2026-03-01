import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale = "en"): string {
  return new Intl.DateTimeFormat(locale === "el" ? "el-GR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: Date | string, locale = "en"): string {
  return new Intl.DateTimeFormat(locale === "el" ? "el-GR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function pluralMinutes(minutes: number, locale = "en"): string {
  if (locale === "el") {
    return `${minutes} λεπτά`;
  }
  return `${minutes} min`;
}
