# 0012. Sharing to networks without connecting to them

## Status

Accepted, version 0.14.0.

## Context

A result can already leave the app as an image and as a link. People then asked for a direct way to post it to the main social networks, with the card they selected, the options they chose, their card theme, a short invitation and the link to the project.

The app is a static site with no server and no accounts, and it must not weaken that. Two facts shape the options:

- No network accepts an image through a plain link. The post links of X, Bluesky, Threads, Reddit, Facebook, WhatsApp and Telegram take text and a link, and Facebook takes only a link.
- Connecting to a network through its own login or SDK would load their scripts, set their trackers and need keys. That is against the idea that nothing leaves the page unless the person presses a button.

## Decision

Each network is a plain link built in the browser (`src/core/share-networks.ts`). Pressing the round button opens the network's own post screen in a new tab with the message and the link already filled in.

- **The message asks the reader to open the result.** Since the image cannot travel, every wording says to check the result, and the shared link opens a page that shows the card. The link also carries the card layout and theme (`l=` and `c=`), so the reader first sees the card the sender chose. Older links still open.
- **The image travels where it can.** On devices that can share files, one button sends the image, the message and the link together. On the web versions of X, Bluesky, Threads, WhatsApp and Telegram, the card is copied to the clipboard when the button is pressed, and the person pastes it. Facebook takes only a link, so the message is copied instead. Reddit gets the message as the title and the link as the post.
- **Five wordings, chosen by the person.** Curious, Direct, Challenge, Minimal and Formal. The choice is remembered. The text can be edited, and picking a wording starts again from it. The wording lives in the dictionaries, so every language keeps its own voice.
- **The link follows the address the app runs from.** It is built from the page address at the moment of sharing, so a move to another host needs no change.
- **LinkedIn and Mastodon are left out.** LinkedIn takes only a link and its audience is not this one. Mastodon needs the person's own server address.
- **Buttons carry a short mark, not a logo.** Each round button shows two letters, with a tooltip and a screen reader label naming the network. Official logos have their own usage rules, so they are not drawn here. A contributor may replace a mark with the official asset of a network, following that network's brand guidelines.

## Consequences

- Nothing is sent until a button is pressed, and no third party script is loaded.
- Pasting the image is one extra step on the web. The app says so when it has copied the image.
- Network post links can change. They are in one small file with a test, so a fix is a one line change.

## Alternatives considered

- **Network SDKs and share buttons.** Rejected: scripts, trackers and keys.
- **A generated image hosted by us for each result.** Rejected: needs a server and storing people's results.
- **One generic Share button only.** Kept for devices that support it, but desktop browsers often do not, so it cannot be the only way.
