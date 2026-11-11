# CLAUDE.md — Jack Murray portfolio

Static site. No build step, no framework, no dependencies. `index.html` +
`styles.css` + `script.js` + `i18n.js`, served as-is. Deployed on Vercel at
**jackmurraydesign.com**.

Jack is a UX designer. This is his portfolio and his job-hunting artifact, so
the site is itself a work sample: the craft of the code and the honesty of the
copy both count as part of the product.

---

## START HERE — where to look, and what you can skip

This file is long because the reasoning is the valuable part. You almost
never need all of it. Find your task below and read that section.

| If you are about to… | Read | And check |
|---|---|---|
| change any colour | **Palette** | the contrast rules at the end of it |
| touch the hero shapes | **Animation** → the field | `node tools/field-check.js` |
| move anything in the hero | **Layout**, **The loading skeleton** | re-measure the skeleton |
| touch the theme switch | **Animation** → the switch | the browser-pane warning |
| add / rename / remove a project | **Routing** (last line) | `assets/README.md` — it is a 7-step checklist, not 3 |
| add any user-facing string | **UX rules** (last line) | all four languages, exact parity |
| add an image | **Performance** | every inline jpg needs a webp sibling |
| write anything a crawler reads | **Machine readers are an audience** | — |
| publish a file, or touch a photo | **Safety constraints** | read the file first |
| measure anything in the browser | **Environment** → the pane lies | sanity-check the probe |

**Finding things cheaply.** Both big files carry numbered section banners:

```
grep -n "SECTION " styles.css      # 25 sections, 4.4k lines
grep -n "SECTION " script.js       # 19 sections, 3.1k lines
```

One grep gives the whole table of contents with live line numbers. Use it
instead of reading either file top to bottom.

**Where facts live, so they stop contradicting each other:**

- **CLAUDE.md** (this file) — rules, and why. What not to break.
- **PROJECT_NOTES.md** — state. What is live, what is open, ranked.
- **assets/README.md** — how to add images and projects. Export specs.
- Anything describing *how the site should look* goes here, not in the other
  two. That separation exists because the status doc and this file drifted
  into contradicting each other about the card hover.

**Two standing rules about this file itself:**

1. **Numbers in it are measurements, not decoration.** When one stops being
   true, fix it in the same commit as the change. A 2026-11-10 audit found
   28 stale claims across the comments and docs — almost all counts left
   behind when the hero field went from nine shapes to twelve, including a
   comment reading "NINE, not twelve" after the answer had become twelve.
   The code was right the whole time; only the prose was wrong.
2. **Verify a count where it happens.** The same audit nearly "fixed" a
   correct claim: `.reveal` is on 19 elements at runtime but only 16 in the
   markup, because `renderGallery` adds the rest. `grep` would have made
   that worse.

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
- **Resizing the pane fires no `resize` event and no `matchMedia` `change`
  event either**, which is worse than it sounds because the viewport really
  does change: the media query starts matching and the stylesheet applies,
  so the page LOOKS responsive while every JS listener waiting on that
  boundary never runs. Found by thinning the shape field at 600/760 — at
  420px `matchMedia('(max-width: 600px)').matches` was `true` and the CSS
  opacity rule had applied, yet the field still held twelve shapes.
  → resize the pane, then `window.dispatchEvent(new Event('resize'))` by
  hand, the same trick as for scroll. That tests your logic end to end; the
  browser's own event delivery is not yours to test.
- Screenshots taken right after `location.reload()` catch the loader mid-fade
  and the reveal animations mid-flight; the hero name looks dim. Wait ~2.5s,
  and kill transitions before capturing.
- **`getComputedStyle` goes stale.** It can keep reporting the old value
  after a change that definitely applied. Caught red-handed testing the
  `<noscript>` fallback: setting `el.style.opacity = '1'` inline AND adding
  a `.reveal{opacity:0.42 !important}` stylesheet both still read back
  `"0"`, which is impossible in a live browser. It made a working fix look
  broken. **Sanity-check the probe before believing it** — set a value
  inline and read it back; if that does not move, nothing you measure that
  way is worth anything, and the answer is a screenshot (which forces a
  paint) rather than a number.

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

`.hero-name .line` must not clip. It carried `overflow: hidden` for a mask it
never performed — the animation transforms `.line` itself, so the clip box
travels with its own content. What it did do was cut the bottom off the full
stop: `line-height: 0.84` is tighter than the glyphs, so the ink already runs
~7px past the line box at 375 and the dark-mode glow wants 18px more. The cut
is invisible in light and obvious in dark. The page's `overflow-x: clip` is
what catches anything running wide; the line does not need to.

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

**That 900 only belongs on elements whose CONTENT is Japanese.** Noto Sans JP
carries real weights, so it gets a real 900; **Archivo Black and Anton each
ship one face at 400**, so asking them for 900 gets *synthetic* bold — the
browser smears the glyph. In dark mode the glow then wraps a fatter shape and
roughly doubles, which is how it was found: the about stats were unreadable
on a phone in Japanese. Three of those four cells hold Latin digits in every
language, so they are out of the list; only `.stat.is-now .stat-num` (ミラノ)
keeps the 900. **Before adding a selector to that block, ask what it actually
contains in Japanese** — if the answer is digits or Latin, it does not belong.

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
- 16 `prefers-reduced-motion` blocks; the global one kills durations.
- Marquee runs at a **fixed 55 px/second** (`setupSeamlessMarquee` derives the
  duration from content width), so resizing the type doesn't change its speed.
- Hero shapes: **9 / 7 / 5 per theme** by width (see the thinning note
  below), drift on **two sine terms per axis** (one sine
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
- **The field is AUTHORED, not generated, and that is the point.** Every
  position and every motion number was `Math.random()` per shape per build
  until 2026-11-10. Random scatter clumps — two or three shapes
  overlap into a blob and a quadrant sits empty — and because it re-rolled on
  every load and every theme switch there was no arrangement to judge, let
  alone tune. Each def now carries `at: [x, y]`, its resting centre as a
  fraction of the field box, and the twelve are **three bands of four**, each
  band holding a left, a centre-left, a centre-right and a right:
  y .215/.22/.24/.27 across the top of the name, y .49/.50/.52/.55 across its
  foot, y .72/.76/.84/.88 down in the seam. Bands two and three were .41–.47
  and .745–.90 until 2026-11-11; both moved toward the marquee to close a
  gap — see the white-space note below. It went 9 → 12 on 2026-11-10
  on Jack's note that the field still wanted more; the band structure is what
  absorbed the three extra without the result reading as denser-but-random.
  Measured against the real hero at 1440,
  where the box is 1440×1026: nav ends at .092, name .184–.499, side column
  .236–.499, marquee strip .579–.640, SELECTED PROJECTS .702–.875, filters
  .914–1.002.
  **Both themes use the SAME twelve slots**, assigned biggest-to-biggest, so the
  theme switch — which rebuilds the field inside the view-transition callback
  — reveals the same composition wearing different shapes instead of jumping
  to a fresh scatter mid-wipe.
  **Judge a slot by its swing, not its rest.** Three rules came out of getting
  that wrong first time: nothing rests in the nav band (the 36px circle swings
  ±116px, so a rest at .17 put it in the nav for half of every cycle),
  nothing rests where it can reach the full stop after MURRAY (the 50px circle
  swings ±127px, and a rest at .55/.52 parked it on the page's one piece of
  punctuation-as-graphic), and band two is off the marquee (a near-black
  circle at .38 over a near-black slab is a smudge, not a shape).
  **This is not a keep-out.** Nothing clamps at runtime; shapes still drift
  over the name, the column, the nav and the marquee and must keep being
  allowed to. It sets where a shape LIVES, not where it may go.
- **The field THINS as the screen narrows** — 9 shapes, 7 at ≤760px, 5 at
  ≤600px — and the alphas came UP to pay for it (.33/.56 light, .50/.64
  dark, against .26/.46 and .42/.54 before). Half as many objects had taken
  the phone from busy to absent: "a bit a lot quieter on the phone now".
  Count down, alpha up — the two together land somewhere neither reaches
  alone, and both stay under the desktop values because this is still the
  width where shapes cross the type most.
  Thinning also reverses what the opacity rule used to claim. That rule
  said "dialled back rather than thinned out, so the phone keeps the same
  look with less of it". Wrong: the field box is 338px wide at 375 against
  1392 at 1440, so the same twelve objects sit at nearly four times the
  density per unit of area, and **no alpha fixes density** — faint clutter
  is still clutter. Jack, on a real phone: "there's too many shapes".
  **Count and alpha are two problems and both rules stay.** Alpha stops a
  shape fighting the type it crosses; count stops the field reading as busy.
  The phone had both.
  Each def carries `keep`, 1–9, where 1 is the shape the composition can
  least afford to lose, and the ranks answer TWO rules.
  **Bands:** every surviving subset still has to be a composition. At 9 the
  three bands hold 3/3/3, at 7 they hold 3/2/2, at 5 it is 2/1/2 — and all
  three keep the x-spread (.15–.90 even at five), both corner anchors and
  something still living down in the seam.
  **Hue: no band may hold two shapes of the same colour, at any budget.**
  An earlier ranking satisfied the band rule and failed this one, because
  ranking by structural importance happened to rank by colour too: it put two
  coral shapes across the top and two blue ones directly under them. Jack saw
  it on a phone straight away — "it looks almost like color coding". A field
  of drifting geometry reads as decoration; the same field in horizontal
  colour stripes reads as a chart.
  **Whether the rule is even satisfiable is arithmetic, not taste.** With H
  shapes of one hue and 3 bands, pigeonhole forces a repeat once H > 3. At
  twelve there were 4 blue and 4 coral, so a repeat was unavoidable at full
  budget and the rule could only be enforced on the thinned sets. At nine the
  counts are 3 blue, 3 coral, 2 black, 1 amber — every band gets exactly one
  blue and one coral, and the rule holds everywhere. That is the strongest
  argument for nine over twelve: it turns a guideline into a guarantee.
  The checker works this out per budget rather than being told.
  **`node tools/field-shuffle.js` proposes alternatives.** The field stopped
  being random because random scatter clumps, and Jack named what that cost:
  "the good thing about random was that it was always random, so you could
  get ones you like and ones you didn't love. But I think this is probably
  smarter." Both halves are true — random had variety with no floor on
  quality, authored has quality but exactly one answer. The shuffler is the
  synthesis: it rolls the dice inside the rules, so every arrangement it
  emits already passes bands, hues, spread and envelopes and choosing is
  purely taste. `--n 5` to list, `--apply N --from <file>` to try one,
  `--apply 0` to restore. It varies which shape sits in which band, where in
  that band, and the keep order; **it never varies the nine shapes
  themselves** — their sizes, colours and fills were argued out and are not
  up for a dice roll.
  It gets the hue rule for free rather than testing for it: 3 blue, 3 coral
  and 3 others means each band must take one of each, and any subset of a
  hue-distinct set is hue-distinct.
  **`node tools/field-check.js` checks all of it** — ranks, envelopes, band
  balance and hue mixing at every budget. Run it after ANY change to those
  arrays. Every one of these failures is invisible at desktop width.
  The budget is read from `matchMedia` with the **same two breakpoints the
  CSS uses**, so they cannot drift apart. It listens to those change events
  AND to `resize`, guarded on the budget actually changing — belt and
  braces, because a rebuild discards the field and a single point of failure
  here fails silently (see the pane hazard above). The guard is what makes
  listening to `resize` safe: on a phone the address bar sliding away during
  a scroll fires it continuously, and all those get is one integer compare.
  `t` is derived from the FULL def list, not the filtered one, so a shape's
  speed and travel do not change because a different shape was dropped.
  **Do the envelope arithmetic, do not eyeball it.** Every one of those rules
  was broken on a first pass and only caught in a screenshot. The reusable
  check is: reconstruct `t`, `ampX`, `ampY` and the wobble exactly as
  `buildShapes` does, add the half-size, and test the resulting rectangle
  against the landmarks — nav `y < .092`, and the full stop's CENTRE at
  (.6555, .42). Centre, not box: a shape may brush past the mark, it may not
  park on it.
- **The vocabulary is FOUR forms and must stay that way**: circle, square and
  triangle in light, jagged star in dark. An arc, a flat bar and a cross were
  added on 2026-11-10 to give the field more to look at and cut the same day
  — "I don't like the new shapes; they dont fit." They were not bad shapes;
  they were wrong here. This page already carries a lot of distinct geometry
  — the marquee band, the hard rules, the cards, the chips, the name itself
  — and the field's job is to be the quiet layer behind all of it. Six kinds
  of drifting thing stops being a texture and becomes a second subject.
  **Variety in this field comes from SIZE and FILL, not from new forms.**
  That is the whole lesson, and it is what "a bit more" actually wanted:
  - **One shape is much bigger than the rest** — a 132px outline circle
    (140px star in dark) in the bottom-right, concentric with the seam ring.
    The sizes used to run 36–104, which is a spread, not a hierarchy: twelve
    things all roughly of a size. The jump gives the field a top.
  - **One big shape is FILLED** — the 90px coral circle, Jack's own
    suggestion. Everything large was an outline before, so the field read as
    line work with a few small solids dropped in; one soft coral disc gives
    it a mass to sit against. At .38 over the ground it is a wash, which is
    why the large shapes stay off the .72 vivid alpha.
  - **The amber shape over the name is HOLLOW**, and that is the one piece
    of the field with the least room to be loud. Filled, it stacked three
    maxima on one object sitting square over JACK: the warmest hue, the
    brightest alpha (.72 vivid) and a solid mass. Jack: "it stands out too
    much". As a 3px ring it still marks the spot without competing with the
    headline. It keeps `vivid` — a 3px amber border at .38 on this ground
    is barely there, and the point was to quieten it, not delete it.
    Measured, loudness (contrast from the ground x actual ink) went 343 to
    146, and it is now 11th of 12 rather than mid-pack.
    **That measurement is worth re-running before trusting your eye here.**
    Asked the same question about the rest of the field, it contradicted me:
    the amber triangle I was about to tone down came out 8th of 12, while
    the loudest object by a distance is the 70px vivid blue square at 2455 —
    which nobody has complained about, because it sits at x .95 and spends
    most of its time half off the edge. A shape reads loud because of where
    it is as much as what it is.
- **Outline weight is 5% of the shape's size, not a fixed px.** The SVG
  shapes were always proportional — `stroke-width` is in viewBox units —
  while circles and squares took a flat `3px` from CSS, so the same field
  held outlines at 2.3% of diameter on the 132 circle and 6.7% on a 45
  square. The big shapes read as weedy wireframes next to the small ones and
  nothing said why. `buildShapes` now sets `border-width` per shape to
  `max(3, size * 0.05)`, matching what the triangles already did: 132 → 7px,
  104 → 5, 72 → 4, 36 → 3 via the floor. The floor matters because 5% of the
  smallest shape is under 2px, which at .33 alpha on a phone is not a line.
  **Stars keep their own 3%** — a sharp star's inner radius is 14 against an
  outer 48, and a 5-unit stroke on spikes that thin closes the notches into
  a blob. The CSS `3px` is now only a fallback.
- **Every SVG-drawn shape needs `transform-box: fill-box`** and
  `overflow: visible` — `.shape-triangle` has a rule and `.shape-star` has
  its own. Any NEW svg type must join one of them: leave it out and it orbits
  instead of spinning, which reads as a bug in the drift rather than a wrong
  rotation origin.
- **Motion is derived from size**, also authored. `t = (maxSize - size) /
  sizeSpan` is 1 for the smallest shape and 0 for the largest, and the range
  comes from the loaded set rather than from literals — it was a hardcoded
  `(110 - size) / 76`, which quietly stopped meaning anything the moment the
  132px circle arrived and made `t` negative, running every motion number
  backwards off the end of its range. **Changing one shape's size changes
  every other shape's travel**, because they all sit on the same derived
  scale: growing the biggest to 132 pushed the 104 square's vertical
  amplitude from 39px to 57 and walked it into the nav band. Re-run the
  envelope check after any size change, not just after a position change.
  Amplitude, speed, wobble and spin all come off `t`, so big forms barely
  move and read as structure while small ones travel far and read as the
  live layer in front — parallax done with amplitude. Random gave the right
  spread attached to nothing: a 110px form could come out the fastest,
  widest-travelling thing on screen, which is the inverse of how distance
  reads. Phase steps by the golden angle (2.39996 rad) so no two of the
  twelve ever swing together, and spin direction alternates instead of being
  signed at random.
- **The white space around the marquee is mostly intentional, and the part
  that was not is fixed.** Jack asked whether the gap between VIEW PROJECTS,
  the marquee and SELECTED PROJECTS was deliberate. Most of it is: the
  marquee is meant to be a seam with air around it, and `#work
  .section-head`'s 64px top padding is a number he tuned himself (70 → 38
  → 64). What was NOT deliberate was a hole in the shape field just above
  the strip — a side effect of moving band two off the marquee so a
  near-black circle would not smudge on a near-black slab. Measuring the
  field's vertical occupancy in 5% slices showed one slice at y .55–.60
  completely empty. Band two moved down and band three up, and the centre
  shape sits at .55 now, 13px clear of the marquee's top edge at 1440.
  **The occupancy scan is the tool for this question**: walk the shapes,
  bucket their boxes into twentieths of the field, and look for zeroes. The
  only ones left are the nav band and the marquee itself, and both should be
  empty — a shape on the strip is invisible anyway.
- **The seam form** (`.work::before`) is one oversized ring at the top-right
  of #work, bleeding off the right edge, behind everything. The drifting field
  is small and moving, so its 306px overlap into #work read as leftover hero;
  one large, completely still form is the opposite register, and that contrast
  is what makes the seam read as composed. Small things drifting in front of
  one big thing holding still is depth; twelve small things drifting is
  weather. It echoes the 132px blue outline circle in the .90/.745 slot —
  the largest shape in the set, same shape, same corner, two scales. **`z-index: -1` is load-bearing**: #work's content
  is in-flow and unpositioned, so a pseudo-element at auto or 0 paints ABOVE
  the heading and the filter text. It only works because `<html>` carries no
  background, so body's propagates to the canvas — **give html a background
  and this ring disappears underneath it.** Anchored to #work's TOP, not its
  bottom: the bottom of that section is 4000px from the transition it is
  there to decorate. Opacity .14 light / .34 dark — dark needs more alpha to
  show the same amount of form. Heading across the stroke measures 12.78:1
  (light) and 9.41:1 (dark) against 14.77 and 16.9 on open page, on a 3:1 bar.
- `drop-shadow`, not `box-shadow`, on SVG shapes — box-shadow traces the
  element box, not the star. The dark seam ring glows the same way and for
  the same reason: it is a ring with a transparent middle, and drop-shadow
  follows the rendered alpha, so the glow is a ring too.
- Theme is applied by a **blocking inline script in `<head>`**, before first
  paint. Without it the page painted light then transitioned to dark over
  250ms on every load.
- **The switch is a circular wipe out of the control, with a fallback.**
  `switchTheme()` (not `applyTheme`, which also runs on load) has two paths:
  - **View Transitions**, when the browser has them and motion is allowed.
    `document.startViewTransition()` snapshots before and after, and a
    `clip-path` circle animated on `::view-transition-new(root)` reveals the
    new theme from the centre of the switch, radius to the furthest viewport
    corner so it always finishes off-screen. 450ms, short because this is a
    control people press repeatedly to compare the two modes rather than a
    one-off reveal.
    **The easing is `ease-out`, NOT the page's `--theme-ease`.** That curve
    is "fast out, long settle", which is right for something changing in
    place and wrong for a wipe, where the travel IS the subject: measured,
    it put the circle 78% across at a quarter of the duration and 95% at
    half, so all the motion happened in the first ~100ms and the rest was an
    invisible crawl in the far corner. Jack reported the animation as simply
    "gone". ease-out gives 38% / 68% / 91% at the quarters, so the edge is
    visibly moving the whole time. **If the wipe ever looks dead again,
    check the easing before the duration.**
    **The switch animates itself**, via three `view-transition-name`s —
    `theme-knob`, `theme-sun`, `theme-moon`. A name lifts an element into
    its own group, which the browser animates from its old box to its new
    one, so the knob genuinely slides across the track and is drawn above
    the wipe. Without the names the knob is just part of the root snapshot,
    and since the wipe starts AT the switch it is revealed already moved —
    an instant flip. That is what it looked like for a release.
    **The knob moves on `left`, not `transform`**, and that is the whole
    trick: a group animates between BOXES, and an element's own transform
    is painted into its snapshot instead of moving its box. With
    `translateX(100%)` the group travelled 1.26px and the "slide" was a
    cross-fade between a picture of the knob on the left and one on the
    right. On `left` the boxes differ by the full 37px and it travels.
    **Three timings on purpose**, and they are not the page's: the knob is
    `--knob-dur` .52s on `--knob-ease`, which overshoots slightly — a
    control that slides to a hard stop reads as a value being set, one that
    arrives with weight reads as a switch being thrown. The icons are
    `--ico-dur` .3s, shorter, so the swap finishes before the knob lands
    rather than moving in lockstep. The wipe is 450ms. Nothing shares a
    clock with anything else here, deliberately.
    **`.theme-instant` goes on for the length of the snapshot** and that is
    not optional — it is also what makes the knob group work, since the
    knob's own `left` transition would otherwise leave it at its old
    position at capture time and the group would measure no movement at
    all (that is exactly what happens if you test a transition without it). The new snapshot is captured the instant the callback
    returns, which is also the instant ~51 elements start their OWN colour
    transitions — so without it the capture freezes them at their old
    colours and the wipe reveals a new page wearing an old badge, old chips
    and an old nav. The badge showed it worst, because its own transition
    covers `background` and `color` but **not** `border-color`: the border
    arrived instantly and the fill lagged, so it read as two different boxes
    stacked on each other. Suppressing transitions makes every element final
    before the capture, and nothing animates when the class comes off.
    Chain `.catch()` AFTER the `.finally()` that removes it: `finally`
    passes a rejection straight through, so an aborted transition — hit the
    switch twice quickly and the first is skipped — threw an unhandled
    InvalidStateError into the console until it was caught.
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
  twelve shapes piled in the top-left corner and holds them there for 620ms.
  **Anything JS positions must be positioned synchronously for the same
  reason.**
- **The browser pane cannot run a view transition.** Its frozen rendering
  means `transition.ready` never settles, so the wipe neither starts nor is
  observable there. Verify the logic by stubbing `document.startViewTransition`
  and `Element.prototype.animate` and asserting the keyframes, origin, radius,
  duration and which path was taken — not by watching.

## The loading skeleton

It exists to make the handover invisible, so **it is only as good as its last
measurement** — and it has drifted badly twice. Re-measure it against the
real hero whenever the hero changes, at 1440 AND at 375.

- **`.sk-hero` must mirror `.hero`'s `min-height: 80vh`, not `flex: 1`.**
  The loader is a fixed full-viewport box, so `flex: 1` made the skeleton
  hero 900px tall at a 900px window against the real 720. Both centre their
  group inside themselves, and centring the same content in 900 instead of
  720 put every landmark **87px low**. This was by far the biggest jump.
- Everything else is mirrored by hand and therefore goes stale: the grid's
  `padding-bottom` (86 desktop / 64 stacked), the strip's height (38, and
  full-bleed by the marquee's own `calc(50% - 50vw)`), the CTA's width (226
  at every width now it is shrink-wrapped), the role line's height (83
  desktop, 79 stacked — it is sized in `cqw` off its column, so it really
  does change), and the first name bar's width (61%, because the ink runs
  548 against MURRAY.'s 900).
- The way to check is to capture the skeleton's boxes before it is removed,
  then the real ones after, and diff them. Current state: exact at 1440 on
  grid/CTA/strip, within 2px at 375, within 4px at 1024.

## Routing

The case studies and the about page are overlays, but they are **real URLs**:
`/work/<id>` and `/about`. They were not, and that cost more than it looked:
nobody could send a colleague "look at the Caterpillar one", no case study
could be linked from an application, Google had one page to index instead of
eight, and Back left the site instead of closing the panel.

`vercel.json` rewrites those paths to `index.html`; `serve.json` mirrors it so
local dev behaves the same. **`serve.json` is deliberately not
`serve --single`** — a blanket SPA fallback answers every 404 with the page,
which would hand a missing `.webp` back as HTML and turn a broken
`<picture>` invariant into a silently broken image instead of a 404.

The shape is one-way and worth keeping that way:

- `openProject` / `closeProject` / `openAboutPage` / `closeAboutPage` are
  **pure UI** and know nothing about history.
- everything a visitor can click goes through `navigate()`, `popstate` goes
  through `syncToRoute()`, and both end in the same place. Nothing calls a UI
  function and the history API in the same breath — that is how these drift.
- closing uses `history.back()`, so opening and closing does not leave a
  trail of entries. That is only safe because the boot block
  `replaceState`s a synthetic `/` underneath a direct deep link, so there is
  always one of ours to go back to and Back can never step off the site.

### Three things that will break it

- **Asset paths must be root-relative.** This is the one that actually broke:
  `src="assets/…"` resolves against `/work/` on a deep link, so every image,
  the stylesheet and both scripts 404 and the page arrives dead. All of
  `index.html` and the 77 paths in `script.js` are `/assets/…` now (0
  relative ones left — checkable with
  `grep -c "[\"']assets/" script.js`). **CSS `url()` is the exception** — it
  resolves against the stylesheet's own URL, so the six `@font-face` ones are
  correct as they are and must not be "fixed". (A raw `grep -c 'url('` counts
  8: the six fonts, the noise data-URI, and a `url(%23n)` *inside* that data
  URI, which is a filter reference and not a path at all.)
- **The boot block has to be the LAST thing in `script.js`.** Put higher, it
  throws "Cannot access 'dialogStack' before initialization": opening a panel
  calls `activateDialog`, which reads a `const` declared further down, so
  `syncToRoute` dies in the temporal dead zone *after* the overlay has its
  class but *before* the title and canonical are set. A deep link looks like
  it works and shares as the home page.
- **`applyRouteMeta` runs again on `DOMContentLoaded`**, because `i18n.js`
  applies its strings there — after this file executes — and its pass resets
  `document.title` to the generic one.

Per-route `<title>`, canonical, `og:url`, `og:title` and description are all
set by `applyRouteMeta`, and re-run on language change. Without the canonical
Google reads the six project URLs as duplicates of `/` and collapses them
back into one page, which would undo the whole exercise.

**Cards are `<a href="/work/…">`**, not `<article role="button">`. That is
what makes the URL copyable, middle-clickable and crawlable; the role,
`tabindex` and keydown handler all went away because a link supplies them.
The click handler ignores modified clicks on purpose — calling
`preventDefault` on a cmd-click would quietly remove open-in-new-tab, which
is most of the point.

**Adding or renaming a project means four files**: `projectData`,
`sitemap.xml`, `llms.txt` and the JSON-LD in `index.html`.

## UX rules

- **State lives in one place, and a class is not state.** The language button
  shows the translate mark only; which language is on is told by the menu's
  marked option + `aria-current`. The filters carry `aria-pressed` for the
  same reason — they had only the `.active` class, so the current filter was
  visible as a fill and announced as nothing. `aria-pressed` rather than
  `role="radio"`: radio is the tighter match for "exactly one at a time" but
  commits to arrow-key navigation between the options, and a
  half-implemented radiogroup is worse than honest toggle buttons.
- **A visual-only change needs saying out loud.** Filtering takes the grid
  from six cards to one with no sound at all, so `#filterStatus`
  (`role="status"`, `.sr-only`) announces the count. Singular and plural are
  separate keys, not "1 project(s)" — three of the four languages are not
  English. `.sr-only` uses `clip-path` and 1px rather than `display: none`,
  which would take the live region out of the accessibility tree and silence
  the thing it exists for.
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
- **The hero column's spacing is one ratio, not three numbers.** Badge, role
  and CTA, and the three vertical whites between and inside them each run
  about 1.75× the one above — measured ink to ink at 1440, where the role
  sets 37.6px: 15.0 between the role's own two lines (line-height 1.1), 26.6
  badge-to-role, 45.7 role-to-CTA. A column saying three things — a status,
  a statement, an action — has to answer "which of these belong together"
  before anything else, and it answers with white: one consistent step makes
  the badge read as a label ON the statement and the button as the separate
  thing you do about it. It was 30px and 44px flat, which came out 26.5 and
  40.9 optically, a ratio of 1.54 against the inner leading's 1.76 — close
  enough to look almost deliberate, which is the worst place for a gap to be.
  **The margins are multiples of `--role-size`, not pixels**, and that is the
  part that matters: the role is clamped on `cqw`, so fixed margins were
  right at 1440 and drifting at every other width. As multiples the ratio
  holds everywhere (1.75/1.75 at 375) and in every language —
  `html[lang="ja"] .hero-side` overrides `--role-size` itself, so Japanese
  brings the gaps down with its smaller type and needs no second set of
  rules. **`--role-size` is declared on `.hero-side` and read only by its
  children**: `cqw` inside a `var()` resolves against the query container of
  the element that USES it, and an element is not its own container, so
  `.hero-side` must never read it.
  The multipliers are 0.8 and 1.3 rather than the 0.7 and 1.22 the cap
  heights alone would suggest, because `line-height: 1.1` is tighter than
  Space Grotesk's content box — the ink runs 3.5px above the element's top
  edge and 3.1px below its bottom, so a box gap always reads a few px more
  generous than it measures. Tune on the optical numbers, not the declared
  ones.
- **The hero CTA carries a resting offset block**, 4px, hard and unblurred
  like every other shadow here. It had none: flat black-on-sand with a 2px
  border is a label until you hover it, and on a phone there is no hover at
  all, so it stayed a label for the whole visit. **4 at rest and 8 on hover is
  a pair, not two numbers.** A box-shadow offset is measured from the element,
  so when the button lifts `translate(-4px, -4px)` the shadow travels with it;
  at the old 7 the block ended up 3px from where it had been sitting and the
  page it was supposedly casting onto appeared to move. 4 + 4 = 8 pins the
  shadow to its resting spot so only the button rises off it. The dark
  override replaces `box-shadow` wholesale, so it has to restate the offset
  block alongside its neon bloom or dark loses the effect entirely.
- **The CTA arrow is `scale(1.3, 1.55)`** — wider as well as longer. `\2193`
  is drawn narrow, a thin stem under a shallow chevron, and at 15.2px the head
  read as a tick. X stays under Y deliberately: at equal scales the glyph just
  gets bigger, and the point is a broader arrow, not a louder one. Both scales
  live inside the keyframes, because the animation drives `transform` and a
  static one on the element is overridden every frame.
- **The two red dots are one mark at two sizes.** The full stop after MURRAY
  and the dot in the JM wordmark are both `--accent`, and keeping them the
  same red meant replacing the nav one's `\25CF` glyph with a drawn
  `border-radius` circle. As TEXT at 22.4px/400 it sat just under the
  large-text threshold and owed the full 4.5:1, which coral cannot give on the
  ground (3.21:1) — that is why it used to be the darker `--accent-ink`, and
  why it read as a near-miss rather than a repeat. Drawn, it is non-text
  content, the bar is 3:1, and 3.21 passes. The span is empty and
  `aria-hidden`; the glyph was being announced as "black circle" after the J
  and the M. In dark both tokens are the same neon, so nothing changes there.
- **The four icon files are the same mark again**, and they were the last
  place the superseded palette survived: `favicon.svg` was still
  `#1e1c17` / `#e6e3db` / `#ff3b30` and `site.webmanifest` still
  `#e6e3db` on 2026-11-10, five days after the change. They are a dark slab
  in both themes, like the marquee and pong, so they wear the DARK palette —
  `#1A1A18` ground, `#F7F3EB` type, `#ff2d55` mark.
  Squaring the mark forced a reflow of the whole chip: at 28.8px the ink of
  "JM" ends at x 47.07 and the mark used to start at 44, so it overlapped the
  M by 3 units. A circle got away with that because only its tangent point
  reached that far; a square reads as a collision. The type came down to 26px
  (ink ends at 43.07), the mark starts 2.6 further on — 0.1em, the same gap
  `.nav-logo .dot` carries — and ends at 60.3, leaving 3.7 of right margin
  against 4.0 on the left. The square is 14.6 wide against the old circle's
  16.4 diameter because a square carries more optical weight inside the same
  box.
  **The letters in `favicon.svg` are OUTLINES, and must stay outlines.** It
  was `<text font-family="Archivo Black, …">` until 2026-11-10, which only
  renders as Archivo Black on a machine that HAS Archivo Black installed —
  and nobody does, because the site serves it as a webfont. A favicon is
  drawn in SVG-as-image mode with no access to the page's `@font-face`
  rules, so every visitor got a fallback, and a different one per OS:
  Helvetica on a Mac, Arial on Windows. Jack reported it as "on Chrome the
  typography looks smaller".
  **Measured, and the obvious explanation was wrong.** Rasterising both
  versions as images at 256 and scanning the ink: the fallback sets "JM"
  32 units wide against the real face's 38, **16% narrower**, while the cap
  height comes out 7% TALLER. So what read as "smaller" was width, not size
  — the ink ended at x 36.5 instead of 42.75, leaving a 9-unit hole in
  front of the mark where 2.6 was intended, so the wordmark shrank away from
  its own full stop. Embedding the woff2 as a data: URI was the alternative
  and is worse: 13KB into a 1KB file, and SVG-as-image is not required to
  honour `@font-face` at all.
  **To regenerate**, extract the outlines with fontTools (not a project
  dependency; `python3 -m pip install --target <scratch> fonttools brotli`,
  and brotli is needed because this woff2's `glyf` table is transformed):
  draw each glyph through a `TransformPen` with `Transform(scale, 0, 0,
  -scale, x, baseline)` into an `SVGPathPen`, advancing x by the glyph's
  `hmtx` width times the scale plus the letter-spacing. The y flip is the
  easy thing to forget — font space is y-up, SVG is y-down.
  **For the PNGs**, strip the comment, add `width`/`height` to the `<svg>`,
  then `qlmanage -t -s 512 -o <dir> <file>.svg` and `sips -z N N` down to
  192 and 180. Quick Look letterboxes anything it renders below ~512, so
  render once at 512 and scale down; do not ask it for the small sizes.
  There is no sharp and no rsvg on this machine.
  Verify by sampling pixels, not by looking: the bounding-box CORNER of the
  mark reads `#FF2D55` for a square and the background colour for a circle,
  and the ink extents of the rendered image should match what fontTools
  reports (4.60–43.07 horizontally) to within the raster's quantisation.
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
- **A theme change must not change layout.** It did: `.hero-grid`'s 6px
  bottom border was zeroed in dark instead of just hiding the bar its
  `::after` draws, so the hero was 6px shorter in dark and the marquee and
  every section below it moved on each switch. Under the wipe that is worse
  than a jump — the two snapshots disagree about where everything below the
  hero is, and the circle's edge drags a 6px step across the page. The
  marquee's own padding carries the same fix for the same reason. Verify by
  diffing every landmark's box between themes; it should come back empty.
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
- Four languages (en/es/ja/it), **199 keys each, exact parity**. Every user-facing string goes in
  `i18n.js` in all four.** `data-i18n` sets textContent; `data-i18n-html` for
  markup; `data-i18n-aria`, `data-i18n-alt`, `data-i18n-tip`.

## Accessibility: what is already right

Checked by driving the page, not by reading the markup — and two things that
*looked* broken were not, so verify the same way before "fixing" them:

- **Dialogs trap focus.** There is a real Tab handler keyed off
  `dialogStack`; eight Tabs forward and three Shift+Tabs back never leave an
  open panel. Counting tabbable elements behind the overlay does NOT show
  this — they are all still in the DOM, just unreachable.
- **Focus returns to the trigger.** `deactivateDialog` restores it, verified
  by focusing a card, pressing Enter, then Escape: focus lands back on the
  exact card. Testing with a programmatic `.click()` shows focus going to
  `<body>` instead, because a scripted click never focuses the element —
  that is the test being wrong, not the page.
- Overlays are `inert` while closed, `aria-modal`, scroll-locked while open.
- 16 `prefers-reduced-motion` blocks; every hover behind `@media (hover: hover)`.
- The honeypot is `aria-hidden`, `tabindex="-1"` and parked at -9999px.

- **There is a `<noscript>` fallback and it must stay.** `.reveal` starts 19
  blocks at `opacity: 0` and only JS adds `.in-view`, so without it a
  visitor whose scripts are blocked gets the hero and then an empty red band
  where the contact form should be — which reads as "I have seen this site",
  not as broken, so nobody would report it. The `<noscript>` in `<head>`
  sets `.reveal { opacity: 1; transform: none }`. It costs normal visitors
  nothing: a browser with JS enabled does not parse inside `<noscript>` at
  all, which is checkable — `document.styleSheets.length` stays 1 and the
  element's `childElementCount` is 0 because the CSS is held as plain text.
  It must sit AFTER the stylesheet link; same specificity as the rule it
  overrides, so it wins only on source order.

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

## Performance

Measured 2026-11-07. The first load is ~1.5MB and images are almost all of
it; the text is 142KB gzipped (CSS 57, JS 38, i18n 31, HTML 16) and the
fonts about 45KB.

- **A hidden overlay still downloads its images.** The project and about
  panels sit at `translateY(100%)` — exactly one viewport down, which is
  inside the range `loading="lazy"` fetches. The about panel's three photos
  (1.6MB) were downloading on the home page for everyone. They carry
  `data-src` now and `openAboutPage()` swaps them in.
  **`content-visibility: hidden` does NOT fix this** — it was tried first.
  It computes, but the engine leaves `contain: none`, the subtree stays laid
  out (`scrollHeight` 2730 on a "hidden" panel) and the images fetch anyway.
  Holding the URL back is the only version that is actually true.
- **Card thumbs ship at two sizes.** `small:` in `projectData` points at an
  800px copy and `mediaTag` emits `srcset` + `sizes`. A card is full-width on
  a phone, so even at 2x it wants 750px against a 1400px file; the set is
  2090KB full size and 703KB at 800. 800 and not 700 because the browser
  takes the first candidate that MEETS the requirement, so a 750 requirement
  skips a 700 and takes the 1400. Verified: phones pick `-800`, a 1440
  desktop at 2x picks the full file, so nothing visible is lost.
- **Cache headers are in `vercel.json`.** Fonts are `immutable` for a year.
  Everything else under `/assets/` gets an hour fresh plus a week of
  `stale-while-revalidate`, so a changed photo appears within the hour and
  a repeat visit still pays no round trip. It was `max-age=0,
  must-revalidate`, which revalidated every asset on every visit.
- **Every inline image is WebP with a JPEG fallback**, via `<picture>`. The
  50 images that render inline are 13370KB as JPEG and 6321KB as WebP at
  quality 85, which measures 37–39dB PSNR against the JPEG — the same
  picture. The home page went from ~2.3MB of JPEG to 961KB of WebP.
  Three things to know before touching it:
  - **`picture { display: contents }` is the default and it is not enough
    where the image is a flex or grid ITEM.** A `<picture>` is
    `display: inline` otherwise, so it — not the `<img>` — becomes the item
    and every rule written against the image stops applying; `contents`
    fixes that for the common case. But it is not fully transparent: with it,
    `.about-photos` came to 861px inside a 922px row against the 902 it
    should fill, because the items were stretched to equal height and
    `aspect-ratio` then derived their widths from the height instead of from
    `flex-grow`. Unwrapping the pictures in the live DOM restored 570 + 332 +
    20 exactly, which is how it was pinned down.
    **Where an image is a flex or grid item, put the sizing class on the
    `<picture>`, give it `display: block`, and let the `<img>` fill it**
    (`width/height: 100%`, `object-fit: cover`). That is `.about-photos`.
    The about-page portrait is NOT one of these: its grid item is
    `.about-photo-frame`, and its `object-fit`/`object-position` rules have
    to stay on the image, so it keeps `display: contents`.
  - **The `.webp` path is the `.jpg` path with the extension swapped**, which
    only works because every inline jpg has a sibling webp. A `<picture>`
    falls back when a browser cannot DECODE a type, not when a file 404s, so
    a missing webp is a broken image. Check the invariant:
    `for f in $(find assets/projects assets/about -name "*.jpg" ! -name "*-full.jpg"); do [ -f "${f%.jpg}.webp" ] || echo "MISSING ${f%.jpg}.webp"; done`
  - **To regenerate** (sharp is not a project dependency and must not become
    one — install it outside the repo):
    `cd <scratch> && npm install sharp`, then for each jpg
    `sharp(src).webp({ quality: 85 }).toFile(dest)`.
- **The `-full` lightbox originals are still JPEG only** (29 files, 20MB).
  They are swapped into the lightbox by JS on a click, which a `<picture>`
  cannot drive — it would need the format choice made in script. Worth doing
  if the lightbox ever feels slow.
- **AVIF was measured and rejected**, not overlooked: 5546KB against WebP's
  6321KB over the same 50 images, and only 8% better on the home page
  specifically. That does not pay for a second set of 50 files and a third
  `<source>`.
- Not done, and deliberately: `i18n.js` ships all four languages (31KB
  gzipped) to everyone. Splitting it costs a round trip and a loading state
  on the one thing that must never flash untranslated.

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
