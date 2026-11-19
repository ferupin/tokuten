# Kamen Rider profile: working draft

Status: **ready for the author's review**. Every point has been discussed and decided. Nothing is implemented. When the author approves this document, it becomes an ADR and the profile data, in the same format as the Sentai work. Nothing here is validated by the community yet, which is why the profile will ship as provisional.

## Summary of what was decided

| Point | Decision |
|---|---|
| Brand | Tokuten is the permanent name and brand, for any community in the future. |
| D1 Identity | One fixed visual identity. Only words change per profile. |
| D2 Colors | Five pillar colors kept. Rider takes its own palette with matching kanji: 赤 red, 銀 silver, 金 gold, 緑 green, 紫 violet. |
| D3 Scope | A TV series per evaluation. Films are not mixed in. Films are a later design. |
| D4 Categories | Ten categories and five pillars are kept. Antagonists & Threat replaces Squad Chemistry. Characters absorbs partners, allied or rival Riders and the supporting cast. |
| D5 Weights | The Sentai weights, with Antagonists & Threat at 12%. |
| D6 Wording | Subcriteria, scope lines and reference points are drafted for all ten categories. Six stay as in Sentai, four change. |
| D7 Switching | A segmented choice where the profile label is. `/` stays Sentai, `/kamen-rider` is new. Client side switch, no document reload. One draft per profile. |
| D8 Validation | The profile ships as provisional. Anyone who knows the works can review it without writing code, through an issue. A short README invitation. |
| D9 Long term | Profiles stay independent. A neutral base is considered when a third profile exists. |
| D10 Order | The Sentai numeral order is kept in every profile. |

## 1. Agreed starting facts

1. **Tokuten is the permanent name and brand.** It does not depend on what a profile covers. Kamen Rider is the next profile. Later, the same method could serve anime, series and films.
2. **The method stays neutral where it can.** Categories are written in the language of each franchise, but the scale, the weights logic, the not applicable rule and the reference points are the same everywhere.
3. **The author has not watched Kamen Rider yet.** The profile therefore has to be built from sources, analyses and people who know the franchise, and checked by them before release. The author will watch the series in order, which will also help to test the profile in practice.
4. **The philosophy of the Sentai profile carries over.** A season is judged on its own merits, with the same criteria each time. Popularity, nostalgia and influence do not raise a grade. Production limits do not lower one.

## 2. What the sources say about Kamen Rider

These come from public sources and community writing. They are a base for the profile and not final truths, which is why the community review exists.

**Shape of the franchise.** Kamen Rider started in 1971. It is usually split into the Showa era, the Heisei era and the Reiwa era. The Heisei era is often split again in two phases, the second starting with W (2009) and ending with Zi-O (2018 to 2019), though Toei only recognizes this division unofficially. Kuuga (2000) is the usual start of the Heisei era, after a hiatus in the 1990s. [Kamen Rider Wiki, Heisei series](https://kamenrider.fandom.com/wiki/Kamen_Rider_Series/Heisei_Series).

**What counts as a Rider is itself debated.** Fans use informal tests (the name, a transformation into an armored form, official listings, a heroic role), and the sources do not agree on borderline cases such as rival Riders, mass produced Riders and movie only Riders. [Tokusatsu Network](https://tokusatsunetwork.com/2020/09/what-does-and-doesnt-count-as-a-kamen-rider/). This matters for a profile because it decides what a "Rider design" category judges.

**Villains carry a lot of weight in how fans judge a series.** One community article lists what makes a strong Rider villain: insight into the hero, a duality with the hero, a real challenge, mystery and menace, and a possible turn to heroism. [The Toku Source](https://thetokusource.com/2020/06/03/what-makes-a-good-kamen-rider-villain). In Sentai, villains sit inside other categories. For Rider, that may not be enough.

**Recurring debates.** Tone (dark seasons such as Gaim split fans), the quality of later seasons, whether supernatural themes tend to struggle, how many Riders and gadgets a season uses, side Riders, merchandise driven gimmicks and low budget effects. The first series has 98 episodes, which is seen as a barrier for newcomers. [TV Tropes, YMMV](https://tvtropes.org/pmwiki/pmwiki.php/YMMV/KamenRider).

**Rankings exist but are not criteria.** There are community polls and ranking lists, for example [Tokusatsu Network's Heisei fan vote](https://tokusatsunetwork.com/2019/04/over-3000-english-speaking-tokusatsu-fans-vote-on-their-favorite-heisei-kamen-rider/). They show which seasons are loved, not what is being judged, so they help only to test a draft, never to build it.

**Kamen Rider W as an example of a duo.** In W, a detective, Shotaro Hidari, teams up with Philip, and the two transform together into one Rider with two Double Driver belts. The cast around them includes a female lead, an investigator who becomes another Rider (Accel), and the antagonist family that sells the Gaia Memories. [Wikipedia, Kamen Rider W](https://en.wikipedia.org/wiki/Kamen_Rider_W). This confirms that a partnership, an allied Rider and a villain family can all sit in one season, which the proposed categories cover. The page has no critical reception, so it supports the premise and nothing about quality.

**What is not needed.** The app does not need a list of seasons, because the name of the series is free text. The gap in the sources about the Reiwa series therefore does not block the profile.

## 3. How Rider differs from Sentai

| Aspect | Sentai (current profile) | Kamen Rider (hypothesis) |
|---|---|---|
| Hero | A team of five, with a color each | Often one Rider, sometimes a duo, sometimes many Riders who also fight each other |
| Gear | Mecha and giant robot combinations | The driver, devices, forms and vehicles, tied closely to the season concept |
| Villains | Part of Story and Visual Design | Often central to the identity of the season |
| Tone | Usually bright, with some darker seasons | Wide range, from light to very dark |
| Continuity | Each season is a standalone | Standalone seasons, with crossovers and anniversary seasons |
| Eras | Many decades, one shape | Showa, Heisei and Reiwa differ in format and tone |

## 4. Decision points

Each point has a recommendation. They are starting positions to react to.

### D1. Does the identity of the app change per profile? **Decided: A**

One visual identity for every profile: the hanko, the wordmark, the typefaces, the paper and ink colors and the layout. Only words change per profile (the Kijun label, the headline, the example name, the category names and texts). This follows the UI and UX principle that a product should feel the same wherever it is used, and it keeps the brand as the constant. A small accent per profile (option B) and a full theme per profile (option C) were mocked and set aside.

### D2. Pillar colors for Kamen Rider. **Decided: the Rider palette, with matching kanji**

The five pillar colors are an identity element, so Rider keeps five colors. The Sentai colors are the five rangers, so Rider takes its own five from the colors of the Riders. In the pillars, the kanji is also the name of the color (赤 red, 青 blue and so on), so a new color needs a new kanji. The palette and kanji below were accepted by the author:

| Pillar | Sentai | Rider (proposal) | Idea behind it |
|---|---|---|---|
| Narrative | 赤 red | 赤 red | The scarf and the heart of the hero. Same as Sentai, which keeps both profiles familiar. |
| Concept | 青 blue | 銀 silver | The chrome of the helmet and the cold idea behind a season. |
| Visual | 黄 yellow | 金 gold | The belt and the eyes. What the eye meets first. |
| Craft | 緑 green | 緑 green | The grasshopper, the first Rider. Same as Sentai. |
| Rhythm and Sound | 桃 pink | 紫 violet | Movement and warmth in Sentai. Here a color that Riders also wear, to be justified. |

Points to settle:

- The pairing of a color with a pillar is design intent, as it is in Sentai, and not a fact about the series. The violet for Rhythm and Sound is the least anchored of the five. It is chosen because it sits apart from red, gold, silver and green and works on both themes. It is the first color to revisit if the community suggests a better pairing. Black was set aside because it cannot work as an accent on a dark background.
- Silver and gold have to pass the contrast rules in both themes. The mock uses a cooler steel gray in the light theme.
- Shared colors (red and green) make the two profiles feel like one family. This is wanted.
- The profile type has a fixed list of color tones today. A new profile will need the tone list to grow. This is a code matter for later.
- The Meaning page must explain each pillar color of each profile, and a test already forces every pillar of every profile to have a meaning text.

### D3. What is being evaluated? **Decided: a TV series per evaluation**

Films are not mixed in. In time, the method should carry the same concepts to films, whatever the profile (Sentai, Kamen Rider, Anime and Others). That is a later design and nothing is built for it now. The Showa era is still to be discussed once the author has watched it, and the not applicable rule can cover seasons that lack an element.

### D4. The category map. **Decided: ten categories, five pillars**

Ten categories under five colors are part of the identity and of the documented method: the numerals 壱 to 十, the ten axis radar, the weights that add up to 100. A Rider profile therefore replaces or merges, and never extends.

#### How the cast works in Kamen Rider (from the sources)

The Sentai category Squad Chemistry judges a group working as one. The Rider sources show something wider. These relationships appear again and again:

| Kind of relationship | Examples in the sources | Where it is judged (proposal) |
|---|---|---|
| The hero and a partner or duo | Hongo and Hayato in the first series, the two leads of W and Build | Characters, subcriterion on partnerships and bonds |
| Rider and Rider, as allies or rivals | Ryuki, Ex-Aid (doctors and developers as a "rag-tag team") | Characters, same subcriterion |
| The hero and the people around him (police, friends, family, mentors, experts) | Kuuga: detectives, a weapons developer, an archaeologist, a teacher, a restaurant owner | Characters, subcriterion on the supporting cast |
| The hero and a base or home | The Tachibana Racing Club in the first series, the Pore Pore restaurant in Kuuga | Characters (supporting cast), or Story if it is part of the world |
| The hero and the villain | Emu and Parado in Ex-Aid, the villains who mirror or test the hero | Antagonists, and not Characters, to avoid double counting |
| The hero alone | The lonely Rider on his bike, the hero who is no longer fully human | Theme & Concept and Characters |

The sources also say what makes allies work: personal stakes and a useful skill (Kuuga), and what makes them weak: being underused. [Kuuga allies](https://akizukiorientaldramamovie.blogspot.com/2013/08/my-thoughts-on-allies-in-kamen-rider.html), [Ex-Aid review](https://thetokusource.com/2017/09/11/kamen-rider-ex-aid-series-review-the-making-of-a-masterpiece), [Kamen Rider at 50](https://the-avocado.org/2021/04/03/even-if-there-is-no-god-or-buddha-50-years-of-kamen-rider). The W examples are backed by its premise as described by [Wikipedia](https://en.wikipedia.org/wiki/Kamen_Rider_W). The examples for the first series (Hongo and Hayato, the Tachibana Racing Club) come from [Kamen Rider at 50](https://the-avocado.org/2021/04/03/even-if-there-is-no-god-or-buddha-50-years-of-kamen-rider).

#### Options for the ten

1. **Antagonists & Threat replaces Squad Chemistry. Characters absorbs partners and the supporting cast. (decided)** The narrative pillar keeps its three categories (Story, Characters, Antagonists). The weight of the replaced category (12%) goes to Antagonists. Characters grows in scope and has to be rewritten so its six subcriteria cover: characterization, growth and arcs, motivations, partnerships and bonds, supporting cast and allies, and consistency.
2. **Squad Chemistry becomes Allies & Dynamics, and villains stay inside Story and Characters.** Nothing is replaced, but villains stay diluted, which goes against what the sources say.
3. **Fuse Suits and Mecha into one category to make room.** Set aside, because it changes two categories at once.

Rule against double counting: the bond between hero and villain is judged in Antagonists. A bond between heroes, with partners or with the supporting cast, is judged in Characters. A villain's design is judged in Rider Design & Visual Identity, as in Sentai.

Risk to watch: Characters could become too heavy. If it does after the author has watched several seasons, the profile can be revised in a new, announced version.

#### Working category list

| No. | Category | Pillar | Based on |
|---|---|---|---|
| 壱 | Theme & Concept | Concept 銀 | Theme & Concept |
| 弐 | Rider Design & Visual Identity | Visual 金 | Suits & Visual Design |
| 参 | Gear, Forms & Vehicles | Visual 金 | Mecha & Arsenal |
| 四 | Story & Lore | Narrative 赤 | Story & Lore |
| 五 | Characters, Partners & Allies | Narrative 赤 | Characters & Development |
| 六 | Antagonists & Threat | Narrative 赤 | replaces Squad Chemistry |
| 七 | Music & Soundtrack | Rhythm 紫 | Music & Soundtrack |
| 八 | Action & Choreography | Craft 緑 | Action & Choreography |
| 九 | Production & Direction | Craft 緑 | Production & Direction |
| 十 | Pacing & Overall Execution | Rhythm 紫 | Pacing & Overall Execution |

### D5. Weights. **Decided: the Sentai weights as the starting point**

The author wants to avoid inventing too much beyond what is already established. The proposal follows that: **start with exactly the Sentai weights**, with Antagonists & Threat taking the 12% of the category it replaces.

| No. | Category | Sentai | Rider (proposal) |
|---|---|---:|---:|
| 壱 | Theme & Concept | 8% | 8% |
| 弐 | Rider Design & Visual Identity | 8% | 8% |
| 参 | Gear, Forms & Vehicles | 8% | 8% |
| 四 | Story & Lore | 14% | 14% |
| 五 | Characters, Partners & Allies | 14% | 14% |
| 六 | Antagonists & Threat | 12% | 12% |
| 七 | Music & Soundtrack | 8% | 8% |
| 八 | Action & Choreography | 10% | 10% |
| 九 | Production & Direction | 8% | 8% |
| 十 | Pacing & Overall Execution | 10% | 10% |

Reasons: the shape of the method stays the same, so scores from the two profiles read the same way. Nothing in the sources gives a reason to move weight yet. The narrative pillar already holds 40%, and the sources treat villains and the cast as central, which fits.

Two things to watch, not to change now: Characters now covers more, which could ask for a little more weight, and Gear is closely tied to merchandise, which could ask for a little less. Both are best judged after the author has watched seasons and after community review. A change in weights later means a new, announced profile version.

### D6. Subcriteria, scope notes and reference points. **Drafted for all ten categories**

The same format as Sentai: a scope line, a boundary line that prevents double counting, five or six subcriteria, and four reference points for the grades 3, 5, 7 and 9. The reference points judge what the season attempts and how well it succeeds, never popularity, and they do not change a score. The wording below is the proposal that goes to implementation, to be refined by community review.

#### 六 Antagonists & Threat

- **Scope:** The villains as characters and as a threat: their goals, their presence and their effect on the hero and the season.
- **Boundary:** Judge the antagonists here. Their designs belong to Rider Design & Visual Identity, their fights to Action & Choreography, and the plot they drive to Story & Lore. The motives of the heroes belong to Characters, Partners & Allies. A bond between a hero and a villain is judged here and nowhere else.
- **Subcriteria:**
  1. Threat and presence: how much the danger is felt and how much it puts at stake.
  2. Motivations and goals: whether the antagonists want something specific and understandable.
  3. Connection to the hero: how the antagonist challenges, mirrors or tests the hero, beyond being an obstacle.
  4. Challenge and escalation: whether the opposition keeps pushing the hero and grows across the season.
  5. The antagonist side as a whole: the organization, the hierarchy and the roster of villains, and how they work together or against each other.
  6. Resolution and payoff: how the antagonist arc ends, including a change of side where the season uses one.
- **Reference points:**
  - **3:** The villains are generic or interchangeable, their goals are vague and they pose little real threat.
  - **5:** Clear antagonists with understandable goals who cause real trouble, but with little connection to the hero and little development.
  - **7:** Villains with their own motives who challenge the hero in ways that matter and escalate across the season.
  - **9:** Antagonists who test what the hero believes, with goals and methods that feel specific, whose threat and payoff define the season.

Notes:

- The traits that community articles give for a good Rider villain (insight into the hero, duality with the hero, a real challenge, mystery and menace, a possible change of side) are a lens for writing the subcriteria. They are not a checklist. A season that does not use a change of side is not penalized, and a mirror villain is not required. This follows the method's rule that a season is judged on what it attempts and how well it succeeds.
- The category is the least certain one in the profile, because it replaces a Sentai category. It is the first in line for community review.

#### 五 Characters, Partners & Allies (changes most)

- **Scope:** Individual characters and the people around the hero: motivations, arcs, partners, allied or rival Riders and the supporting cast.
- **Boundary:** Judge the hero's side here, including Riders who ally or clash with one another and the people who help them (police, friends, mentors, a base). Villains, and the bond between a hero and a villain, belong to Antagonists & Threat. How a character looks belongs to Rider Design.
- **Subcriteria:**
  1. Characterization
  2. Arcs and growth
  3. Motivations
  4. Partnerships and bonds (a duo, allied or rival Riders)
  5. Supporting cast and allies
  6. Consistency
- **Reference points:**
  - **3:** Characters are defined by one trait and do not change. The hero stands mostly alone, and the people around him are decoration.
  - **5:** Clear characters with understandable motivations. Partners and allies help the hero, but few have an arc of their own.
  - **7:** Most of the cast has a motivation and an arc, the bonds between heroes feel earned, and allies matter to the story.
  - **9:** Characters feel like individuals, the partnerships and bonds shape key moments, and the supporting cast has its own stakes and growth.
- **Notes:** A season about a lone hero marks "Partnerships and bonds" as not applicable, and the weight is redistributed inside the category, as the method already does. The two Sentai subcriteria "Individual arcs" and "Character growth" are merged to make room for the supporting cast. A source supports this scope, the Kuuga analysis in which allies with personal stakes and a useful skill work best and underused allies work worst.

#### 參 Gear, Forms & Vehicles

- **Scope:** The driver, devices, weapons, forms and vehicles of the Riders, and how they serve the season.
- **Boundary:** Design and function count here. How the Rider looks belongs to Rider Design & Visual Identity, and how a finishing move or a fight is performed to Action & Choreography. Gear is judged on what it does for the story and the action. How well it sells, or how it is meant to be sold, does not raise or lower the grade.
- **Subcriteria:**
  1. Driver and device designs
  2. Transformation and forms
  3. Weapons and vehicles
  4. Functionality and rules (the gear works in a clear and consistent way)
  5. Variety
  6. Integration into the season
- **Reference points:**
  - **3:** Gear and forms are generic or repetitive, serve little purpose and are easy to forget.
  - **5:** Functional designs and forms that do the job, with limited variety.
  - **7:** Varied, well designed gear and forms that matter in the story and in the fights.
  - **9:** An inventive set where each piece and form has a clear function and identity, and a new form feels like an event.
- **Notes:** "Weapons and vehicles" can be marked not applicable if a season has no such element. This is the category most tied to merchandise. The fan debates about gimmick driven forms are a reason for the boundary above, and the sources found on this are thin, so it needs the most community review after Antagonists.

#### 弐 Rider Design & Visual Identity

- **Scope:** How the Riders, the villains and the world of the season look.
- **Boundary:** Static design only. Movement belongs to Action & Choreography and camera work to Production & Direction. Gear as a working system belongs to Gear, Forms & Vehicles.
- **Subcriteria:**
  1. Rider designs
  2. Visual identity (a recognizable look for the season, such as its motif)
  3. Villain and monster designs
  4. Aesthetics
  5. Visual consistency
- **Reference points:**
  - **3:** Designs look unfinished or unrelated to each other, and the Riders and the villains share no visual logic.
  - **5:** Readable designs that follow the conventions of the genre, with few that stand out.
  - **7:** Cohesive designs with a clear identity. The Riders are easy to tell apart and several designs stand out.
  - **9:** A strong visual identity across Riders, villains and world. Designs are distinctive, consistent and memorable on their own.

#### The six that stay close to Sentai

These keep the Sentai subcriteria, scope lines and reference points as they are, with only the words that name Sentai elements adapted. Nothing new is invented, which follows the author's wish.

| No. | Category | What changes |
|---|---|---|
| 壱 | Theme & Concept | Nothing. A motif for the season is part of "Premise" and "Thematic identity". The idea that the hero is both human and more than human is a common theme in the sources, and it is allowed but not required. |
| 四 | Story & Lore | Nothing. |
| 七 | Music & Soundtrack | Nothing. |
| 八 | Action & Choreography | The boundary also names finishing moves: their choreography counts here, and the gear behind them belongs to Gear, Forms & Vehicles. |
| 九 | Production & Direction | The boundary says "Rider and gear designs" where Sentai says "suit and robot designs". |
| 十 | Pacing & Overall Execution | Nothing. |

All the drafts above are proposals. The text of every reference point is to be written in English, Portuguese and Spanish when the profile is implemented, with the same neutral and slightly formal wording as the rest of the app.

### D7. Switching profiles in the app. **Decided: P1, with a route per profile**

The choice sits where the profile label is today, above the headline: a segmented control that names each profile. It costs no new chrome, scales to about four profiles and then becomes a menu, and fits a phone at 390px. P2 (header selector) and P3 (method cards) were mocked and set aside. P3 stays as an idea for when many communities exist.

#### Routes

- `/` keeps being the Sentai evaluation. Existing bookmarks, the preview image and the promise of 1.x stay valid. Nothing redirects, so there is no flash and no dependency on stored settings.
- `/kamen-rider` is the new profile. Future profiles follow the same shape, `/<profile id>`.
- A shared result already carries the profile id in its link (`/results#1.sentai...`), so results need no new route.

#### Switching without reloading

The goal is that choosing another profile changes only what depends on it and keeps the page, the header, the fonts and the scroll position.

- The two routes share one layout and one evaluation component. Switching uses the client side navigation of the framework, which swaps only the part of the page that differs and does not reload the document.
- Each route is a static page with the right words already in the HTML, so the first paint is correct on a direct visit and a shared link gets its own preview.
- A profile is plain data, small and loaded on demand with the route. The neighbor profile is prefetched when the choice is hovered or focused, so the switch feels immediate. The scoring engine is shared and is not downloaded twice.
- The control reflects the route, so the browser back button, a refreshed page and a shared link all agree.
- Each profile has its own draft, stored under its own key. Switching never erases grades, and returning to a profile finds it as it was.

Where this is measured: after the build, the switch is checked in a real browser for no document reload, for the time between the click and the new content, and for the size of the page of each route.

#### Other consequences

1. The profile id already travels in the JSON file and the share link. The 1.x promise stays: old files open with the same score.
2. English, Portuguese and Spanish texts for the profile, and the tests that keep the dictionaries complete.
3. The Meaning page and the home headline name the profile that is selected.
4. The home header on a phone still has the full language and theme controls. It is aligned with the compact header when the switch lands.

### D8. How the profile gets validated

A profile that the author cannot yet judge from experience needs outside review.

- Release the profile as **provisional**, with a visible mark, until reviewed.
- Open the draft to the community (an issue or discussion in the repository, and the tokusatsu communities) for categories, then weights, then wording.
- Keep a short list of the sources used for each decision, in the ADR.
- **An invitation in the README (decided).** A short, welcoming section that asks the community to review the profiles and to suggest changes that make them truer to the works, with a link to open an issue. It is written when the profile is implemented. A first draft:

> **Help the profiles stay true to the works.** The Kamen Rider profile was built from public sources and community analysis, and it is provisional until people who know the series well have reviewed it. If a category, a subcriterion or a wording does not match what the works do, please open an issue with a short reason and, if you can, an example. Reviews of the Super Sentai profile are just as welcome.

**Who can review (decided).** Any enthusiast who knows the works. The author knows the Kamen Rider community from forums and Reddit and trusts it, without having watched the series yet. A reviewer does not need to write code. Pointing out that a category, a subcriterion or a reference point does not match a series is enough.

**How a review reaches the project.** A review is an issue in the repository. A form for it (the profile, the category, what does not match, a series as an example, and a source if there is one) makes it easy to write and easy to read. Each accepted change is recorded in the ADR with its source, and a change to weights or wording is a new, announced profile version, so that old files keep their score.

### D9. The long term direction

- Keep profiles independent for now.
- When a third profile exists, compare the three and extract what is truly shared. A neutral base can come from that, instead of being designed ahead of time.
- Anime deserves its own detailed attention, as the author said, and films and series can follow.

This is only recorded in the roadmap. Nothing is built for it.

### D10. Why the category colors and numerals run in this order. **Decided: keep the Sentai order**

A question from the author: Music and Pacing share the pink pillar but sit at 七 and 十, apart from each other, and the green categories 八 and 九 fall between them. Is there a rule?

What the records say: nothing documents the order. The pillars are grouped by color, and the numerals follow the order of the method's own list, which is not grouped by pillar. Reading the list gives a path from the idea to the whole: the concept (壱), what it looks like (弐 参), what it tells (四 五 六), the sound and the craft that make it (七 八 九), and the overall execution that closes it (十). Pacing & Overall Execution closes the list because it judges how everything comes together, and it is pink because it carries the viewer through the season. That reading is a reconstruction, and it should be recorded as design intent if it is kept.

Options for Rider:

- **Keep the same numeral order as Sentai (decided).** The same numeral then means the same position in every profile, which helps comparison and keeps the identity. The colors stay as they are.
- **Group by pillar so each color is contiguous.** Cleaner to read, but it changes the numerals, and for Sentai it would be a visible change to something people already know.

If the author prefers contiguous colors, a mock of the radar and the list in the new order can be made first. Sentai would not change without a decision of its own.

## 5. Implementation plan (after approval)

The work follows the usual process: one phase at a time, tested and approved by the author before the next one, with a suggested commit message at each step. The release is a minor version, because a new profile adds without changing what exists. The 1.x promise holds: every old file opens with the same grades and the same score.

**Phase A. Support for more than one profile, with Sentai unchanged.**

- Routes: `/` stays Sentai, `/kamen-rider` is added as a static page. Results keep reading the profile id from the link.
- A profile registry, a store and a draft per profile, so that switching never erases grades.
- The segmented choice at the place of the profile label, with prefetch of the neighbor profile on hover and focus. Switching is by client navigation, with no document reload.
- The tone list for pillar colors grows to cover silver, gold and violet, with tokens for both themes and the contrast tests extended to them.
- Tests: Sentai scores are identical before and after (the existing fixtures and compatibility tests must stay green).
- Measured in a real browser: no document reload on the switch, time from click to content, and the size of each route.

**Phase B. The Kamen Rider profile.**

- The profile data (ten categories, pillars, weights that add up to 100, subcriteria, reference points, scope and boundary lines).
- The texts in English, Portuguese and Spanish, and the dictionary tests that keep them complete.
- The Meaning page shows the pillars and colors of the selected profile. Share card, exports and the results page work for both profiles.
- The profile is marked as provisional in the interface.

**Phase C. Documents and the invitation to review.**

- An ADR for the profile, built from this document, with the sources of each decision. Updates to the framework document, the semiotics document, the design system, the roadmap and the README.
- The README invitation and an issue form for profile reviews.
- Changelog and version entry, and the final check of the whole.

### What to watch after release

These points were set aside on purpose and are the first ones for community review: the violet pillar, the boundary of Gear, Forms & Vehicles, the scope of Antagonists & Threat, whether Characters, Partners & Allies grew too heavy, and how the Showa series fit (the not applicable rule may cover them, to be tested once the author has watched them).

## 6. Decision log

| Point | Decision | Date | Reasoning |
|---|---|---|---|
| Brand | Tokuten is the permanent name and brand | 2026-11-18 | Stated by the author. |
| Long term | Profiles for other communities are expected | 2026-11-18 | Recorded in the roadmap. |
| D1 | One fixed visual identity, only words change | 2026-11-18 | UI and UX consistency. Stated by the author. |
| D2 | Rider palette with matching kanji | 2026-11-18 | Chosen by the author. |
| D3 | A TV series per evaluation. Films are not mixed in | 2026-11-18 | Stated by the author. |
| D4 | Ten categories and five pillars kept. Antagonists replaces Squad Chemistry. Characters absorbs partners and the supporting cast | 2026-11-18 | Accepted by the author, with the sources in section 4. |
| D5 | The Sentai weights, with Antagonists & Threat at 12% | 2026-11-18 | Chosen by the author, to avoid inventing beyond what is established. |
| D6 | The ten categories drafted. Six stay as in Sentai, four change | 2026-11-18 | Accepted by the author. Changes are discussed as they come. |
| D7 | Segmented choice, route per profile, `/` stays Sentai, client side switch, one draft per profile | 2026-11-18 | Chosen by the author. `/` stays Sentai so that existing links and the 1.x promise hold. |
| D8 | Provisional release, review by any enthusiast through an issue, README invitation | 2026-11-18 | Stated by the author. No code needed to help. |
| D9 | Profiles stay independent, a neutral base later | 2026-11-18 | Rule of three: compare when a third profile exists. |
| D10 | Keep the Sentai numeral order | 2026-11-18 | Same numeral, same position in every profile. |
