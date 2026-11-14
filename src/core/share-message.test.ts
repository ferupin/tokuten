import { describe, expect, it } from "vitest";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import { ptBR } from "@/i18n/pt-BR";
import { MESSAGE_STYLES, buildMessage, isMessageStyle } from "./share-message";
import { NETWORKS } from "./share-networks";

const dictionaries = { en, "pt-BR": ptBR, es };
const lookup = (dict: unknown) => (key: string, values?: Record<string, string | number>) => {
  const text = key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], dict) as string;
  return values ? text.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`)) : text;
};

describe("share messages", () => {
  it("exist in every maintained language and use the title and the score", () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const style of MESSAGE_STYLES) {
        const text = buildMessage(style, { title: "Gokaiger", score: "7.5" }, lookup(dict));
        expect(text, `${locale} ${style}`).toContain("Gokaiger");
        expect(text, `${locale} ${style}`).toContain("7.5");
        expect(text, `${locale} ${style}`).not.toMatch(/[{}]/);
        expect(text.includes("—"), `${locale} ${style}`).toBe(false);
      }
    }
  });

  it("recognizes only the known styles", () => {
    expect(isMessageStyle("curious")).toBe(true);
    expect(isMessageStyle("loud")).toBe(false);
    expect(isMessageStyle(null)).toBe(false);
  });
});

describe("share networks", () => {
  const link = "https://example.org/results#1/sentai/8,7/t=A%20B";
  const message = "Check my result & tell me";

  it("build links that carry the encoded message and link", () => {
    for (const network of NETWORKS) {
      const url = network.url(message, link);
      expect(url.startsWith("https://"), network.id).toBe(true);
      expect(url, network.id).toContain(encodeURIComponent(link));
      if (!network.copyMessage) expect(url, network.id).toContain(encodeURIComponent(message));
    }
  });

  it("have a unique id", () => {
    expect(new Set(NETWORKS.map((n) => n.id)).size).toBe(NETWORKS.length);
  });
});
