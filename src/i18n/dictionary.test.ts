import { describe, expect, it } from "vitest";
import { profiles } from "@/profiles";
import { en } from "./en";
import { ptBR } from "./pt-BR";

type Node = string | { [key: string]: Node };

/** Flattens a dictionary into dotted keys and their text. */
function flatten(node: Node, prefix = ""): Record<string, string> {
  if (typeof node === "string") return { [prefix]: node };
  return Object.entries(node).reduce<Record<string, string>>(
    (acc, [key, value]) => ({ ...acc, ...flatten(value, prefix ? `${prefix}.${key}` : key) }),
    {},
  );
}

const flatEn = flatten(en);
const flatPt = flatten(ptBR);
const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join(",");

describe("dictionaries", () => {
  it("have exactly the same keys in every language", () => {
    expect(Object.keys(flatPt).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it("have no empty text", () => {
    for (const [key, text] of [...Object.entries(flatEn), ...Object.entries(flatPt)]) {
      expect(text.trim().length, key).toBeGreaterThan(0);
    }
  });

  it("use the same placeholders in every language", () => {
    for (const key of Object.keys(flatEn)) {
      expect(placeholders(flatPt[key]), key).toBe(placeholders(flatEn[key]));
    }
  });

  it("never use em dashes", () => {
    for (const [key, text] of [...Object.entries(flatEn), ...Object.entries(flatPt)]) {
      expect(text.includes("—"), key).toBe(false);
    }
  });
});

describe("profile text", () => {
  for (const profile of Object.values(profiles)) {
    describe(profile.id, () => {
      const p = `profiles.${profile.id}`;

      it("names the profile and every pillar", () => {
        for (const flat of [flatEn, flatPt]) {
          expect(flat[`${p}.name`]).toBeTruthy();
          for (const pillar of profile.pillars) expect(flat[`${p}.pillars.${pillar.id}`], pillar.id).toBeTruthy();
        }
      });

      it("words every consistency check", () => {
        for (const flat of [flatEn, flatPt]) {
          for (const id of profile.checklist) expect(flat[`${p}.checklist.${id}`], id).toBeTruthy();
        }
        expect(new Set(profile.checklist).size).toBe(profile.checklist.length);
      });

      it("describes every category and subcriterion", () => {
        for (const flat of [flatEn, flatPt]) {
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
        for (const flat of [flatEn, flatPt]) {
          for (const pillar of profile.pillars) {
            expect(flat[`meaning.pillars.items.${pillar.id}.color`], pillar.id).toBeTruthy();
            expect(flat[`meaning.pillars.items.${pillar.id}.why`], pillar.id).toBeTruthy();
          }
        }
      });
    });
  }
});
