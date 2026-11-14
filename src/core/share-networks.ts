/**
 * Where a result can be sent. Every network here accepts a ready made post
 * from a plain link, so nothing is installed, no account is connected and
 * nothing leaves the page until the person presses a button.
 *
 * None of them accepts an image through a link. How the image travels is
 * described by `image`:
 * - "paste": the app copies the image first, and the person pastes it into the post
 * - "none": the network has no use for one
 */
export type NetworkId = "x" | "bluesky" | "threads" | "reddit" | "facebook" | "whatsapp" | "telegram";

export interface Network {
  id: NetworkId;
  name: string;
  /** Two letters shown on the round button. */
  mark: string;
  image: "paste" | "none";
  /**
   * `copyMessage` is for a network that takes only a link, so the message is copied
   * for the person to paste into the post.
   */
  copyMessage?: boolean;
  url: (message: string, link: string) => string;
}

const q = (params: Record<string, string>) =>
  Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

export const NETWORKS: readonly Network[] = [
  {
    id: "x",
    name: "X",
    mark: "X",
    image: "paste",
    url: (message, link) => `https://x.com/intent/tweet?${q({ text: message, url: link })}`,
  },
  {
    id: "bluesky",
    name: "Bluesky",
    mark: "Bs",
    image: "paste",
    url: (message, link) => `https://bsky.app/intent/compose?${q({ text: `${message} ${link}` })}`,
  },
  {
    id: "threads",
    name: "Threads",
    mark: "Th",
    image: "paste",
    url: (message, link) => `https://www.threads.com/intent/post?${q({ text: message, url: link })}`,
  },
  {
    id: "reddit",
    name: "Reddit",
    mark: "Rd",
    image: "none",
    url: (message, link) => `https://www.reddit.com/submit?${q({ url: link, title: message, type: "LINK" })}`,
  },
  {
    id: "facebook",
    name: "Facebook",
    mark: "Fb",
    image: "none",
    copyMessage: true,
    url: (_message, link) => `https://www.facebook.com/sharer/sharer.php?${q({ u: link })}`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    mark: "Wa",
    image: "paste",
    url: (message, link) => `https://wa.me/?${q({ text: `${message} ${link}` })}`,
  },
  {
    id: "telegram",
    name: "Telegram",
    mark: "Tg",
    image: "paste",
    url: (message, link) => `https://t.me/share/url?${q({ url: link, text: message })}`,
  },
];
