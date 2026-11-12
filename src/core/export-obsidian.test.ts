import { describe, expect, it } from "vitest";
import { sentaiProfile } from "@/profiles/sentai";
import { exportAs } from "./export";
import { exportObsidian, gauge } from "./export-obsidian";
import { computeResult, createEvaluation } from "./scoring";

const t = (key: string, values?: Record<string, string | number>) =>
  values ? `${key}(${Object.entries(values).map(([k, v]) => `${k}=${v}`).join(",")})` : key;

function build(setup?: (e: ReturnType<typeof createEvaluation>) => void, date?: string) {
  const evaluation = createEvaluation(sentaiProfile);
  evaluation.title = 'Season "One": test';
  evaluation.introduction = "Intro.";
  evaluation.conclusion = "Done.";
  setup?.(evaluation);
  const result = computeResult(sentaiProfile, evaluation);
  return exportObsidian(sentaiProfile, evaluation, result, t, { date });
}

describe("obsidian export", () => {
  it("opens with valid properties", () => {
    const md = build((e) => {
      e.categories.story.override = 8;
      e.enjoyment = 9;
    }, "2026-11-09");
    const front = md.split("---\n")[1];
    expect(md.startsWith("---\n")).toBe(true);
    expect(front).toContain('title: "Season \\"One\\": test"');
    expect(front).toContain("profile: sentai");
    expect(front).toContain("score: 8.00");
    expect(front).toContain("enjoyment: 9.0");
    expect(front).toContain("exported: 2026-11-09");
    expect(front).toContain("tags:\n  - tokuten\n  - tokuten/sentai");
    // Properties never carry a hash or a wikilink.
    expect(front).not.toMatch(/#|\[\[/);
    // Every property has a space after the colon.
    for (const l of front.split("\n").filter((x) => /^[a-z_]+:/.test(x))) expect(l).toMatch(/^[a-z_]+:( |$)/);
  });

  it("omits score and enjoyment when nothing is graded", () => {
    const front = build().split("---\n")[1];
    expect(front).toContain("status: empty");
    expect(front).not.toContain("score:");
    expect(front).not.toContain("enjoyment:");
  });

  it("marks partial scores and redistribution with callouts", () => {
    const md = build((e) => {
      e.categories.story.override = 8;
      e.categories.mecha.applicable = false;
    });
    expect(md).toContain("> [!warning] export.partialTitle");
    expect(md).toContain("> [!info] export.redistributedTitle");
    expect(md).toContain("status: partial");
  });

  it("renders one collapsible callout per category", () => {
    const md = build((e) => {
      e.categories.story.override = 7;
      e.categories.story.notes = "Line one.\n\nLine two.";
    });
    const callouts = md.split("\n").filter((l) => /^> \[!(note|question)\][+-] /.test(l));
    expect(callouts).toHaveLength(10);
    expect(md).toContain("> Line one.\n>\n> Line two.");
  });

  it("keeps enjoyment separate from the official score", () => {
    const md = build((e) => {
      e.categories.story.override = 8;
      e.enjoyment = 2;
    });
    expect(md).toContain("==8.00 / 10==");
    expect(md).toContain("export.separateNote");
  });

  it("adds a Mermaid chart only when something is graded", () => {
    expect(build()).not.toContain("```mermaid");
    const md = build((e) => {
      e.categories.story.override = 8;
    });
    expect(md).toContain("```mermaid\npie showData");
  });

  it("never uses an em dash", () => {
    expect(build((e) => (e.categories.story.override = 8))).not.toContain("—");
  });

  it("draws gauges of ten cells", () => {
    expect(gauge(7)).toBe("███████░░░");
    expect(gauge(0)).toBe("░░░░░░░░░░");
    expect(gauge(10)).toBe("██████████");
  });

  it("is selected by exportAs", () => {
    const evaluation = createEvaluation(sentaiProfile);
    const result = computeResult(sentaiProfile, evaluation);
    expect(exportAs("obsidian", sentaiProfile, evaluation, result, t).startsWith("---\n")).toBe(true);
    expect(exportAs("standard", sentaiProfile, evaluation, result, t).startsWith("# ")).toBe(true);
  });
});

describe("subcriteria tables", () => {
  const graded = (e: ReturnType<typeof createEvaluation>) => {
    e.categories.story.subcriteria.structure.value = 8;
    e.categories.story.subcriteria.plot.value = 6.5;
  };

  it("sits inside the callout with a gauge column", () => {
    const md = build(graded);
    expect(md).toContain("> | export.subcriterion | export.grade |  |");
    expect(md).toContain("> |:---|---:|:---|");
    expect(md).toContain("> | profiles.sentai.categories.story.subcriteria.structure | 8.0 | `████████░░` |");
  });

  it("keeps a blank callout line before the table so it renders", () => {
    const lines = build(graded).split("\n");
    const i = lines.findIndex((l) => l.startsWith("> | export.subcriterion"));
    expect(lines[i - 1]).toBe(">");
  });

  it("omits the table in quick mode", () => {
    const md = build((e) => {
      graded(e);
      e.mode = "quick";
    });
    expect(md).not.toContain("export.subcriterion");
  });

  it("leaves ungraded and not applicable subcriteria out", () => {
    const md = build((e) => {
      graded(e);
      e.categories.story.subcriteria.plot.applicable = false;
    });
    expect(md).toContain("subcriteria.structure |");
    expect(md).not.toContain("subcriteria.plot |");
  });
});

describe("real dictionaries", () => {
  it("resolve every key the exports use, in both languages and both formats", async () => {
    const { en } = await import("@/i18n/en");
    const { ptBR } = await import("@/i18n/pt-BR");
    for (const dict of [en, ptBR]) {
      const tr = (key: string, values?: Record<string, string | number>) => {
        const found = key.split(".").reduce<unknown>((o, p) => (o as Record<string, unknown> | undefined)?.[p], dict);
        if (typeof found !== "string") throw new Error(`Missing text: ${key}`);
        return Object.entries(values ?? {}).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), found);
      };
      const e = createEvaluation(sentaiProfile);
      e.categories.story.subcriteria.structure.value = 8;
      e.categories.mecha.applicable = false;
      e.enjoyment = 7;
      const r = computeResult(sentaiProfile, e);
      for (const f of ["standard", "obsidian"] as const) {
        const md = exportAs(f, sentaiProfile, e, r, tr);
        expect(md).not.toContain("undefined");
        expect(md).not.toContain("—");
      }
    }
  });
});
