/**
 * Keeps what the reader is looking at in the same place on screen while the
 * page around it changes height.
 *
 * Browsers try to do this themselves (scroll anchoring), but not all do, and
 * none does it every time. Restoring a draft removes the notice strip under the
 * header and fills in the result card, so the page changes height at once.
 * Capture before the change and apply after it.
 */
export interface ScrollAnchor {
  element: Element;
  top: number;
}

/** Remembers the element in the middle of the screen and where it is. */
export function captureAnchor(): ScrollAnchor | null {
  if (typeof document === "undefined") return null;
  const element = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
  return element ? { element, top: element.getBoundingClientRect().top } : null;
}

/** Scrolls by however far the remembered element moved. Does nothing if it was replaced. */
export function applyAnchor(anchor: ScrollAnchor | null): void {
  if (!anchor || !anchor.element.isConnected) return;
  const moved = anchor.element.getBoundingClientRect().top - anchor.top;
  if (Math.abs(moved) > 1) window.scrollBy({ top: moved, left: 0, behavior: "instant" });
}
