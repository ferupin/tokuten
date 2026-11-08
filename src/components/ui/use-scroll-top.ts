"use client";

import { useEffect } from "react";

/**
 * Client navigation keeps the scroll position of the previous page, which is
 * usually the footer. Call this in a page that should start at the top.
 */
export function useScrollTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
}
