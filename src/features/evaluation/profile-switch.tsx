"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { repo } from "@/config";
import { useI18n } from "@/i18n";
import { profileList, profileRoute } from "@/profiles";

/**
 * The profile that was shown the last time the choice was on the page. Every profile is a
 * page of its own, so the choice is drawn again after a switch. Starting from the previous
 * position and moving to the new one lets the highlight slide instead of jumping.
 */
let previous: string | null = null;

/**
 * Chooses the evaluation method. Each choice is a real link to the route of its profile,
 * so the browser back button, a refreshed page and a shared address all agree, and the
 * framework swaps only the part of the page that differs, with no reload. The grades of
 * each profile stay in memory while the page is open.
 */
export function ProfileSwitch({ current }: { current: string }) {
  const { t, locale } = useI18n();
  const active = profileList.find((p) => p.id === current);
  const [shown, setShown] = useState(previous ?? current);
  const items = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);
  const [animate, setAnimate] = useState(false);

  // The next frame moves the highlight from where it was to where it should be.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimate(true);
      setShown(current);
      previous = current;
    });
    return () => cancelAnimationFrame(frame);
  }, [current]);

  // Measure the chosen item, and again when the size of the control changes.
  useLayoutEffect(() => {
    const measure = () => {
      const el = items.current[shown];
      if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const parent = items.current[shown]?.parentElement;
    if (!parent || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [shown, locale]);

  return (
    <div>
      <nav aria-label={t("ui.profileSwitch")} className="profile-switch">
        <span
          aria-hidden
          className="profile-switch-mark"
          style={{
            width: box?.width ?? 0,
            transform: `translateX(${box?.left ?? 0}px)`,
            opacity: box ? 1 : 0,
            transition: animate ? undefined : "none",
          }}
        />
        {profileList.map((profile) => (
          <Link
            key={profile.id}
            ref={(el) => {
              items.current[profile.id] = el;
            }}
            href={profileRoute(profile.id)}
            scroll={false}
            aria-current={profile.id === current ? "page" : undefined}
            className="profile-switch-item"
            data-on={profile.id === shown || undefined}
          >
            {t(`profiles.${profile.id}.title`)}
            <span lang="ja" aria-hidden>{t(`profiles.${profile.id}.titleJa`)}</span>
          </Link>
        ))}
      </nav>
      {active?.provisional && (
        <p className="m-0 mt-3 max-w-2xl text-[13px] leading-snug text-soft">
          <span className="profile-tag mr-1.5">{t("ui.provisional")}</span>
          {t("ui.provisionalNote")}{" "}
          <a href={repo.profileReview} target="_blank" rel="noopener noreferrer" className="quiet-link">
            {t("ui.provisionalLink")}
            <svg aria-hidden width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 1h6v6M9 1 1 9" />
            </svg>
            <span className="sr-only"> ({t("ui.opensInNewTab")})</span>
          </a>
        </p>
      )}
    </div>
  );
}
