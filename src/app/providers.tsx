"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useState, createContext, useContext } from "react";

// Language context
type Locale = "en" | "el";
const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: "en", setLocale: () => {} });

export function useLocale() {
  return useContext(LocaleContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <SessionProvider>
      <LocaleContext.Provider value={{ locale, setLocale }}>
        {children}
      </LocaleContext.Provider>
    </SessionProvider>
  );
}
