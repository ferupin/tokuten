"use client";

import { useEffect, useMemo, useState } from "react";
import { siBluesky, siFacebook, siReddit, siTelegram, siThreads, siWhatsapp, siX, type SimpleIcon } from "simple-icons";
import { MESSAGE_STYLES, buildMessage, type MessageStyle } from "@/core/share-message";
import { NETWORKS, type Network, type NetworkId } from "@/core/share-networks";
import { Segmented } from "@/components/ui/segmented";
import { useI18n } from "@/i18n";

/** The mark of each network, from the Simple Icons set. Every shape is a single path, drawn in the text color. */
const ICONS: Record<NetworkId, SimpleIcon> = {
  x: siX,
  bluesky: siBluesky,
  threads: siThreads,
  reddit: siReddit,
  facebook: siFacebook,
  whatsapp: siWhatsapp,
  telegram: siTelegram,
};

interface Props {
  title: string;
  score: string;
  /** Link to the result. It always points at the place the app is running from. */
  link: string;
  style: MessageStyle;
  onStyle: (style: MessageStyle) => void;
  /** Draws the selected card as a PNG. */
  renderImage: () => Promise<Blob>;
  canShareFile: boolean;
  fileName: string;
  onStatus: (message: string) => void;
}

/**
 * Sends a result to a network. A link cannot carry an image, so the post is
 * the chosen message plus the link, and the message always asks the reader to
 * open it. Where a network lets people paste an image, the card is copied first.
 * Nothing is sent until a person presses a button, and nothing goes to a server of ours.
 */
export function SocialShare({ title, score, link, style, onStyle, renderImage, canShareFile, fileName, onStatus }: Props) {
  const { t } = useI18n();
  const built = useMemo(() => buildMessage(style, { title, score }, t), [style, title, score, t]);

  // Typing replaces the wording. Picking a style, or a change in the result, starts from the wording again.
  const [typed, setTyped] = useState<string | null>(null);
  useEffect(() => setTyped(null), [built]);
  const message = typed ?? built;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`${message} ${link}`);
      onStatus(t("share.messageCopied"));
    } catch {
      onStatus(t("share.copyFailed"));
    }
  };

  const shareFromDevice = async () => {
    try {
      const blob = await renderImage();
      await navigator.share({ files: [new File([blob], fileName, { type: "image/png" })], title, text: `${message} ${link}` });
    } catch (e) {
      // Closing the share sheet is not an error.
      if (!(e instanceof DOMException && e.name === "AbortError")) onStatus(t("share.failed"));
    }
  };

  // The link is opened by the browser itself. This only prepares the clipboard first, in the same
  // press, so the browser still treats the new tab as something the person asked for.
  const prepare = (network: Network) => {
    if (network.image === "paste" && typeof ClipboardItem !== "undefined") {
      navigator.clipboard
        .write([new ClipboardItem({ "image/png": renderImage() })])
        .then(() => onStatus(t("share.imageCopiedForPost")))
        .catch(() => undefined);
    } else if (network.copyMessage) {
      navigator.clipboard
        .writeText(`${message} ${link}`)
        .then(() => onStatus(t("share.messageCopiedForPost")))
        .catch(() => undefined);
    }
  };

  return (
    <section aria-labelledby="share-social" className="card flex flex-col gap-3 p-5">
      <h2 id="share-social" className="m-0 font-serif text-xl font-extrabold">
        {t("share.socialTitle")}
      </h2>
      <p className="m-0 text-sm text-soft">{t("share.socialHint")}</p>

      <div className="flex max-w-full flex-col gap-1.5">
        <span className="label">{t("share.styleLabel")}</span>
        <div>
          <Segmented
            wrap
            label={t("share.styleLabel")}
            value={style}
            options={MESSAGE_STYLES.map((s) => ({ value: s, label: t(`share.styles.${s}`) }))}
            onChange={(s) => {
              onStyle(s);
              setTyped(null);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="share-message" className="label">
          {t("share.messageLabel")}
        </label>
        <textarea
          id="share-message"
          value={message}
          rows={3}
          onChange={(e) => setTyped(e.target.value)}
          className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm leading-relaxed text-ink"
        />
        <p className="m-0 break-all font-mono text-xs text-soft">{link}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {canShareFile && (
          <button type="button" className="btn" onClick={shareFromDevice}>
            {t("share.device")}
          </button>
        )}
        <button type="button" className={canShareFile ? "btn ghost" : "btn"} onClick={copyMessage}>
          {t("share.copyMessage")}
        </button>
        {canShareFile && <span className="text-xs text-soft">{t("share.deviceHint")}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-line pt-3">
        <span className="label mr-2">{t("share.openIn")}</span>
        {NETWORKS.map((n) => {
          const name = t("share.shareOn", { network: n.name });
          return (
            <a
              key={n.id}
              href={n.url(message, link)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              onClick={() => prepare(n)}
              className="network inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink no-underline"
            >
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d={ICONS[n.id].path} />
              </svg>
            </a>
          );
        })}
      </div>
      <p className="m-0 text-xs text-soft">{t("share.networkNote")}</p>
    </section>
  );
}
