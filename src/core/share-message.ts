import type { Translate } from "./export-markdown";

/**
 * The invitation that goes with a shared result. Every style asks the reader to
 * open the link and check the result, because most networks cannot carry the
 * image itself. The wording lives in the dictionaries, one text per style.
 */
export const MESSAGE_STYLES = ["curious", "direct", "challenge", "minimal", "formal"] as const;

export type MessageStyle = (typeof MESSAGE_STYLES)[number];

export const DEFAULT_MESSAGE_STYLE: MessageStyle = "curious";

export function isMessageStyle(value: unknown): value is MessageStyle {
  return typeof value === "string" && (MESSAGE_STYLES as readonly string[]).includes(value);
}

/** The message text, without the link. */
export function buildMessage(style: MessageStyle, values: { title: string; score: string }, t: Translate): string {
  return t(`share.messages.${style}`, values);
}
