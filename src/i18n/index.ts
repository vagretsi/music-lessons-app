"use client";

import { en } from "./en";
import { el } from "./el";

export type Locale = "en" | "el";
export type Translations = typeof en;

export const translations = { en, el };

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? en;
}

export { en, el };
