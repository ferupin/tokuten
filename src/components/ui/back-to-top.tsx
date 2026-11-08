"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";

/** Distance from the bottom of the page, in pixels, where the button appears. */
const NEAR_END = 700;

/**
 * Floating button that returns to the top. It appears when the reader is close
 * to the end of a long page, so it never competes with the content up front.
 */
export function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const { scrollY, innerHeight } = window;
      const total = document.documentElement.scrollHeight;
      const longPage = total > innerHeight * 2;
      setVisible(longPage && total - (scrollY + innerHeight) < NEAR_END);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t("ui.backToTop")}
      title={t("ui.backToTop")}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`no-print fixed bottom-5 right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-surface text-ink shadow-[var(--shadow)] transition-all duration-200 hover:border-ink sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
