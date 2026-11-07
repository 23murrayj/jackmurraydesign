# CLAUDE.md — Jack Murray portfolio

Static site. No build step, no framework, no dependencies. `index.html` +
`styles.css` + `script.js` + `i18n.js`, served as-is. Deployed on Vercel at
**jackmurraydesign.com**.

Jack is a UX designer. This is his portfolio and his job-hunting artifact, so
the site is itself a work sample: the craft of the code and the honesty of the
copy both count as part of the product.

---

## ⚠️ Environment: git is behind an Xcode license gate

`/usr/bin/git` and `/usr/bin/python3` are Xcode shims and currently refuse to
run ("You have not agreed to the Xcode license agreements"). `xcode-select -p`
points at `Xcode.app`. **Do not ask the user to run `sudo` for this.** Use the
Command Line Tools binary directly, which bypasses the shim:

```
/Library/Developer/CommandLineTools/usr/bin/git <args>
```

Use **`node -e`** for scripted file edits (python3 is blocked the same way).

Run the dev server with `preview_start {name: "static"}` (`.claude/launch.json`,
port 8080). Never run a server via Bash.

### The browser pane lies about animation

The in-app browser **freezes CSS transitions, `requestAnimationFrame`, smooth
scrolling, and native scroll events.** This has produced false failures
repeatedly. Symptoms and the fix:

- An element computes the right colour/transform but **paints the start value**
  → inject `*{transition:none!important}` **before** triggering the change, then
  measure.
- `window.scrollTo()` fires **zero** scroll events → dispatch
  `new Event('scroll')` manually.
- Screenshots taken right after `location.reload()` catch the loader mid-fade
  and the reveal animations mid-flight; the hero name looks dim. Wait ~2.5s,
  and kill transitions before capturing.

Never conclude something is broken from a screenshot alone — measure it.

---

## The brief

Jack's own statement of direction. Everything below is in service of it — when
a rule here and this paragraph disagree, **this wins and the rule is wrong.**

> The website should be a sleek, expressive, editorial UX portfolio with
> playful neo-brutalist influences. It should feel bold, modern, creative, and
> memorable while remaining highly professional and user-friendly. The design
> should feature oversized typography, intentional asymmetry, strong visual
> hierarchy, clean layouts, and interactive geometric elements. Light mode
> should feel sophisticated and refined, using warm neutrals with lively but
> controlled colors, while dark mode should be more experimental with neon
> pink, electric blue, and vibrant accents. Typography should balance bold
> statements with lighter supporting text, avoiding unnecessary descriptions.
> Interactions should feel playful and polished without becoming distracting
> or gimmicky. Overall, the website should prioritize excellent UX,
> accessibility, responsiveness, and compelling project presentation while
> maintaining a distinctive personality that feels neither generic nor overly
> chaotic.

Load-bearing phrases, because each one has already settled an argument:

- **"editorial"** and **"intentional asymmetry"** — the 1.4fr/1fr hero split
  and the full-bleed marquee are asymmetric on purpose; don't centre things to
  make them tidy.
- **"avoiding unnecessary descriptions"** — this is why the cycling typewriter
  tagline and the "Research-led interfaces…" line were cut. Prose that
  restates what the work already shows is the thing to delete. Say it once.
- **"the two modes differ in kind"** — light is *refined*: muted coral, dusty
  blue, stone, nothing shouting. Dark is *experimental*: neon, glow, jagged
  stars. Do not flatten them into one look with swapped values.
- **"playful… without becoming gimmicky"** — the magnetic headline, drifting
  shapes, stickers and chaos mode are allowed to be fun because none of them
  obstruct reading the work. A new interaction has to pass that test.
- **"neither generic nor overly chaotic"** — both failure modes are real. The
  tags-as-pills looked generic; an over-bright marquee and over-dense shapes
  were chaotic. Expect to be corrected in either direction.

## Visual direction

The concrete implementation of the brief above.

Neo-brutalist: heavy display type, hard 2–3px rules, **hard offset shadows with
no blur**, flat colour, full-bleed bands. No gradients, no soft drop shadows
(the one exception is the dark-mode neon bloom, which is deliberate).

The giant `JACK MURRAY.` headline is **the main visual focus and stays exactly
as it is.** Layout problems get solved by moving other things, never by
shrinking the name.

## Palette

Tokens live in `:root` / `:root[data-theme="dark"]` in `styles.css`. **Change
colour there, not at call sites.**

| Token | Light | Dark | Role |
|---|---|---|---|
| `--black` | `#1A1A18` near-black | `#F4F2F5` off-white | Foreground. **Flips.** |
| `--white` | `#F0ECE1` warm ivory | `#111117` near-black | Page ground. **Flips.** |
| `--accent` | `#CF625A` coral | `#ff2d55` hot pink | Display + **fills** |
| `--accent-ink` | `#B73F35` | `#ff2d55` | **Small text only** |
| `--accent-on` | `#1A1A18` | `#1A1A18` | Sits on an `--accent` fill |
| `--highlight` | `#CBC4B4` stone | `#DDFF67` lime | Tertiary / hover fills |
| `--blue` | `#657FB9` dusty | `#8190FF` electric | Secondary |
| `--accent-warm` | `#D9A227` amber | `#FFC847` | **Graphic only** — two hero shapes |
| `--green` | `#1F8F4D` | `#3DE88A` | Availability dot |
| `--muted` | `#6A6861` | `#9C9AA3` | Secondary text |
| `--line` | `#CBC4B4` | `#33333D` | Light dividers |

**Tokens that never INVERT** — the graphic slabs (marquee, loader, about
section, footer, pong) are a dark surface with light type in both themes, so
these stay on their side of the line: `--paper: #F7F3EB`,
`--muted-ink: #a8a79c`, `--warn-ink: #932D25`.

`--ink` belongs to that group but **does change value between themes**:
`#1A1A18` light (= `--black`, so there is one black on the page) and
`#111117` dark (= the dark ground, so the slabs stay part of the page instead
of becoming panels on it). It is still never light, which is the guarantee
the group exists for. **Dark must keep its own `--ink` declaration** — drop it
and dark inherits light's value and every slab turns into a lighter rectangle.

> This caught us once: the theme switch was built from `--paper`/`--black`, so
> in dark mode a cream knob sat on a cream track. If a component must mirror
> between themes, build it from `--black`/`--white`.

### One black

Light mode has exactly one dark value, `#1A1A18`, and it is `--black`,
`--ink` and `--accent-on`. It used to have two — charcoal `#20201E` on the
type, buttons and rules, `#111117` on the marquee, about slab and footer —
which is 13.83:1 against 15.94:1, and the second one blue where the first is
warm. Jack caught it on the marquee: side by side it reads as a mistake, and
it also made the charcoal look light, which is the answer to "is the black
too light?" — it was, relative to the strip next to it.

Not `#000`: a pure black on a warm paper ground reads as a screenshot of a
design rather than a printed page, and the brief's word is editorial.
**If you add a dark surface, use `--ink`, never a literal.** The chaos-mode
and pong hexes are the one exception and they carry `#1A1A18` explicitly.

`--accent-warm` is the hero's third hue and is **never text**: 1.94:1 on the
ground. It is not a revival of the superseded `--yellow` below — that was
`#fffb00`, the loudest thing on the page; this is a dark amber spent on the
two smallest shapes in the field.

### The ground has been set four times — the search is finished

`#F0EEE8` ivory → `#EFE7D7` sand → `#F1F0EB` cool → **`#F0ECE1`**, all on
2026-11-05/06. Three of the four are known-wrong by Jack's own eye, which is
the useful part:

- **Too cool** (`#F0EEE8`, `#F1F0EB`) goes green-grey under the warm accents
  and reads as the page receding rather than as restraint.
- **Too warm** (`#EFE7D7`) reads as distinctly beige, and drags the palette
  down with it: five tokens are measured against the ground, so all five had
  to darken to hold AA, and the page lost the thing warming it was for.

`#F0ECE1` is the midpoint of the last two, picked by Jack after seeing both.
**It is warm enough to need the sand-era companions**, which is the trap:
`--accent-ink #BE4137` measures 4.45:1 here and `--muted #6E6C64` 4.46:1, both
under AA, so the darker `#B73F35` / `#6A6861` are required, and
`--warn-ink` needs `#932D25` to hold 4.58:1 on the stone.

**If you move the ground, move those five and re-measure** — `--accent-ink`,
`--highlight`/`--line`, `--muted`, `--paper`, `--warn-ink`. And the
`theme-color` meta in `index.html`, which has now been missed **three times
running**; it holds `--white`'s value and nothing else.

The hard warm limit is unchanged: at `#EAE2D1`, one step past sand, coral
falls to 2.94:1 and misses even the 3:1 that large type and UI borders need.

`scratchpad/options.html` (gitignored) renders alternatives at half scale with
the real fonts, but its "in now" swatch is stale — it still shows sand.

**Dark's accent went back to `#ff2d55`** on 2026-11-06, at Jack's request —
he missed it. It is the one value deliberately recovered from the superseded
palette below, so a `#ff2d55` in the codebase is now intentional in *dark
mode only*; light keeps its coral, because the two modes differ in kind. The
superseded table calls it "neon red", which undersells it: beside the lime and
the electric blue it reads pink. It costs headroom and none of it matters —
5.16:1 on the ground against the `#FF55AA` bubblegum's 6.39, and `--accent-on`
on top of it is the same 5.16 where 4.5 is the bar. The chaos-mode and pong
hexes track it, since those surfaces wear the dark palette in both themes.

### The superseded palette (do not reintroduce)

Replaced 2026-11-05 at commit `9c1f3ac`; the last version using it is
`1ba4dd4`. Jack's brief was to drop the saturated yellow and red. Recorded so
a stray hex can be *identified* as old rather than mistaken for intentional —
if you find one of these values anywhere, it is a leftover.

| Token | Old light | Old dark |
|---|---|---|
| `--black` | `#1e1c17` | `#e8e5dc` |
| `--white` | `#e6e3db` | `#171512` |
| `--accent` | `#ff3b30` flat red | `#ff2d55` neon red |
| `--accent-ink` | `#b32921` | `#ff2d55` |
| `--accent-on` | `#ffffff` | `#171512` |
| `--yellow` → now `--highlight` | `#fffb00` pure yellow | `#f9ff2e` |
| `--blue` | `#0a5cff` | `#00d4ff` cyan |
| `--green` | `#16d160` | `#00ff95` |
| `--muted` | `#62615a` | `#9c9b92` |
| `--line` | `#b3b0a3` | `#38372f` |
| `--ink` / `--paper` | `#111111` / `#f5f5f0` | *(fixed, same)* |
| `--muted-ink` | `#a8a79c` | *(fixed, same)* |
| `--warn-ink` | `#b32921` | *(fixed, same)* |
| `--chip` / `--chip-lead` | `rgba(30,28,23,.07)` / `.24` | `rgba(232,229,220,.10)` / `.22` |

Also gone: the chaos-mode/pong hardcoded hexes `#ff2d55`, `#f9ff2e`, `#00e1ff`,
which were the last place the old red and yellow survived.

Two things changed that are easy to get wrong when porting old code:

- **`--accent-on` used to be white.** It is now near-black, because white
  fails on both new accents. An old snippet assuming white-on-accent is a
  contrast bug.
- **`--yellow` no longer exists.** It is `--highlight`, and in *light* mode it
  is stone, not yellow. Six hero shapes still referenced `var(--yellow)` after
  the rename and silently fell back to an inherited colour — grep for the old
  name after any token rename.

### Contrast rules (non-negotiable)

Coral is **3.21:1** on the ground and dusty blue **3.36:1** — fine for display type
and UI borders, **below AA for body text**. Hence the split:

- `--accent` → fills and large/display type. `--accent-on` goes on top (4.60:1).
- `--accent-ink` → small text and outlines (4.71:1 on the ground).
- **Never** fill with `--accent-ink` and put `--accent-on` on it — that's 3.13:1.
- **Nothing near-white goes on an accent fill.** White on coral is 3.79:1, on
  pink 3.35:1, and `--paper` is no better — it sat on the card hover's coral
  fill at 3.47:1 for months because a resting-DOM walk never visits `:hover`.
  `--accent-on` is the only correct label colour on `--accent`.

Targets: 4.5:1 body text, 3:1 for ≥24px or ≥18.66px-bold and for UI borders.
After any colour change, **re-run the live audit** (walk `body *`, composite
backgrounds, compare) across light + dark × home + project overlay + about page.
Current state: **0 failures.**

**Audit hover states by hand** — a walk of the resting DOM misses them, and
this is now the source of every contrast bug this project has shipped:
`--warn-ink` on `--highlight` sat at 3.55:1 unnoticed, then at 4.44:1 again
after the ground warmed, and `--paper` on the card hover's coral fill went
unseen entirely. After a palette change, **list the `:hover` and `:focus`
rules that pair two tokens and measure each pair by hand** — the audit script
will not do it for you.

## Typography

- `--ff-display` Archivo Black — headline, section heads, card titles
- `--ff-body` Space Grotesk — everything else
- `--ff-condensed` Anton
- `'Noto Sans JP'` is appended to **every** stack (per-glyph fallback), so
  mixed strings like "UXデザイン" resolve correctly with no language rules.

Japanese needs `font-weight: 900` to match Latin's optical weight, and its
tracking is reset — see the `html[lang="ja"]` block.

**CJK sizing is a real constraint.** Full-width glyphs are ~1em each, so a size
that leaves English 40px of slack in a 356px column leaves Japanese 7px.
`.hero-role` has its own `html[lang="ja"]` size for exactly this. **Check all
four languages whenever you size display type.**

## Layout

- Hero `min-height: 80vh` — deliberately not 100vh, so the marquee is a seam
  with the next section visible below it, not the bottom edge of the page.
- `#work .section-head` has `padding-top: 64px`, against 70px everywhere else.
  It has been 70 (the hero looked finished before the work started), then 38
  (the heading arrived so soon after the strip that the hero had no ending),
  now 64. See the shape-field note below — the field's inset tracks it.
- **The hero CTA is shrink-wrapped, ~226px.** It spent a release at
  `width: 100%` with `justify-content: space-between`, squaring the column off
  against a ragged right edge. Jack's verdict: a 356px button with the label
  at one end and the arrow at the other is a bar, not a button, and the hole
  in the middle is what you see. **Don't stretch it again.** The ragged edge
  it was fixing is mostly theoretical — the role line is the widest element
  either way, so it sets the measure.
- Hero **stacks below 1280px**, not 900. The name track is min-content
  `MURRAY.` and only leaves a usable side column once its 12rem cap engages
  (162px at 1024, 356 at 1440). The skeleton loader's breakpoint must move
  with it or the layout jumps at handover.
- `.hero-role` sizes in **`cqw` off its own column** (`container-type:
  inline-size` on `.hero-side`), not `vw` — the column isn't a fraction of the
  viewport.
- Full-bleed out of a padded parent: `margin-inline: calc(50% - 50vw)`. Cancels
  whatever padding the parent has, at any width.
- `html, body { overflow-x: clip }` (not `hidden` — three sticky elements
  depend on `html` not becoming a scroll container).
- Breakpoints in use: 1280, 1100, 900, 800, 760, 700, 640, 620, 600, 480, 360.

## Animation

- Every hover effect is wrapped in `@media (hover: hover)`. On touch, `:hover`
  latches on tap and never releases.
- 13 `prefers-reduced-motion` blocks; the global one kills durations.
- Marquee runs at a **fixed 55 px/second** (`setupSeamlessMarquee` derives the
  duration from content width), so resizing the type doesn't change its speed.
- Hero shapes: 9 per theme, drift on **two sine terms per axis** (one sine
  traces a clean ellipse and reads as clockwork). Opacity in CSS, not JS —
  `.38` light / `.62` dark with a `drop-shadow` glow, both dialled back ≤760px.
  Behind `.hero-grid` (z 0 vs 2) and `pointer-events: none`.
- **The field reaches past the hero**, 306px down, to the top of the first
  card — through the heading AND the filter row, so the hero thins out across
  three bands (strip, heading, tags) rather than ending twice. Three things
  make that work together: `.hero` is `overflow: clip visible` (NOT `hidden
  visible`, which computes to auto and makes it a scroll container — three
  sticky elements depend on that not happening), `.hero-shapes` is
  `inset: 0 0 -306px 0`, and **`.work` carries no background** — it was
  `var(--white)`, the same colour body already paints, and an opaque one
  there covers the field. `.work` is positioned and later in the DOM, so its
  content still paints over the shapes, which is what keeps the cards clean.
  **That 306 is measured from the hero's box to the first card**, so it tracks
  everything between: `#work .section-head`'s `padding-top` (64px) and the
  `.filters` row (40px/10px padding plus chip height). Change any of those and
  re-measure. Being a px value against a row that can wrap, it stops partway
  up the filter row on a phone instead of at the cards — the right failure,
  since the shapes are dialled back below 760 anyway.
- **Small text and controls inside the field's reach get an opaque
  background.** Three now: the availability badge, `#work .section-num`, and
  the filter chips. The chips' text was never the problem (`--black` over even
  a vivid shape is 6.13:1) — a shape drifting through an outlined chip makes
  it read as busy rather than as a control, and these have to stay
  unambiguously clickable. The 2px border is what makes the occlusion read
  right: the chip is an object in front, so a shape behind it should be hidden
  rather than showing through.
- **They are allowed to drift across the type, and that is settled.** A build
  that held them out of the name, the right column, the nav and the marquee —
  measured boxes, envelope-reserving placement, a per-frame clamp — spread
  well at 1440, where the two-column split leaves real negative space. Below
  that it did not: a stacked hero has one pocket, so the field concentrated
  into it, and at 375 it collapsed to four-to-six shapes inside one 60×50
  patch. Jack's call was the free field at every width. The z-order and the
  ≤760px opacity are what protect the text. **Do not reintroduce a keep-out.**
- `drop-shadow`, not `box-shadow`, on SVG shapes — box-shadow traces the
  element box, not the star.
- Theme is applied by a **blocking inline script in `<head>`**, before first
  paint. Without it the page painted light then transitioned to dark over
  250ms on every load.
- **The switch is a circular wipe out of the control, with a fallback.**
  `switchTheme()` (not `applyTheme`, which also runs on load) has two paths:
  - **View Transitions**, when the browser has them and motion is allowed.
    `document.startViewTransition()` snapshots before and after, and a
    `clip-path` circle animated on `::view-transition-new(root)` reveals the
    new theme from the centre of the switch, radius to the furthest viewport
    corner so it always finishes off-screen. 620ms on the page's own curve.
    The CSS at the end of `styles.css` turns OFF both default pseudo
    animations — leaving the cross-fade on runs it under the wipe and turns
    a clean edge into a dissolve. `mix-blend-mode: normal` matters as much:
    the default `plus-lighter` blends the snapshots additively, which on a
    near-white to near-black page blows the overlap out to white.
    **No `.theme-switching` on this path** — the live page is behind a static
    snapshot, so cross-fading it as well buys nothing.
  - **The coordinated cross-fade**, for no-VT browsers and for reduced
    motion, where a 600ms wipe across the viewport is the thing the setting
    exists to prevent. Adds `.theme-switching` to `<html>` for
    `--theme-dur`; a blanket rule puts every element on `--theme-dur` /
    `--theme-ease` for colour properties only. Before this the page changed
    theme in passes — body over .35s, cards .25s, filter buttons .2s, the
    section rules and marquee not at all. Two carve-outs: the knob gets
    `transform` back (it has to travel), and `.hero-shapes .shape` does not
    (JS writes its transform every frame, and a transition makes it smear).
- **The hero field is positioned the moment it is built** (`placeShapes()` at
  the end of `buildShapes()`), not on the next animation frame. That one-frame
  gap is invisible normally and very visible under a view transition: the
  theme switch rebuilds the field inside the transition callback and the new
  snapshot is taken BEFORE the next frame, so without it the wipe reveals
  nine shapes piled in the top-left corner and holds them there for 620ms.
  **Anything JS positions must be positioned synchronously for the same
  reason.**
- **The browser pane cannot run a view transition.** Its frozen rendering
  means `transition.ready` never settles, so the wipe neither starts nor is
  observable there. Verify the logic by stubbing `document.startViewTransition`
  and `Element.prototype.animate` and asserting the keyframes, origin, radius,
  duration and which path was taken — not by watching.

## UX rules

- **State lives in one place.** The language button shows the translate mark
  only; which language is on is told by the menu's marked option + `aria-current`.
- Cards are one object: photo badge, title, tags, and the action bar all
  respond together. Tags are plain text — as pills, people clicked them
  instead of the card.
- **"LET'S MAKE / SOMETHING." carries its colour in the GLOW, not the type.**
  Three layered blooms in both themes (tight / fall-off / spill) because a
  single 16px shadow around a 200px letter is a rim, not a neon sign, and the
  headline read as white and lifeless. Four layers each, now that the glow is
  the only colour on the line and Jack asked for it to carry further. Setting
  row two in `--accent` was tried
  and rejected: at 13rem a coral half-sentence stops being a headline and
  becomes a highlighted phrase, and the two rows read as two voices rather
  than one line that happens to break. **Colour around the letterform reads as
  light; colour inside it reads as a change of subject.**
- **The stats are all one colour, `--accent`.** This row has been three
  things: all `--highlight` (stone in light — four grey numbers, dead), then a
  hue per cell (fixed the greyness, broke something worse — four figures in
  four colours is four separate things, and you count the colours before
  reading the numbers), now one accent across all four. They are one fact
  about one person; the series is held together by its rhythm — four cells,
  three rules, one size — not by variety. The accent specifically because it
  is the only option legible in both themes that also *means* something: it is
  the colour of the full stop in the name. **Don't give them a hue each
  again.**
- **The card hover is small on purpose.** `translate(-4px, -6px)` and an 8px
  shadow. It was `-7px, -14px` on an 18px shadow and Jack rejected it: a card
  that lifts 14px stops being part of its row, which is a lot of movement to
  say "clickable" when the shadow already says it. The shadow then stayed at
  12px for a round after the lift came down, which was its own bug — a 4/6px
  lift under a 12px block casts further than the card moved, so it reads as a
  sticker laid on the page rather than a card that rose off it. **Keep the
  shadow in proportion to the lift.** Do not grow either again.
- Controls that open menus use `aria-expanded`; the theme control is
  `role="switch"` + `aria-checked`.
- Menus close on outside click, Escape, and scrolling away (40px threshold).
  Read the element's own class, never the caller's flag.
- Touch targets ≥44px. Use an invisible `::before` to extend a hit area rather
  than inflating a control.
- **Every interaction has a touch path, including the easter eggs.** Pong was
  keyboard-only for a release, so on a phone the egg menu opened a game with
  no way to play it — the CPU scored five times and that was the experience.
  It takes a drag now (pointer events, so one path covers finger, pen and
  mouse; `touch-action: none` on the canvas or the drag scrolls the page
  instead). Removing it below a breakpoint was the other option and it is the
  worse one: **a portfolio that drops a feature on mobile rather than adapting
  it is arguing against its own case studies.** If a control names its inputs,
  the label has to follow the device too — `.pong-footer` swaps its
  `data-i18n` key to `pong.controlsTouch` on a coarse pointer, which keeps
  working across language changes because `apply()` reads the attribute live.
- Four languages (en/es/ja/it), ~764 keys. **Every user-facing string goes in
  `i18n.js` in all four.** `data-i18n` sets textContent; `data-i18n-html` for
  markup; `data-i18n-aria`, `data-i18n-alt`, `data-i18n-tip`.

## Machine readers are an audience

Jack is job-hunting, and the people and systems reading this site increasingly
include AI. Two things were built for that on 2026-11-06, and they have to be
kept true:

- **`/llms.txt`** — plain text at the site root, Jack's own account of what
  the site is and what the work is, plus the thing that prompted it: AI
  summaries kept leading with the hidden Pong game and chaos mode, which are
  easter eggs most visitors never find. Being described by its footnotes
  misrepresents a portfolio whose case studies are the content. `robots.txt`
  points at it. It is **not** in `.vercelignore` and must not be.
- **JSON-LD in `index.html`** (`Person` + `WebSite` + `CollectionPage`), the
  structured half of the same story, including a
  `disambiguatingDescription` that says the easter eggs are easter eggs.

Rules for both:

- They say **nothing that is not already visible on the site.** No hidden text
  aimed at crawlers, and deliberately **no `sr-only` block** — a pitch written
  for machines has no business being read aloud to a screen-reader user.
- **Keep them in step with the page.** Adding, cutting or renaming a project
  means editing `llms.txt` and the JSON-LD too. Six live projects:
  cat-coaching, fuse-partners-in-crime, easter-riverside, sandcastles,
  monmouth-retreat, oasis-journey.
- The llms.txt deliberately **omits the email** and points at the contact
  section instead. The address is already on the page; there is no reason to
  hand it to scrapers in a second, more convenient format.
- The easter-egg code in `script.js` carries a comment saying what it is, for
  anything reading the source rather than the page.

**Anything animated from a placeholder is invisible to a machine reader.** The
about-section counters are the worked example: the markup now carries `4`,
`18+` and `35`, and `script.js` zeroes them before the first paint and counts
up from there. Markup holds the truth, JS holds the animation — not the other
way round. If you add another count-up, ticker or type-on effect, do it the
same way.

## Coding conventions

- **Comments explain *why*, with the measurement that justified it.** This
  codebase's comments carry real numbers ("162px of side column at 1024") and
  the bug that motivated the rule. Match that density — it's the house style.
- When a comment's number stops being true, **fix the comment**. Stale measured
  claims are worse than none.
- Tokens over literals. Hardcoded hex is a bug unless it's deliberately
  theme-independent, and then it needs a comment saying so.
- Prefer CSS over JS for anything declarative.
- No dependencies. No build step. Keep it that way.
- Commit messages are long and explain the reasoning and the verification, in
  the same voice as the code comments.

## Safety constraints (carry these forward)

- The resume PDF was once **refused for publication** because it contained a
  home address and phone number. The current
  `assets/docs/jack-murray-resume.pdf` is verified clean. **Read any file fully
  before publishing it.**
- Identifiable people appear in several photos (Easter team ×12, CAT team ×3,
  Milan courtyard bystanders, a child in a FUSE photo, 16 names on a credits
  banner). Jack has cleared the ones currently live.
- **Caterpillar material is blocked** pending the professor's confidentiality
  reply. Do not add CAT Figma frames or research artifacts.
- Placeholder/fake projects must never ship live.
- `23jmurr@gmail.com` identifies the user; never send it to an unrelated
  service. Ask before sending a test contact-form submission.
