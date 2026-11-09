"use client";

import { useEffect } from "react";

/**
 * Time window, in milliseconds, in which a page that mounts is treated as the
 * result of a back or forward navigation.
 */
const TRAVERSAL_WINDOW = 1500;

let lastTraversal = 0;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    lastTraversal = Date.now();
  });
}

/**
 * Starts a page at the top when the reader arrives through a link.
 *
 * Client navigation keeps the scroll position of the previous page, and Next.js
 * then scrolls to the first element that is not sticky, which leaves a page
 * partly scrolled below its header. A back or forward navigation is left alone,
 * because the browser restores the position the reader had.
 */
export function useScrollTop() {
  useEffect(() => {
    if (Date.now() - lastTraversal < TRAVERSAL_WINDOW) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
}
