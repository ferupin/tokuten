import { en, type Messages } from "./en";
import { es } from "./es";
import { ptBR } from "./pt-BR";

/**
 * The language registry. This is the only place that lists the languages the
 * app offers. To add one, create its dictionary file (typed as `Messages`)
 * and add one line here. The language switch, the stored preference and the
 * tests all read from this object.
 *
 * `label` is the name of the language written in that language, so people can
 * find their own even when the interface is in another one.
 */
export const languages = {
  en: { label: "English", messages: en },
  "pt-BR": { label: "Português (BR)", messages: ptBR },
  es: { label: "Español", messages: es },
} satisfies Record<string, { label: string; messages: Messages }>;

export type Locale = keyof typeof languages;

export const LOCALES = Object.keys(languages) as Locale[];

export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(languages, value);
