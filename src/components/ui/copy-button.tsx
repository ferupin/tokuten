"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface CopyButtonProps {
  /** Does the copying. Resolves to true when it worked. */
  onCopy: () => Promise<boolean>;
  children: ReactNode;
  className?: string;
}

/**
 * A button that copies something. When it works, its icon turns into a check for a
 * moment, the same way as the Markdown copy button, so every copy in the app answers alike.
 */
export function CopyButton({ onCopy, children, className = "btn ghost" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        if (!(await onCopy())) return;
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 2000);
      }}
    >
      <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={copied ? "m5 12 5 5L20 7" : "M9 9h10v10H9zM5 15V5h10"} />
      </svg>
      {children}
    </button>
  );
}
