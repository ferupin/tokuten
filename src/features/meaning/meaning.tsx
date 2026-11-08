"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Hanko } from "@/components/brand/hanko";
import { BackToTop } from "@/components/ui/back-to-top";
import { ContributeCard } from "@/components/ui/contribute-card";
import { Footer } from "@/components/ui/footer";
import { PageHeader } from "@/components/ui/page-header";
import { useScrollTop } from "@/components/ui/use-scroll-top";
import { useI18n } from "@/i18n";
import { numeral } from "@/features/evaluation/numerals";
import { defaultProfileId, getProfile } from "@/profiles";

type Kind = "fact" | "intent";

function Tag({ kind }: { kind: Kind }) {
  const { t } = useI18n();
  return (
    <span
      className="label inline-block rounded-full border px-2 py-0.5 !text-[10px]"
      style={{ borderColor: kind === "fact" ? "var(--line-strong)" : "var(--accent)", color: kind === "fact" ? "var(--ink-soft)" : "var(--accent)" }}
    >
      {t(kind === "fact" ? "meaning.fact" : "meaning.intent")}
    </span>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="m-0 font-serif text-2xl font-extrabold">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** A themed panel that always shows one theme, whatever the page is using. */
function ThemePanel({ theme, title, names }: { theme: "light" | "dark"; title: string; names: [string, string, string] }) {
  const tokens: { token: string; name: string }[] = [
    { token: "--bg", name: names[0] },
    { token: "--surface", name: "" },
    { token: "--ink", name: names[1] },
    { token: "--accent", name: names[2] },
  ];
  return (
    <div data-theme={theme} className="rounded-xl border p-4" style={{ background: "var(--bg)", color: "var(--ink)", borderColor: "var(--line-strong)" }}>
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--ink-soft)" }}>
        {title}
      </p>
      <div className="mt-3 flex items-end gap-3">
        {tokens.map(({ token, name }) => (
          <div key={token} className="text-center">
            <div className="h-12 w-12 rounded-lg border" style={{ background: `var(${token})`, borderColor: "var(--line-strong)" }} />
            <span className="mt-1 block text-[11px]" style={{ color: "var(--ink-soft)" }}>
              {name || " "}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {["--red", "--blue", "--yellow", "--green", "--pink"].map((token) => (
          <span key={token} className="h-2.5 flex-1 rounded-full" style={{ background: `var(${token})` }} />
        ))}
      </div>
    </div>
  );
}

export function Meaning() {
  const { t } = useI18n();
  useScrollTop();
  const profile = getProfile(defaultProfileId);
  const p = `profiles.${profile.id}`;

  const nameCards = [
    { key: "tokuten", mark: "特点" },
    { key: "pun", mark: "得点" },
    { key: "kijun", mark: "基準" },
  ] as const;

  const swatches = ["washi", "sumi", "shu", "shikkoku"] as const;
  const fonts = [
    { key: "display", cls: "font-display" },
    { key: "serif", cls: "font-serif font-extrabold" },
    { key: "sans", cls: "font-sans" },
    { key: "mono", cls: "font-mono" },
  ] as const;

  return (
    <>
      <PageHeader width="max-w-4xl" />

      <main className="mx-auto flex max-w-4xl flex-col gap-14 px-4 pb-20 pt-10">
        <div>
          <Link href="/" className="label text-soft no-underline hover:text-ink">
            ← {t("ui.backToApp")}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Hanko size={76} rotate={-4}>点</Hanko>
            <div>
              <h1 className="m-0 font-display text-[clamp(30px,5.5vw,48px)] font-normal leading-tight">{t("meaning.title")}</h1>
              <p className="label m-0 mt-1">
                <span lang="ja">{t("meaning.kanji")}</span> · {t("meaning.reading")}
              </p>
            </div>
          </div>
          <p className="mb-2 mt-5 max-w-2xl text-[16px]">{t("meaning.intro")}</p>
          <p className="m-0 max-w-2xl text-[13px] text-soft">{t("meaning.designNote")}</p>
        </div>

        <Section id="name" title={t("meaning.name.title")}>
          <div className="grid gap-4 sm:grid-cols-3">
            {nameCards.map(({ key, mark }) => (
              <article key={key} className="card p-5">
                <p lang="ja" className="m-0 font-serif text-5xl font-extrabold leading-none" style={{ color: key === "kijun" ? "var(--blue)" : "var(--accent)" }}>
                  {mark}
                </p>
                <p className="label mb-3 mt-2">{t(`meaning.name.${key}.reading`)}</p>
                <p className="m-0 text-[14px]">{t(`meaning.name.${key}.text`)}</p>
                <div className="mt-3">
                  <Tag kind="fact" />
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="pillars" title={t("meaning.pillars.title")}>
          <p className="m-0 max-w-2xl text-soft">{t("meaning.pillars.intro")}</p>
          <div className="grid gap-4">
            {profile.pillars.map((pillar) => {
              const tone = `var(--${pillar.tone})`;
              const cats = profile.categories.filter((c) => c.pillarId === pillar.id);
              return (
                <article key={pillar.id} className="card grid gap-4 overflow-hidden p-5 sm:grid-cols-[110px_1fr]" style={{ borderLeft: `4px solid ${tone}` }}>
                  <div className="text-center sm:text-left">
                    <p lang="ja" className="m-0 font-serif text-[64px] font-extrabold leading-none" style={{ color: tone }}>
                      {pillar.kanji}
                    </p>
                    <p className="label m-0 mt-1">{pillar.reading}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="m-0 text-[16px] font-bold">{t(`${p}.pillars.${pillar.id}`)}</h3>
                      <span className="label">
                        {t("meaning.pillars.colorLabel")}: {t(`meaning.pillars.items.${pillar.id}.color`)}
                      </span>
                      <Tag kind="intent" />
                    </div>
                    <p className="mb-3 mt-2 text-[14px]">{t(`meaning.pillars.items.${pillar.id}.why`)}</p>
                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                      {cats.map((c) => (
                        <li key={c.id} className="rounded-full border border-line px-2.5 py-1 text-[12px]">
                          <span className="mr-1.5 font-serif font-extrabold" style={{ color: tone }} aria-hidden>
                            {numeral(profile.categories.indexOf(c))}
                          </span>
                          {t(`${p}.categories.${c.id}.name`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="m-0 text-[13px] text-soft">{t("meaning.pillars.note")}</p>
        </Section>

        <Section id="seal" title={t("meaning.seal.title")}>
          <p className="m-0 max-w-2xl">{t("meaning.seal.text")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["provisional", "decided"] as const).map((state) => {
              const decided = state === "decided";
              return (
                <article key={state} className="card flex items-start gap-4 p-5">
                  <Hanko size={64} rotate={-4} color={decided ? "var(--accent)" : "var(--line-strong)"} className={decided ? "stamp-in" : ""}>
                    {t(`meaning.seal.${state}.mark`)}
                  </Hanko>
                  <div>
                    <h3 className="m-0 text-[15px] font-bold">
                      {t(`meaning.seal.${state}.label`)} <span className="label">{t(`meaning.seal.${state}.reading`)}</span>
                    </h3>
                    <p className="mb-0 mt-1 text-[14px] text-soft">{t(`meaning.seal.${state}.text`)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section id="numerals" title={t("meaning.numerals.title")}>
          <p className="m-0 max-w-2xl">{t("meaning.numerals.text")}</p>
          <ol className="m-0 grid list-none grid-cols-5 gap-2 p-0 sm:grid-cols-10" aria-label={t("meaning.numerals.title")}>
            {profile.categories.map((_, i) => (
              <li key={i} className="card py-3 text-center">
                <span lang="ja" className="block font-serif text-3xl font-extrabold leading-none" style={{ color: i < 3 ? "var(--accent)" : "var(--ink)" }}>
                  {numeral(i)}
                </span>
                <span className="label mt-1 block">{i + 1}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="colors" title={t("meaning.colors.title")}>
          <p className="m-0 max-w-2xl">{t("meaning.colors.text")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ThemePanel theme="light" title={t("meaning.colors.light")} names={["Washi", "Sumi", "Shu"]} />
            <ThemePanel theme="dark" title={t("meaning.colors.dark")} names={["Shikkoku", "Ivory", "Shu"]} />
          </div>
          <dl className="m-0 grid gap-3 sm:grid-cols-2">
            {swatches.map((key) => (
              <div key={key} className="card p-4">
                <dt className="flex items-baseline gap-2">
                  <span lang="ja" className="font-serif text-2xl font-extrabold" style={{ color: "var(--accent)" }}>
                    {t(`meaning.colors.swatches.${key}.kanji`)}
                  </span>
                  <span className="font-bold">{t(`meaning.colors.swatches.${key}.name`)}</span>
                </dt>
                <dd className="m-0 mt-1 text-[13px] text-soft">{t(`meaning.colors.swatches.${key}.text`)}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="type" title={t("meaning.type.title")}>
          <p className="m-0 max-w-2xl">{t("meaning.type.text")}</p>
          <ul className="m-0 grid list-none gap-3 p-0">
            {fonts.map(({ key, cls }) => (
              <li key={key} className="card grid items-center gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-6">
                <p className={`m-0 text-[28px] leading-tight ${cls}`}>{t("meaning.type.sample")}</p>
                <div>
                  <p className="m-0 font-mono text-[12px] font-bold">{t(`meaning.type.items.${key}.name`)}</p>
                  <p className="m-0 text-[13px] text-soft">{t(`meaning.type.items.${key}.role`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <p className="m-0 text-[13px] text-soft">{t("meaning.source")}</p>

        <ContributeCard />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
