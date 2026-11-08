"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Messages } from "./en";
import { ptBR } from "./pt-BR";
import type { Translate } from "@/core/export-markdown";

export const LOCALES = ["en", "pt-BR"] as const;
export type Locale = (typeof LOCALES)[number];

export const localeLabels: Record<Locale, string> = { en: "English", "pt-BR": "Português (BR)" };

const dictionaries: Record<Locale, Messages> = { en, "pt-BR": ptBR };

const STORAGE_KEY = "tokuten.locale";

function lookup(messages: Messages, key: string): string {
  let node: unknown = messages;
  for (const part of key.split(".")) {
    if (node && typeof node === "object" && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof node === "string" ? node : key;
}

function interpolate(template: string, values?: Record<string, string | number>): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Minimal dictionary based i18n. The app is a static single page, so a small
 * provider is enough and keeps the bundle light. The dictionaries are typed,
 * so a missing key in any language fails the type check.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // English is always the default. Only a language the user picked on purpose
  // is restored, and only after mount to keep hydration stable.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && LOCALES.includes(saved)) setLocaleState(saved);
    } catch {
      /* storage can be unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback<Translate>(
    (key, values) => interpolate(lookup(dictionaries[locale], key), values),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
