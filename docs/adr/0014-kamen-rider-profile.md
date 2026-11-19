# 0014. The Kamen Rider profile and a choice of method

## Status

Accepted, version 1.3.0. The profile is provisional until people who know the series have reviewed it.

## Context

Tokuten started with one profile, Super Sentai. The next franchise was Kamen Rider. The author had not watched the series yet, so the profile had to be built from public sources and community analysis, and then checked by people who know the works.

Three facts shaped the work. Tokuten is the permanent name and brand, whatever the profiles cover. The ten categories under five pillars, the weights that add up to 100 and the scale are part of the identity of the method. And profiles for other communities, anime first, are expected in time.

## Decision

**Identity.** One visual identity for every profile. Only words change per profile (the Kijun label, the example name, the category names and texts), and the colors of the pillars. A small accent per profile and a full theme per profile were mocked and set aside, because the brand is the constant and the value is the method.

**The shape of the method stays.** Ten categories, five pillars, weights that add up to 100. A profile replaces or merges categories and never extends the set.

**Categories.** Antagonists & Threat replaces Squad Chemistry. Squad Chemistry judges a group working as one, and a Kamen Rider season is built around other relationships. Characters, Partners & Allies absorbs partners, allied or rival Riders and the supporting cast. A bond between a hero and a villain is judged in Antagonists and nowhere else, and a bond between heroes in Characters, so nothing is counted twice. Rider Design & Visual Identity and Gear, Forms & Vehicles replace Suits and Mecha. Gear is judged on what it does for the story and the action, not on how well it sells. The other six categories keep the Sentai wording, with one adapted boundary line each in Action and Production.

**Weights.** Exactly those of Sentai, with Antagonists & Threat holding the 12% of the category it replaces. Nothing in the sources gave a reason to move weight, and a score then reads the same way in both profiles. Characters may deserve a little more and Gear a little less. Both are left for after community review.

**Colors.** Five pillars, with the colors of the Riders. The pillar kanji are also color names, so they change with the colors: 赤 red, 銀 silver, 金 gold, 緑 green and 紫 violet. Red and green are shared with Sentai, so the profiles stay one family. The pairing of colors and pillars is design intent, as it is in Sentai. The violet is the least anchored of the five. The numeral order 壱 to 十 and the pillar of each position are the same in every profile, so a numeral means the same position everywhere.

**Scope.** A TV series per evaluation. Films are not mixed in. In time the method should carry the same concepts to films, whatever the profile.

**Switching.**

- A segmented choice where the profile label used to be. A header selector and method cards on a first screen were mocked and set aside.
- A route per profile. `/` stays Super Sentai, so existing links, the preview image and the promise of 1.x hold, and nothing redirects. Kamen Rider lives at `/kamen-rider`, and later profiles at `/<id>`. A result link already carries the profile id.
- The switch is a client side navigation inside one layout, so the document is not reloaded. Each profile is a static page with its words already in the HTML. The highlight slides, since the control remembers its last position across the pages.
- One in-memory store and one draft per profile. Sentai keeps the draft key it always had, and the others use `tokuten.draft.<id>`. Switching never erases grades.
- The file, the draft and the share link already carry the profile id. Each is read only by the profile it names.

**Provisional.** The profile is marked as provisional in the interface, with a direct link to a profile review form. The README invites anyone who knows the works to review the profiles. A review is an issue, needs no code, and each accepted change is recorded here with its source. A change to weights or wording is a new, announced profile version, so old files keep their score.

## Sources

Public sources and community writing, used as a base and not as final truths:

- [Kamen Rider Wiki, Heisei series](https://kamenrider.fandom.com/wiki/Kamen_Rider_Series/Heisei_Series), for the shape of the franchise.
- [Tokusatsu Network, what counts as a Kamen Rider](https://tokusatsunetwork.com/2020/09/what-does-and-doesnt-count-as-a-kamen-rider/), for the debate on what a Rider is.
- [The Toku Source, what makes a good Kamen Rider villain](https://thetokusource.com/2020/06/03/what-makes-a-good-kamen-rider-villain), for the weight of antagonists. Its traits (insight into the hero, duality, a real challenge, mystery and menace, a possible change of side) are a lens for the subcriteria and not a checklist.
- [TV Tropes, YMMV](https://tvtropes.org/pmwiki/pmwiki.php/YMMV/KamenRider), for the recurring debates on tone, gimmicks and merchandise.
- [Kuuga allies](https://akizukiorientaldramamovie.blogspot.com/2013/08/my-thoughts-on-allies-in-kamen-rider.html), [the Ex-Aid review](https://thetokusource.com/2017/09/11/kamen-rider-ex-aid-series-review-the-making-of-a-masterpiece) and [Kamen Rider at 50](https://the-avocado.org/2021/04/03/even-if-there-is-no-god-or-buddha-50-years-of-kamen-rider), for the cast, the partners and the relationship with the villain.
- [Wikipedia, Kamen Rider W](https://en.wikipedia.org/wiki/Kamen_Rider_W), for the premise of a duo, an allied Rider and a villain family in one season.

The sources on gear and merchandise were thin, so the boundary of Gear, Forms & Vehicles is the one to review first, with Antagonists & Threat.

## Consequences

- A profile is registered in one place and its page, switch entry and tests follow. The scoring code did not change.
- Every dictionary holds a block per profile, including the meaning of each pillar color, which moved from the Meaning page into the profile.
- The tone list for pillar colors grew by silver, gold and violet, with tokens for both themes and the contrast tests extended to them.
- Sentai is unchanged. Its fixtures and the compatibility tests of 1.x stay green.
- Points to watch after release: the violet pillar, the boundary of Gear, the scope of Antagonists, whether Characters grew too heavy, and how the Showa series fit.

## Alternatives considered

- **A profile accent or a full theme per profile.** Rejected: the brand is the constant, and a theme per profile would make them feel like different products.
- **Keeping the Sentai colors for Kamen Rider.** Rejected by the author in favor of the colors of the Riders.
- **Extending the set to eleven categories for villains.** Rejected: ten categories and five pillars are part of the identity.
- **Squad Chemistry as Allies & Dynamics, villains inside Story and Characters.** Rejected: villains would stay diluted, against what the sources say.
- **Fusing Suits and Mecha to make room.** Rejected: it changes two categories at once.
- **A header selector or method cards for the switch.** Rejected for now: the header is full on a phone, and cards push the form down. Cards may return as a first screen when many communities exist.
- **Redirecting `/` to the last profile used.** Rejected: it would break existing links and flash on load.
- **Grouping the numerals by pillar.** Rejected: the same numeral should mean the same position in every profile.
