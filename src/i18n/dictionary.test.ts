import { describe, expect, it } from "vitest";
import { profiles } from "@/profiles";
import { DEFAULT_LOCALE, LOCALES, isLocale, languages } from "./languages";

type Node = string | { [key: string]: Node };

/** Flattens a dictionary into dotted keys and their text. */
function flatten(node: Node, prefix = ""): Record<string, string> {
  if (typeof node === "string") return { [prefix]: node };
  return Object.entries(node).reduce<Record<string, string>>(
    (acc, [key, value]) => ({ ...acc, ...flatten(value, prefix ? `${prefix}.${key}` : key) }),
    {},
  );
}

const flatEn = flatten(languages[DEFAULT_LOCALE].messages);
/** Every registered language, so a new one is checked without editing this file. */
const all = LOCALES.map((locale) => ({ locale, flat: flatten(languages[locale].messages) }));
const others = all.filter((l) => l.locale !== DEFAULT_LOCALE);
const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join(",");

describe("language registry", () => {
  it("has English as the default and a label for every language", () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
    for (const locale of LOCALES) expect(languages[locale].label.trim().length, locale).toBeGreaterThan(0);
  });

  it("recognizes only registered languages", () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
    for (const bad of ["", "xx", "toString", "__proto__", null, undefined, 3]) expect(isLocale(bad)).toBe(false);
  });

  it("includes English, Portuguese and Spanish", () => {
    expect(LOCALES).toEqual(expect.arrayContaining(["en", "pt-BR", "es"]));
  });
});

describe("dictionaries", () => {
  for (const { locale, flat } of all) {
    describe(locale, () => {
      it("has exactly the same keys as English", () => {
        expect(Object.keys(flat).sort()).toEqual(Object.keys(flatEn).sort());
      });

      it("has no empty text", () => {
        for (const [key, text] of Object.entries(flat)) expect(text.trim().length, key).toBeGreaterThan(0);
      });

      it("uses the same placeholders as English", () => {
        for (const key of Object.keys(flatEn)) expect(placeholders(flat[key]), key).toBe(placeholders(flatEn[key]));
      });

      it("never uses em dashes", () => {
        for (const [key, text] of Object.entries(flat)) expect(text.includes("—"), key).toBe(false);
      });
    });
  }

  it("translates every other language, not a copy of English", () => {
    for (const { locale, flat } of others) {
      const same = Object.keys(flatEn).filter((k) => flat[k] === flatEn[k] && /[a-z]{4,}/i.test(flatEn[k]));
      // Names, kanji and a few shared words can match. A mostly copied file cannot.
      expect(same.length / Object.keys(flatEn).length, locale).toBeLessThan(0.1);
    }
  });
});

describe("profile text", () => {
  for (const profile of Object.values(profiles)) {
    describe(profile.id, () => {
      const p = `profiles.${profile.id}`;

      it("names the profile and every pillar", () => {
        for (const { flat } of all) {
          expect(flat[`${p}.name`]).toBeTruthy();
          for (const pillar of profile.pillars) expect(flat[`${p}.pillars.${pillar.id}`], pillar.id).toBeTruthy();
        }
      });

      it("words every consistency check", () => {
        for (const { flat } of all) {
          for (const id of profile.checklist) expect(flat[`${p}.checklist.${id}`], id).toBeTruthy();
        }
        expect(new Set(profile.checklist).size).toBe(profile.checklist.length);
      });

      it("describes every category and subcriterion", () => {
        for (const { flat } of all) {
          for (const c of profile.categories) {
            for (const field of ["name", "scope", "boundary"]) {
              expect(flat[`${p}.categories.${c.id}.${field}`], `${c.id}.${field}`).toBeTruthy();
            }
            for (const sub of c.subcriteria) {
              expect(flat[`${p}.categories.${c.id}.subcriteria.${sub}`], `${c.id}.${sub}`).toBeTruthy();
            }
          }
        }
      });

      it("has a meaning text for every pillar, so a new profile cannot skip it", () => {
        for (const { flat } of all) {
          for (const pillar of profile.pillars) {
            expect(flat[`meaning.pillars.items.${pillar.id}.color`], pillar.id).toBeTruthy();
            expect(flat[`meaning.pillars.items.${pillar.id}.why`], pillar.id).toBeTruthy();
          }
        }
      });
    });
  }
});
