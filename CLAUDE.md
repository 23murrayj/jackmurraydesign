# CLAUDE.md — Jack Murray portfolio

Static site. No build step, no framework, no dependencies. `index.html` +
`styles.css` + `script.js` + `i18n.js`, served as-is. Deployed on Vercel at
**jackmurraydesign.com**.

Jack is a UX designer. This is his portfolio and his job-hunting artifact, so
the site is itself a work sample: the craft of the code and the honesty of the
copy both count as part of the product.

---

## START HERE

**What this is.** Jack Murray's portfolio, at jackmurraydesign.com. Static:
`index.html` + `styles.css` + `script.js` + `i18n.js`, served as-is. No
framework, no build step, no dependencies, and it stays that way.

**Run it:** `preview_start {name: "static"}` (port 8080). Never a server via
Bash. **Git:** `/Library/Developer/CommandLineTools/usr/bin/git` — the plain
`git` is an Xcode shim that refuses. Both are explained under *Environment*.

**Check it:** `node tools/audit.js` and `node tools/field-check.js`, before
any commit touching more than one file, plus `node tools/model-check.js`
when you touch the 3D viewer or repack its mesh. **Re-exporting a photograph
needs nothing** — the pre-commit hook runs `tools/asset-rev.js` and the
`?v=` hash follows the bytes. None replaces driving the
page — and the model checker is the one that replaces *watching* it, since
the pane freezes `requestAnimationFrame`.
A `git config core.hooksPath .githooks` in a fresh clone turns the
pre-commit hook on; `audit.js` tells you if you have not.

**Three things that will bite you**, each with a section of its own below:
the in-app browser lies about animation and `getComputedStyle` goes stale
(*Environment*); every number in this file is a measurement, so fix it in the
same commit as the change (*About this file*); and the loading skeleton has
to mirror the hero exactly, so moving anything in the hero is a two-file job
(*The loading skeleton*).

### Find your task

| If you are about to… | Read | And check |
|---|---|---|
| change any colour | **Palette** | the contrast rules at the end of it |
| touch the hero shapes | **Animation** → the field (five subsections) | `node tools/field-check.js` |
| move anything in the hero | **Layout**, **The loading skeleton** | re-measure the skeleton |
| change the hero's vertical rhythm | **Layout** → the min-height note | `.hero` centres its group, so half of what you remove comes back as space above — and its height is the field's coordinate space |
| touch the theme switch | **Animation** → The theme switch | the browser-pane warning |
| add / rename / remove a project | **Routing** (last line) | `assets/README.md` — a 7-step checklist, not 3 |
| touch the pot-clip case study | **The case-study layout** | `node tools/audit.js`, then diff the other six — one overlay serves all seven |
| add any user-facing string | **UX rules** → four languages | all four, exact parity, `audit.js` checks it |
| add an image | **Performance** | every inline jpg needs a webp sibling |
| touch a button, card or chip | **UX rules** → Hover, lift and touch targets | the hover pad, and 44px on touch |
| write anything a crawler reads | **Machine readers are an audience** | the eggs stay unnamed there |
| touch the easter eggs | **Machine readers** → the three layers | `curl` the page and grep for their names |
| touch the 3D viewer, or repack its mesh | **The 3D viewer** | `node tools/model-check.js` — the pane freezes rAF, so motion cannot be checked by looking |
| publish a file, or touch a photo | **Safety constraints** | read the file first |
| measure anything in the browser | **Environment** → the pane lies | sanity-check the probe first |

### What is in here

`grep -n "^## \|^### " CLAUDE.md` prints this with live line numbers.

| Section | What it covers |
|---|---|
| **Environment** | the Xcode git gate, and five ways the in-app browser lies |
| **The brief** | Jack's own statement of direction. It outranks every rule below |
| **Visual direction** | neo-brutalist, hard shadows, the headline is untouchable |
| **Palette** | the tokens, which ones flip, the ground's four settings, contrast |
| **Typography** | three faces, the Japanese weight trap, CJK sizing |
| **Layout** | the hero's proportions, the marquee's removal, breakpoints |
| **Animation** | hover gating, the hero shape field (the longest thing here), the seam ring, the theme switch |
| **The loading skeleton** | every bar derived from the rule it stands in for, and how to diff it |
| **The case-study layout** | the one project with its own page, and the three things that bit |
| **Routing** | real URLs for overlays, and the three things that break them |
| **UX rules** | state, copy, the red mark, the hover pad, touch targets, i18n |
| **Accessibility** | what is already right, and two things that only looked broken |
| **Machine readers** | llms.txt, JSON-LD, and keeping the eggs out of both |
| **Performance** | WebP, lazy overlays, cache headers, what was measured and rejected |
| **Coding conventions** | comments carry their measurement; tokens over literals |
| **Safety constraints** | the resume, the photos, the blocked client work |

### Finding things in the code

Both big files carry numbered section banners:

```
grep -n "SECTION " styles.css      # 25 sections, 4.4k lines
grep -n "SECTION " script.js       # 19 sections, 3.1k lines
```

One grep gives the whole table of contents with live line numbers. Use it
instead of reading either file top to bottom.

### Where facts live, so they stop contradicting each other

- **CLAUDE.md** (this file) — rules, and why. What not to break.
- **PROJECT_NOTES.md** — state. What is live, what is open, ranked.
- **assets/README.md** — how to add images and projects. Export specs.
- **docs/** — gitignored, local only. Restore notes for things that were
  removed: `hero-marquee.html`, `about-skills-marquee.html`. If you take a
  feature out, leave one of these behind.
- Anything describing *how the site should look* goes here, not in the other
  two. That separation exists because the status doc and this file drifted
  into contradicting each other about the card hover.

### About this file

It is long because the reasoning is the valuable part — most of it is a
record of something that was tried, measured and rejected, which is the
expensive half to rediscover. You almost never need all of it: the table
above is the index, and the subsection headers are the fine-grained one.

1. **Numbers in it are measurements, not decoration.** When one stops being
   true, fix it in the same commit as the change. A 2026-11-10 audit found
   28 stale claims across the comments and docs — almost all counts left
   behind when the hero field went from nine shapes to twelve, including a
   comment reading "NINE, not twelve" after the answer had become twelve.
   The code was right the whole time; only the prose was wrong.
2. **Verify a count where it happens.** The same audit nearly "fixed" a
   correct claim: `.reveal` is on **18 elements at runtime but only 12 in
   the markup**, because `renderGallery` adds one per card. `grep` would
   have made that worse — and did: the "16" this rule used to quote was
   `grep -c reveal index.html`, which counts every LINE mentioning the word,
   comments included. That number is 15 today and has never been the count
   of anything. Count the elements that carry the class
   (`grep -o 'class="[^"]*reveal[^"]*"'`), or ask the page.
3. **If a tool reports success, check that it did any work.**
   `field-shuffle.js` printed "all passing" while generating zero
   arrangements, twice, for two different reasons. An empty loop passes
   every test in it.

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
- **The pane never runs `loading="lazy"`.** A lazy image is not fetched at
  any scroll position — I walked the whole page in 400px steps and all four
  lazy card images stayed `complete: false`, `naturalWidth: 0`. It is not
  that they are slow; the request is never made. The way to tell this from a
  real bug is to flip the attribute: set `img.loading = 'eager'` and they all
  complete at 720px wide within a second, which proves the files, the paths
  and the `<picture>` are fine. **Never diagnose image loading in the pane
  without that flip.**
- **The pane does not deliver the page's own `IntersectionObserver`
  callbacks on load.** Every `.reveal` stays at opacity 0 for as long as you
  care to wait — measured 0 of 19 at 1.5s, 3s and 5s. An observer you create
  yourself from a probe fires normally, which is what makes this so
  misleading: the API works, the page's use of it does not. It cost a whole
  cycle here, and the only reason it did not cost a wrong fix is that the
  same check against the PREVIOUS commit also returned 0 of 19 — so it was
  the pane, not the change. **Before believing a reveal is broken, run the
  same measurement against `git stash` or the committed file.**
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
  and the full-bleed rules are asymmetric on purpose; don't centre things to
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
  tags-as-pills looked generic, and so did the marquee in the end; an
  over-bright marquee and over-dense shapes were chaotic. Expect to be corrected in either direction.

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
| `--accent-plum` | `#6E4E6B` muted plum | `#B98CFF` violet | **Graphic only** — one hero shape |
| `--muted` | `#6A6861` | `#9C9AA3` | Secondary text |
| `--line` | `#CBC4B4` | `#33333D` | Light dividers |

**Tokens that never INVERT** — the graphic slabs (loader, about section,
footer, pong) are a dark surface with light type in both themes, so
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
warm. Jack caught it on the marquee, which the page no longer has: side by
side it read as a mistake, and
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

**Text over a moving shape is checked by `tools/field-check.js`**, not by
the live audit, and this was a genuine hole rather than an oversight: a walk
of the resting DOM cannot see what a MOVING element will be behind. The
check composites every FILLED shape over the ground at its own alpha and
measures `--black` on it against a 3:1 bar — 3 and not 4.5 because
everything a hero shape can reach is display type, and the small text in
range carries an opaque background. Outlines are skipped: at 2–5px they
cover a sliver of a glyph, where a fill composites the whole area.
It found one the day it was written. **The filled lime star in dark measured
2.48:1**, and it was reachable rather than theoretical — its envelope
overlaps the foot of `.hero-role`. `--highlight` in dark is `#DDFF67`, the
brightest token on the page, and filled at .62 it composites to a near-lime
ground under off-white type. It is an outline now. Current numbers for the
pairings that remain: light 6.96–10.18:1, dark 4.79–6.51:1.

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

- **THE MARQUEE IS GONE, and the 6px rule under `.hero-grid` is the seam.**
  Removed 2026-11-18 on Jack's call: *"I think it just all looks too AI… I
  say we take it out… it might look more real."* It was a full-bleed `--ink`
  band scrolling UX/UI ✦ WEBSITES ✦ BRAND SYSTEMS ✦ PHOTOGRAPHY ✦ MOTION at
  55px/s, and it was the strongest template signal on the page — an infinite
  strip of service words is the component every generated portfolio ships,
  and those five were category labels any designer could have written.
  **The spacing corrected itself and that is worth understanding before
  touching it.** `.hero` centres its whole group inside its min-height,
  which was still 80vh at this point, so losing a
  38px strip from the bottom of that group moved everything left in it down
  by half of what went: the name went from y 189.2 to 207.7 at 1440×900 and
  the seam from 603.8 to 622.3. Jack guessed both halves in advance — *"maybe
  the Jack Murray stays there or moves slightly down… maybe selected projects
  can move slightly up, or maybe not"* — and the answer is that the name does
  move down, SELECTED PROJECTS does not move at all, and the gap between them
  grows from 143px to 162px. **Nothing was retuned in that first pass**: not `.hero-grid`'s 86px
  padding-bottom, not `#work .section-head`'s 64px, not `min-height: 80vh`.
  All three moved in the two passes that followed, for reasons of their own.
  The loading skeleton tracked it on its own for the same reason, and
  measures within 1px at 1440, 1024, 900, 760 and 390.
  **THEN THE 6px RULE WENT TOO, and that was the second half of the same
  request.** The first pass left `.hero-grid`'s full-bleed bar standing where
  the band had been. Jack, before he had even looked: *"don't just put like a
  singular line there. We want like take it out. I said to take it out, and
  then fill the space."* He is right, and the reason is that the bar was
  never dividing anything on its own — it was the lid of a 44px black object.
  Alone above 160px of white it reads as a leftover underline rather than as
  the end of a section, and `#work` already draws its own 4px rule under
  SELECTED PROJECTS, so the page was not short of a divider.
  **"Fill the space" took two numbers, both of which existed only because of
  the strip.** `.hero-grid`'s 86px bottom padding was air between the content
  and the rule (50 before the marquee was opened up into a seam) — with no
  rule beneath it, pure hole, so it is 0, and 0 in the stacked rule too where
  it was 64. And `#work .section-head` came up from 64 to 40, which is the
  half Jack floated himself: *"maybe selected projects can move slightly up"*.
  **40 works for the reason 38 failed.** 38 was tried and rejected because
  "the heading arrived so soon after the strip that the hero had no ending,
  just a band and then the next thing" — the objection was to the BAND. With
  no band and no rule the hero's ending IS its white space, and bringing the
  heading up is what stops that white reading as a hole. It also puts #work's
  own 4px rule on the first screen at 1440×900, so the hero has an ending
  again without a line inside it. 40 rather than 38 only so the rejected
  number is not quoted back at him; at this size they are the same picture.
  **Measured at 1440×900 after both passes:** nav ends 94, name 253.7, content
  ends 576.3, hero ends 720, SELECTED PROJECTS ink 760. Content to heading is
  183.7px where the marquee era had 143 and the first pass had 207.
  **Three follow-ons.** `.hero-shapes` keeps `-306px` even though the first
  card moved up 24 — that inset is the field's COORDINATE SPACE, so changing
  it would rescale the whole composition Jack chose from the shuffler, for an
  overshoot the opaque cards cover anyway. `FS_CENTRE.y` in both field tools
  moved .42 → .438 → .483, twice, for the same reason each time: the hero
  centres its group, so anything taken off the bottom lowers what is left by
  half. And one slot was nudged y .76 → .79 because the full stop walked into
  its swing — `field-check` fails at .775 and passes at .78.
  **Restoring it:** `docs/hero-marquee.html` holds every removed block
  verbatim plus the follow-on changes to undo, the same way
  `docs/about-skills-marquee.html` holds the about-page ticker cut before it.
  Both are gitignored, so `git revert` is the other route.
- **Hero `min-height: 66vh` with a 40px bottom padding, and the point is
  what you can see UNDER it.** It was 100vh once, which ended the hero
  exactly at the fold so the first screen looked like the whole site. 80vh
  fixed that halfway — it showed SELECTED PROJECTS, but the first card still
  began **62.5px below the fold** at 1440×900, so the one thing that proves
  there is a portfolio down there was the one thing you could not see.
  Jack: *"have it so we see a small part of the cards… so we don't have the
  illusion of completeness even more."*
  **The 40px bottom padding is not spacing, it is a bias.** The hero centres
  its group, so every px of height taken off also pulls the name up by half —
  and that would have taken the white between the hero and SELECTED PROJECTS
  with it, which Jack asked to keep (*"still have that white space in the
  middle"*). Padding at the bottom shifts the centring up by half of itself
  without touching the gap below the group, so the 40 buys back 20px of that
  white. **Measured at 1440×900: nav→name 76.7, middle white 140.7, card peek
  63.5**, against 159.7 / 183.7 / −62.5 at 80vh with no padding.
  What it spends is the top. 159.7px of air under the nav was the half of the
  hero's symmetry doing no work.
  **Across viewport heights** (the peek is `V×(1−0.66) − 242.5`, so it grows
  with the window): 1512×982 → 91.4, 1440×900 → 63.5, 1440×800 → 29.5.
  At 1024×768 the hero is content-bound rather than height-bound and the
  cards stay below the fold; that is the floor, not a bug.
  **A phone needed two more numbers**, because at 390 the chip row is two
  deep and the heading is on two lines, which puts ~294.5px between the
  hero's foot and the first card where a desktop has 242.5 — so 66vh alone
  still left the card 7.5px below the fold at 390×844. At ≤760px
  `.filters` drops to 20px of top padding and `#work .section-head` to 28,
  which is 32px of photograph and takes the peek to **+28.5** (it was +24.5
  until the chips tightened — see the sixth-chip note below).
  **A SIXTH FILTER CHIP ALMOST TOOK THAT BACK, and the lesson is that the
  chip row is part of this measurement.** Adding PRODUCT on 2026-11-21 took
  the row from two rows to THREE at 390 — 174px against 92 — and the first
  card went from +24.5px above the fold to **27.5px BELOW** it. That is the
  whole point of 66vh undone by a button.
  The fix is horizontal padding, not height: at ≤600px the chips go to 10px
  a side and the row gap to 8px (`.filters, .sk-filters`, so the loader
  tracks it). The chips are already at the 12.8px type floor and their 44px
  touch target is drawn by a pseudo-element rather than by the box, so
  nothing a thumb can feel changed. **Measured after: 390×844 two rows (4+2)
  and +28.5, 360×740 two rows (3+3) and −39.9 against a five-chip baseline
  of −41.9** — i.e. 360 came out 2px BETTER than before the chip was added,
  because the tighter gap more than paid for the extra button.
  **320×568 is the exception and is left as-is**: three rows there against
  two before. The peek was already lost at that size and the chips have no
  padding left to give; six filters on a 320px screen is three rows.
  **Re-measure this whenever a category is added, renamed or translated** —
  the row is a function of the label widths, so it is the same class of
  dependency as the skeleton's chip multiples.
  **One thing measured false before it shipped.** The obvious next move was
  to drop the 40px bias on stacked layouts, on the reasoning that a stacked
  hero is content-bound so there is no centring to bias. At 390×844 it is
  not: the content comes to 502 against a 66vh floor of 557, so the floor
  still wins. Dropping it moved the name DOWN 20px and took the middle white
  from 87.6 to 67.6 while the first card did not move at all. The reasoning
  was clean and the premise was false — measure which way a hero is bound
  before assuming.
- `#work .section-head` has `padding-top: 64px`, against 70px everywhere else.
  It has been 70 (the hero looked finished before the work started), then 38
  (the heading arrived so soon after the strip that the hero had no ending),
  then 64, now **40**, and **28 at ≤760px** — see the marquee note above for
  why 40 works where 38 did not, and the min-height note for why a phone
  needs the extra 12. The field's inset deliberately did NOT follow any of it
  down; that note explains why.
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

### Hover, and reduced motion

- Every hover effect is wrapped in `@media (hover: hover)`. On touch, `:hover`
  latches on tap and never releases.
- 16 `prefers-reduced-motion` blocks; the global one kills durations.
### The hero field — how many, and how far it reaches

- Hero shapes: **11 / 9 / 7 by width in light, 9 / 7 / 5 in dark** (see the
  thinning note
  below), drift on **two sine terms per axis** (one sine traces a clean
  ellipse and reads as clockwork) along a **per-shape path** — see the
  trajectory note below; a shared one made the whole field look railed.
  Opacity in CSS, not JS — `.34` base / `.66` vivid in light, `.62` / `.78`
  in dark, with a `drop-shadow` glow, all four dialled to `.36`/`.62` and
  `.50`/`.64` ≤760px. Behind `.hero-grid` (z 0 vs 2) and
  `pointer-events: none`.
- **The field reaches past the hero**, 306px down, to the top of the first
  card — through the heading AND the filter row, so the hero thins out across
  three bands (seam, heading, tags) rather than ending twice. It was strip,
  heading, tags until the marquee came out; the band is still there, it is
  just open page with a 6px rule through it, and the field is now the only
  thing filling it. Three things
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
  background.** Five now: the availability badge, `#work .section-marks`, the
  filter chips, and — since the field started reaching the nav — the
  `.lang-toggle` and the `.theme-switch`. Those two were
  `background: transparent` with a 2px rule, which is exactly the case this
  rule exists for. `--white`, not `--paper`: `--white` flips with the theme,
  so it cannot bring back the pale-knob-on-a-pale-track bug, and it is the
  colour the nav already sits on at the top of the page and once scrolled —
  so the change is invisible and does nothing but occlude. The chips' text was never the problem (`--black` over even
  a vivid shape is 6.13:1) — a shape drifting through an outlined chip makes
  it read as busy rather than as a control, and these have to stay
  unambiguously clickable. The 2px border is what makes the occlusion read
  right: the chip is an object in front, so a shape behind it should be hidden
  rather than showing through.
- **They are allowed to drift across the type, and that is settled.** A build
  that held them out of the name, the right column, the nav and the seam —
  measured boxes, envelope-reserving placement, a per-frame clamp — spread
  well at 1440, where the two-column split leaves real negative space. Below
  that it did not: a stacked hero has one pocket, so the field concentrated
  into it, and at 375 it collapsed to four-to-six shapes inside one 60×50
  patch. Jack's call was the free field at every width. The z-order and the
  ≤760px opacity are what protect the text. **Do not reintroduce a keep-out.**
### The field is authored: bands, hues and the keep order

- **The field is AUTHORED, not generated, and that is the point.** Every
  position and every motion number was `Math.random()` per shape per build
  until 2026-11-10. Random scatter clumps — two or three shapes
  overlap into a blob and a quadrant sits empty — and because it re-rolled on
  every load and every theme switch there was no arrangement to judge, let
  alone tune. Each def now carries `at: [x, y]`, its resting centre as a
  fraction of the field box, and the eleven sit in **three bands, 4 / 4 / 3**,
  each band running left to right across the field:
  TOP across the top of the name (y .20–.28), MID across its foot (.44–.56)
  and SEAM down past the hero's rule (.70–.90) — the band was named for the
  marquee and kept the name after it went. Those are the RANGES a shape may
  rest in; the exact coordinates are not hand-chosen any more — see the
  shuffler note below. Bands two and three used to sit at .41–.47 and
  .745–.90 and were moved toward the marquee to close a gap — see the
  white-space note. They stay where they are now the strip has gone: the gap
  they were moved to close is still a gap, and the band they fill is the one
  the strip used to occupy. It went 9 → 12 on 2026-11-10 on Jack's note that the
  field still wanted more, then settled at 11; the band structure is what
  absorbed the extras without the result reading as denser-but-random.
  **Re-measured 2026-11-18 (third time that day)**, against the real hero at
  1440×900 with every `.reveal` settled. **The box is 1440×900 now**, not
  1026: it is hero-height + the 306px the field reaches past it, and the hero
  went 80vh → 66vh. nav ends at **.1044**, name .1897–.5481, side column
  .2429–.5481, the hero itself .66, SELECTED PROJECTS .7044–.7933 (ink),
  filters .8311–.9311, first card .9294, and the full stop after MURRAY
  centres at **(.6554, .4583)**.
  **EVERY SHAPE IS NOW 12% BIGGER AS A FRACTION OF THE BOX** without a single
  px changing, and the nav band grew the same way — a fixed 94px is .1044 of
  900 where it was .0916 of 1026. That broke three slots at once and
  `field-check` named all three: the square over JACK (.25 → **.28**) and the
  far-left sweeper (.47 → **.55**) had started reaching into the nav, and the
  seam sweeper (.79 → **.82**) into the full stop. All three moved by REST,
  not by reach, so the sweeps Jack asked for are intact, and all three are
  mirrored in `jaggedDefs`.
  **If you change `.hero`'s min-height, expect to re-measure all of this**:
  `H` and `NAV_BOTTOM` and `FS_CENTRE` in both field tools, then run
  `field-check` and move whatever it names.
  **Both themes use the SAME eleven slots**, assigned biggest-to-biggest, so the
  theme switch — which rebuilds the field inside the view-transition callback
  — reveals the same composition wearing different shapes instead of jumping
  to a fresh scatter mid-wipe.
  **Judge a slot by its swing, not its rest.** Three rules came out of getting
  that wrong first time: nothing rests in the nav band (the 36px circle swings
  ±94px, so a rest at .17 put it in the nav for half of every cycle),
  nothing rests where it can reach the full stop after MURRAY (the 50px circle
  swings ±127px, and a rest at .55/.52 parked it on the page's one piece of
  punctuation-as-graphic), and band two was off the marquee (a near-black
  circle at .38 over a near-black slab is a smudge, not a shape — that third
  rule retired with the strip, and the positions stayed).
  **This is not a keep-out.** Nothing clamps at runtime; shapes still drift
  over the name, the column, the nav and the seam and must keep being
  allowed to. It sets where a shape LIVES, not where it may go.
- **Dark carries TWO FEWER at every width**, so the ladder is 11 / 9 / 7 in
  light and 9 / 7 / 5 in dark. Jack: "in the dark mode, I would say maybe
  take one or two out, that kind of looks like a lot right now." It does,
  and the count is not the reason: a neon star at .62 on near-black with a
  drop-shadow glow is a brighter object than a coral outline at .34 on sand,
  so the same eleven read as more. It is an offset on the budget
  (`DARK_FEWER`), not a shorter dark array, so the two themes still share
  SLOTS — the wipe reveals the same composition minus its two least
  load-bearing shapes rather than a different arrangement. The keep order
  already guarantees each subset is a composition, down to 5 (bands 2/1/2).
- **The field THINS as the screen narrows** — 11 shapes, 9 at ≤760px, 7 at
  ≤600px, two fewer than each of those in dark — and the alphas came UP to pay for it (.33/.56 light, .50/.64
  dark, against .26/.46 and .42/.54 before). Half as many objects had taken
  the phone from busy to absent: "a bit a lot quieter on the phone now".
  Count down, alpha up — the two together land somewhere neither reaches
  alone, and both stay under the desktop values because this is still the
  width where shapes cross the type most.
  Thinning also reverses what the opacity rule used to claim. That rule
  said "dialled back rather than thinned out, so the phone keeps the same
  look with less of it". Wrong: the field box is 375px wide at 375 against
  1440 at 1440 — it is the VIEWPORT width, because `.hero-shapes` is
  absolutely positioned with `inset: 0` left and right and that resolves
  against the hero's PADDING box, so the hero's 72px side padding never
  applies to it. (The 1392/338 this file and script.js used to quote was the
  content box, and was never the number in play. Measured in the page: 1440
  at 1440, 1024 at 1024, 375 at 375.) So the same eleven objects sit at
  nearly four times the
  density per unit of area, and **no alpha fixes density** — faint clutter
  is still clutter. Jack, on a real phone: "there's too many shapes".
  **Count and alpha are two problems and both rules stay.** Alpha stops a
  shape fighting the type it crosses; count stops the field reading as busy.
  The phone had both.
  Each def carries `keep`, 1–11, where 1 is the shape the composition can
  least afford to lose, and the ranks answer TWO rules.
  **Bands:** every surviving subset still has to be a composition. At 11 the
  three bands hold 4/4/3, at 9 they hold 3/3/3, at 7 it is 3/2/2 — and all
  three keep the x-spread (.10–.92 at every budget), both corner anchors and
  something still living down in the seam.
  **Sides: a hue with two or more shapes must appear on BOTH sides of the
  field.** Nothing checked this until 2026-11-11, and the arrangement in use
  had all three corals at x > .87 — Jack spotted it instantly: "make sure
  there's also red on the left side". Per-band hue mixing stops horizontal
  stripes; this stops vertical ones, which is the same failure rotated and
  just as easy to ship. The check uses .45/.55 rather than a hard half, so a
  shape near the centre line counts for neither side and cannot rescue a
  lopsided hue.
  **Hue: no band may hold two shapes of the same colour, at any budget.**
  An earlier ranking satisfied the band rule and failed this one, because
  ranking by structural importance happened to rank by colour too: it put two
  coral shapes across the top and two blue ones directly under them. Jack saw
  it on a phone straight away — "it looks almost like color coding". A field
  of drifting geometry reads as decoration; the same field in horizontal
  colour stripes reads as a chart.
  **Whether the rule is even satisfiable is arithmetic, not taste.** With H
  shapes of one hue and 3 bands, pigeonhole forces a repeat once H > 3.
  That arithmetic has settled two colours now. It made the 61px triangle
  amber (turning the square over JACK red would otherwise have taken coral
  to four), and then it moved the seam triangle to plum, because turning the
  small circle blue took amber's only left-hand member away and left it
  failing the both-sides rule.
  **The counts on stage are 3 blue, 3 coral, 2 plum, 1 amber, 1 black**, and
  with the offstage sweeper counted blue is 4 — which is exactly why
  `offstage` exists, since at 4 the rule would switch itself off. Every band
  gets one of each three-count hue, so the rule is a guarantee at every
  budget rather than something to check. **Amber is down to a single shape**,
  and the older notes calling it a pair on the two smallest, or a third
  primary on three, both describe fields that no longer exist.
  The history is the argument for keeping the counts where they are: at
  twelve there were 4 blue and 4 coral, so a repeat was unavoidable at full
  budget and the rule could only be enforced on the thinned sets. **Ten
  works where twelve did not** — not because it is smaller, but because
  3/3/3/1/1 puts no hue above three. Chase a fourth of any colour and the
  guarantee goes back to being a guideline.
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
  that band, and the keep order; **it never varies the shapes
  themselves** — their sizes, colours and fills were argued out and are not
  up for a dice roll.
  **It was silently dead for a while, and the failure mode is the lesson.**
  The band capacities (three bands of three), the budgets (`[5, 7, 9]`) and
  the keep order (a fixed nine-entry list) were literals tuned for nine
  shapes, and all three went stale the moment the field grew to eleven — so
  it generated ZERO arrangements on every run while still printing "all
  passing". Fixed by deriving all three: capacities from the def count,
  budgets from `shapeBudget()` in `script.js`, and the keep order balanced
  as it is built. It also checks the hue-sides rule now, which it had been
  getting away with because a 3/3/3 deal happened to satisfy it.
  **If a tool here reports success, check that it did any work.**
  **It went stale the same way a second time**, which is the part worth
  reading twice: when `shapeBudget()` gained an `isDark` argument it stopped
  returning literals, the "return N" regex matched nothing, and the budget
  list came back EMPTY - so every per-budget check passed by looping over
  nothing. It throws on an empty list now rather than reporting ok. It also
  skips `offstage` defs when dealing hues and leaves their coordinates
  alone, the same exclusion field-check makes.
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
### The shapes themselves — which, what size, what colour

- **The two squares over the name are a TRADE, and how that got settled is
  the reusable part.** The 96 at x .42 is the light red hard square; the 84
  at x .22 is the plum square. Jack asked for "the gray hollow box around
  JACK" to become "a light red regular square", I changed the 84, and he was
  looking at the 96: "it's right around the K most of the time." Both are
  over JACK — one over the JA, one over the K — and both were hollow, and
  the plum one reads as grey at .34 on the ground.
  **A shape in this field is identified by where it DRIFTS, not by where its
  def says it rests.** The 96 covers 247px of x, so "around JACK" is a
  300px-wide answer. When a note points at a shape by position, reproduce
  the position over a full cycle before picking a def — the envelope numbers
  in `field-check` are exactly that.
  So they swapped identities and kept their slots: `--accent`, hollow and
  hard-cornered by the K; `--accent-plum`, hollow and `round: true` over the
  JA. The field keeps three corals and its fifth hue (the squircles have
  since been squared off — see the vocabulary note), and
  only the red and the grey change places — "the red box next to it, maybe
  that could be gray or another color or something like that."
- **`offstage` keeps the hue rule ON, and that is the point of it.** The
  sweeper below rests outside the frame, and a def carrying
  `offstage: true` is excluded from the band-hue and both-sides rules while
  staying in every other check — envelopes, band balance, x-spread, the
  text-contrast check, the loudness profile. The reasoning is that those two
  rules exist to stop the field reading as colour-coded stripes, and that
  failure is about the arrangement a visitor sees laid out; a shape that
  rests off the page is not in that arrangement, it is a visitor crossing
  it. **It is not a loophole for a difficult shape — it is what keeps the
  rule enforced.** With the sweeper counted, light has four blues, and four
  of one hue over three bands makes a repeat unavoidable by pigeonhole — at
  which point `hueRuleSatisfiable()` switches the rule off for the WHOLE
  band set and stops checking the other nine shapes too. Excluding the one
  shape that rests off-page keeps blue at three on stage and the rule live
  everywhere it means something. The per-budget line says so:
  `(1 offstage, hues not counted)`.
  **Measured, the two blues are both on screen 34% of the time and within
  400px of each other 20%** — recorded rather than hidden, because that is
  the number to argue with if the field ever does start reading as coded.
- **ONE SHAPE LIVES OFF THE PAGE.** The 81px blue square rests at
  **x −0.55** — a third of a screen beyond the left edge — and reaches
  x .608 at the far end of a 1575px swing. Jack asked for it back after it
  was cut, but changed: "make it so that you don't see it for a little bit,
  but at certain times it'll move from kind of the left to the right. It'll
  come from out of frame into frame. Slowly, and then back… it kind of
  helps take up that negative space that we see from kind of the marquee
  above and below it."
  Measured in the page over 2400 seconds: **on screen 34% of the time, in
  54-second visits with 105 seconds away**, 67px/s at its quickest, which
  makes it the slowest thing in the field. It rests at y .535 (MID, and as
  low as the marquee rule allowed an 81px shape to rest), swings .375–.695.
  **The quote names the marquee because the strip was still there when he
  asked for it**; what he was describing is the white band at .58–.70, which
  is open page now with the hero's 6px rule running through it. The sweep is
  unchanged and it matters slightly more, since that band lost the one object
  that used to fill it. 49% of its visible time is clear of the name's box, so the
  moments where it reads as a clean object are rarer still, which is the
  point rather than a defect.
  **It is `keep` 10, so it is a DESKTOP shape.** A 1575px sweep means
  nothing in a 375px box, and the thinned 9 / 7 / 5 sets never include it.
  **Dark does not show it either**, because dark's budget stops at 9 —
  deliberate, since a neon star sweeping the page is a louder event than a
  soft coral square and dark had just been thinned. Moving it into dark is
  one number, `DARK_FEWER`.
  **Filled but NOT vivid**, where the square it replaces was both. Vivid on
  something 81px across is what made that one the loudest object in the
  field; at the base alpha it measures 23 against the 45 at the top of the
  profile.
  **A resting x may be negative now, and both tools had to learn it.**
  `field-check` and `field-shuffle` parsed `at: [x, y]` with `[\d.]+`,
  which silently skips a minus sign — so the new def did not exist as far
  as either was concerned, and the checker cheerfully reported ten shapes
  and "ALL CHECKS PASS" on an eleven-shape array. **A parser that drops a
  row is worse than one that throws**; if a count in that output ever looks
  wrong, suspect the regex before the data. The shuffler also places x in
  [0.08, 0.95], so a re-roll will pull this shape back on screen — that is
  a known limit, not a bug to fix blind.
- **The vocabulary is FOUR forms and must stay that way**: circle, square and
  triangle in light, jagged star in dark. **No modifiers either, now.**
  Two light squares carried `round: true` for a few releases — a 28% radius,
  argued for on the grounds that a rounded rect is not a fifth FORM (it is a
  square with its corners taken off) and that it reads contemporary. Both
  halves of that were true and it still did not last: "I don't love the
  rounded squares anymore… can you just make sure that those are regular
  squares again?" **Do not rebuild it.**
  Worth knowing why the argument did not save it. The reasoning was about
  what a squircle is *not* — not a new kind of object, not an arc or a bar —
  and a field of hard-edged geometry does not need a reason to reject a soft
  edge beyond not wanting one. The vocabulary is sharper for having no
  exceptions at all. The `round` key and the `.shape-square.is-round` rule
  are both gone rather than left idle, because this project holds itself to
  zero dead CSS classes.
  Dark stays all stars: it is the experimental half and its vocabulary is
  sharp, and Jack is happy with it as it is. An arc, a flat bar and a cross were
  added on 2026-11-10 to give the field more to look at and cut the same day
  — "I don't like the new shapes; they dont fit." They were not bad shapes;
  they were wrong here. This page already carries a lot of distinct geometry
  — the hard rules, the cards, the chips, the name itself
  — and the field's job is to be the quiet layer behind all of it. Six kinds
  of drifting thing stops being a texture and becomes a second subject.
  **Variety in this field comes from SIZE and FILL, not from new forms.**
  That is the whole lesson, and it is what "a bit more" actually wanted:
  - **One shape is much bigger than the rest** — currently a 191px outline
    circle (203px star in dark). The sizes used to run 36–104, which is a
    spread, not a hierarchy: eleven things all roughly of a size. The jump
    gives the field a top, and the "bold" size profile in the shuffler
    widened it further (132–>191) at Jack's request for larger shapes.
    It no longer sits bottom-right concentric with the seam ring; that echo
    was real but it was my rationale, not a rule, and the arrangement Jack
    chose is better without it.
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
  - **It went 11 → 10 on 2026-11-11**, and the measurement picked the shape
    rather than the eye. Jack: "maybe take out one shape. Find one shape to
    take out." The 81px vivid filled blue square was **the loudest object in
    the light field by 29%** (58 against 45 for the next) and it rested at
    x .50, y .50 — dead centre, the one position in the composition with no
    edge, corner or landmark to answer to, on a page whose brief says
    "intentional asymmetry". It also stacked three maxima on one object,
    filled AND vivid AND mid-large, which is the same argument that made the
    amber shape over JACK hollow.
    Two things confirmed it rather than decided it: it was already `keep`
    11, so the composition's own ranking had it as the most expendable and
    the thinned 9 / 7 / 5 sets did not change at all; and with it gone
    `vivid` is back on the two SMALLEST shapes only, which is what vivid is
    for. The light field's loudness now runs 45 down to 1, with a clear top
    and a long tail.
    **That measurement is worth re-running before trusting your eye here.**
    Asked the same question about the rest of the field, it contradicted me:
    the amber triangle I was about to tone down came out 8th of 12, while
    the loudest object by a distance is the 70px vivid blue square at 2455 —
    which nobody has complained about, because it sits at x .95 and spends
    most of its time half off the edge. A shape reads loud because of where
    it is as much as what it is.
- **The small circle is blue and reaches SELECTED PROJECTS.** "Change that
  to blue. And have it — I like its trajectory, but it should go all the way
  down to selected works. I think that movement of down helps." The
  trajectory is kept rather than redesigned: `reach` goes 1.0 → 2.4 and
  `aspect` 0.8 → 0.9, so it is the same curve scaled up and pulled 12% off
  its horizontal bias. It swings y .237–.845 and spends **19% of its cycle
  behind the heading**.
  **Measure that heading rather than trusting the .702 this file quotes for
  SELECTED PROJECTS** — .702 is the top of the section HEAD including its
  padding, and the h2's ink starts about 80px further down. A reach of 2.0
  satisfied the .702 figure on paper and landed the circle 47px short of
  anything you can see.
  Turning it blue cost amber its only member left of centre, which left
  amber failing the both-sides rule with two shapes at x > .7. **So the
  seam triangle went plum**: amber had to drop to a single shape, the 61 is
  the top-right swooper and reads as the warm accent up there, and plum was
  the only hue that fit — black would have put two on the right, and coral
  and blue were already in that band. A hue change can force a second one;
  run `field-check` before assuming it cannot.
- **Shape sizes are px in the array but SCALE WITH THE FIELD when it gets
  narrow**, and this only became visible once the shapes got big. The
  numbers in the def arrays are tuned against the 1440px-wide field box; the
  box is 375px on a phone, so a shape that is 9% of the field on a desktop
  is 39% of it there. The same number means two different things. It was
  survivable at 132. At 191 it was not — the largest shape covered 56% of a
  phone's field width and sat across the headline, which is a worse version
  of the complaint that started the thinning: one shape can crowd a screen
  on its own.
  **It compresses the RANGE rather than scaling everything by one factor.**
  A uniform multiplier tamed the 191 to 86 and took the 36 down to 16, which
  is a speck — the field went straight from "one shape crowding the screen"
  to "nothing there". What a narrow screen cannot carry is the SPREAD: a
  5.3× size range is drama at 1440 and noise in a 375px box. So the largest
  shape loses the most, the smallest barely moves, and the set pulls toward
  its middle. Measured in the page: 116/94/81/71/53/48/42/38/30 at 700 and
  86/76/68/61/43/38/34 at 375 — nine and seven of them, the rest thinned
  away. **Desktop is untouched** — both ends of the ramp are 1 at and above
  1392, which is the ramp's saturation point and not a measured width.
  The envelope checks in `tools/field-check.js` run at 1440 geometry, which
  stays the binding case: shapes are smaller AND travel less at every
  narrower width, so their swing envelopes only shrink.
- **TRAVEL SCALES WITH THE FIELD TOO**, and for the same reason: an
  amplitude is absolute px and the box it swings inside is not. The widest
  travellers now cover 250px, which is 18% of the field at 1440 and 67% of
  it at 375 — so a drift that reads as a shape wandering in and out on a
  desktop takes that shape off a phone for a large part of every cycle, on
  the width that was *just* short of shapes. `travelScale` is
  `0.5 + 0.5 * (1 - narrow)`, off the same ramp the sizes use, so it is
  exactly 1 at and above 1392 and desktop is untouched. Measured by driving
  the real `driftAt` over a full cycle: at 375 the seven survivors are on
  screen 70–100% of the time, against 58–79% without it.
### How the shapes move — weight, paths, speed, randomness

- **Outline weight is 2.6% of the shape's size, not a fixed px — one number
  for the whole field, with a 2px floor.** The SVG shapes were always proportional
  (`stroke-width` is in viewBox units) while circles and squares took a flat
  `3px` from CSS, so the same field held outlines at 2.3% of diameter on the
  largest circle and 6.7% on the smallest square: the big shapes read as
  weedy wireframes next to the small ones and nothing said why.
  `buildShapes` sets `border-width` to `max(2, size * 0.026)` and
  `createSvgShape` sets `stroke-width: 2.6` for every type, so 191 → 5px,
  137 → 4, and everything from 84 down lands on the 2px floor.
  **It went 5% → 3% → 2.6%, and the floor 3px → 2px**, each step on Jack
  looking at it: the 191 circle "should probably be a little thinner as
  well", the 36 amber circle "even thinner". The second of those is why the
  floor had to move — the 36 was sitting on it, so no change to the
  percentage could have reached it.
  **It was 5% for one release and that was too heavy.** Jack, on the big
  circle: "make it less thick. Go back to things not being as thick. I think
  that's probably better, actually." At 5% that circle carried a 10px line,
  which on an outline that large stops being a drawn edge and becomes a
  band — and the rule got louder without anyone touching it when the largest
  shape went 132 → 191. At 3% only the two biggest shapes carry extra weight
  at all, which is the whole reason the proportional rule exists; the rest
  look exactly as they did under the old flat 3px.
  **The star exception is gone with it.** Stars were already 3% because a
  sharp star's inner radius is 14 against an outer 48 and a 5-unit stroke
  closes the notches into a blob; the whole field is on the star's number
  now. The floor exists because 3% of the smallest shape is barely 1px,
  which at .34 alpha on a phone is not a line. The percentage is the rule;
  the px move whenever the size profile does.
- **Every SVG-drawn shape needs `transform-box: fill-box`** and
  `overflow: visible` — `.shape-triangle` has a rule and `.shape-star` has
  its own. Any NEW svg type must join one of them: leave it out and it orbits
  instead of spinning, which reads as a bug in the drift rather than a wrong
  rotation origin.
- **TWO SHAPES ARE GENUINELY RANDOM**, and that is a deliberate recovery of
  something the authored field lost. Jack: "maybe have a couple shapes that
  are fully random... a little bit of randomness." Defs carrying `jitter`
  get a fresh resting position on every load, ±.07 in x and ±.035 in y —
  enough to be a different picture each visit, small enough that the shape
  stays in its band and on its side, so the band balance and the hue spread
  still hold whatever the dice do. Two of eleven, so the composition it sits
  inside is still the designed one.
  **It clamps against the same three landmarks the authored positions are
  checked against** and falls back to the authored spot on a bad roll. That
  is not belt-and-braces, it is the only thing making the rules mean
  anything: `field-check` can only vouch for what is in the arrays, so
  anything generated at runtime has to carry its own guarantee.
  Verified by rebuilding the field six times back to back: the two jittered
  shapes moved .088 and .126 in x, the other nine moved ≤.0001.
- **Speed is `0.112 + 0.24t`, a fifth slower than it was.** "Make some of
  the trajectories a little bit slower. They're going pretty fast right
  now." Applied to the whole range rather than to the shapes that looked
  fastest, because **the range IS the parallax**: the ratio between the
  slowest and fastest shape is what makes the big ones read as structure and
  the small ones as the live layer in front, and picking off the fast ones
  by hand would have flattened exactly that. Both ends moved by the same
  fifth, so everything is slower and nothing has changed places.
- **Motion is derived from size**, also authored. `t = (maxSize - size) /
  sizeSpan` is 1 for the smallest shape and 0 for the largest, and the range
  comes from the loaded set rather than from literals — it was a hardcoded
  `(110 - size) / 76`, which quietly stopped meaning anything the moment the
  132px circle arrived and made `t` negative, running every motion number
  backwards off the end of its range. (That is also why the size
  profiles are safe: `t` re-derives from whatever sizes are in the array.) **Changing one shape's size changes
  every other shape's travel**, because they all sit on the same derived
  scale: growing the biggest to 132 once pushed the next shape's vertical
  amplitude from 39px to 57 and walked it into the nav band. Re-run the
  envelope check after any size change, not just after a position change —
  and note the shuffler has to check BOTH themes, since dark scales from its
  own range and is the larger of the two.
  Amplitude, speed, wobble and spin all come off `t`, so big forms barely
  move and read as structure while small ones travel far and read as the
  live layer in front — parallax done with amplitude. Random gave the right
  spread attached to nothing: a 110px form could come out the fastest,
  widest-travelling thing on screen, which is the inverse of how distance
  reads. Phase steps by the golden angle (2.39996 rad) so no two of the
  eleven ever swing together, and spin direction alternates instead of being
  signed at random.
- **EVERY SHAPE ALSO CARRIES ITS OWN PATH**, and this closes a hole that
  size-derived motion left wide open. Jack: "the ones under Jack Murray,
  they look like they're on the same trajectory. There's like three shapes
  that are all lined up on like the same trajectory. And I don't like it."
  He was describing something structural, not a coincidence of placement.
  `ampX = 40 + 110t` and `ampY = 32 + 86t` put ampY/ampX at **.80 for the
  largest shape and .79 for the smallest** — so every shape in the field
  travelled the same 4:5 diagonal — and the y term ran at a hardcoded .8 of
  the x frequency for all of them. Scale and phase were the only things that
  differed, which means eleven shapes were tracing eleven copies of ONE
  Lissajous figure. Three of them resting at a similar y then read as three
  things on one rail, because they were.
  Three keys per def, authored exactly like the positions:
  - **`aspect`** splits the amplitude between the axes — `ampX * reach /
    aspect` and `ampY * reach * aspect`. 0.5 is a flat sideways slide, 2.2 a
    tall rise and fall. Measured over a full cycle in the page, travel
    aspect now runs **.23 to 3.24** against .79 for everything before.
  - **`ratio`** is the y frequency as a multiple of the x one, and it is what
    decides the SHAPE of the curve rather than its size: 1.0 an ellipse, 0.5
    a two-lobed figure-eight, 1.45 a tall pretzel. Was .8 everywhere.
  - **`reach`** scales both axes, for the shapes meant to leave the frame and
    come back — "the shapes need to be going off the screen, maybe a little
    bit. Some of them, can like come into the screen… that was a good thing
    about the randomness." Four do: the 137 circle exits left by 61px, and
    the 61 triangle, the 113 solid and the 53 circle exit right by 121, 190
    and 134. `overflow-x: clip` on the page makes leaving free.
  **TWO SLOTS GO OVER THE NAV NOW, by opt-in.** The rule used to be
  absolute and was right to be while nothing was meant to go up there; then
  Jack asked for two things that are. The red square should "go past the top
  line that we can see" — it reaches y −.004 at 1440, where `contain: paint`
  on `.hero-shapes` clips it at the viewport edge, so it slides up and out
  rather than piling against a boundary. And a small shape should "swoop…
  near the language button and the dark and light mode button" — the amber
  triangle reaches y 26px, which is the exact top edge of those two
  controls. A def carries `overNav: true` and `field-check` then allows it;
  **everything without the flag is still held out**, which is the part worth
  keeping, because the failure that rule catches is a shape drifting up
  there by accident after someone changes a size. The two controls gaining
  an opaque background is the condition for allowing it at all.
  - **`tilt`** shifts the y term against the x one, and it is what decides
    WHICH CORNER a shape heads for. Both terms share θ when `ratio` is 1,
    and sin/cos are 90° apart, so by default a shape traces an ellipse and
    its top coincides with its mid-x — there is no "up and to the left", only
    "up". At `tilt: -π/2` the y term becomes sin(θ) too, so x and y reach
    their minima together and the path becomes a diagonal. The red square
    carries it, on Jack's "make it when it goes to the top, make it move a
    little bit more to the left"; measured over 300s of simulated time its
    x/y correlation is **0.99**, against −0.04 to 0.18 for every other shape.
    Default 0.
  - **`pace`** multiplies the whole path's rate. It exists because `tilt`
    costs a shape its slow axis: tying x and y together means they share a
    frequency, so a shape that was crossing slowly in y and quickly in x
    ends up at one speed. `pace` puts the slowness back without untying
    them — the red square runs at 0.38, which reproduces the 64-second
    vertical it had before the coupling. It is also what lets a shape with a
    very long reach stay slow. Default 1.
  **Reach is still spent on X for the shapes that LEAVE the frame sideways**,
  and that part is forced: the nav is a thing to pass through, not a place
  to exit.
  **But spending it ONLY on X was an over-correction**, and Jack named it:
  "They go to the sides well. But they need to also make sure that they're
  going to the bottoms and the tops. They don't need to always be doing it,
  but sometimes." He was right about the cause — the four shapes with
  `reach` above 1 were all horizontal-dominant, so everything that moved a
  lot moved sideways. **Three shapes sweep vertically now**: the 47 on the
  far left (aspect 2.6, y .115–.831), the 81 in the centre (2.4,
  .188–.812) and the 68 in the seam (2.0, .448–1.074, which puts it 76px
  below the field box, where it is still visible and `.work` paints over
  it). Measured in the page, their vertical travel is 687 / 560 / 575px
  against a previous maximum of about 400. Aspects now run 0.45 to 2.6 with
  six horizontal-dominant, three strongly vertical and two near-neutral —
  "sometimes", not always.
  **The TOP band cannot be one of them, and that is arithmetic.** Those
  shapes rest at y .25 with the nav at .092, which leaves 162px of room
  including half the shape — about 114px of swing for a 96px square. So the
  shapes that reach the top strip come UP from the middle rather than down
  from the top band. Four now reach y .114–.139, where the nav bound is
  .092. **The 191 circle is the clearest case.** Jack
  wanted it moving more while staying "slow and… large", and vertical was
  not available: resting at y .26 it has about 39px of headroom to the nav
  above and 30px to the full stop below before its envelope breaks a
  landmark. Sideways there is nothing in the way, so aspect .45 / reach 1.6
  gives it 284px of horizontal travel against 80 before. It stays slow for
  free — it is the largest shape, so `t` is 0 and its speed sits at the
  bottom of the range, 20px/s at peak. An early pass gave the 61px triangle aspect 1.9 at
  y .28 and put it 5% into the nav band.
  **The keys are per SLOT, mirrored in both themes**, and `field-check`
  asserts it: the theme switch rebuilds the field inside the view-transition
  callback, and a slot that changes trajectory as well as silhouette is a
  shape that jumps mid-wipe.
  **`field-check` fails if the paths flatten** — under three distinct aspects
  or three distinct ratios. A low bar on purpose: it is there to catch a
  regression to one trajectory, not to dictate the spread. Every individual
  envelope was legal the whole time this bug existed, which is exactly why
  nothing caught it.
### White space, loudness and occupancy

- **The white space below the hero is mostly intentional, and the part that
  was not is fixed.** Jack asked whether the gap between VIEW PROJECTS, the
  marquee and SELECTED PROJECTS was deliberate. Most of it was: the marquee
  was meant to be a seam with air around it, and `#work .section-head`'s
  64px top padding is a number he tuned himself (70 → 38 → 64). What was NOT
  deliberate was a hole in the shape field just above the strip — a side
  effect of moving band two off the marquee so a near-black circle would not
  smudge on a near-black slab. Measuring the field's vertical occupancy in 5%
  slices showed one slice at y .55–.60 completely empty. Band two moved down
  and band three up, and the centre shape sits at .55.
  **The strip itself came out on 2026-11-18** and that band is open page now,
  which makes the fix matter more rather than less: there is nothing else
  down there.
  **Loudness is in `field-check` too**, printed as a profile per theme.
  Read it as a shape rather than a score: a field wants one clear top and a
  long tail, and what it does not want is its loudest object parked in the
  middle, or two tied at the top. Light currently runs
  `113=45 96=33 53=24 81=23 47=19 191=13 137=8 36=3 68=3 84=3 61=1`.
  **The tail is very quiet and that is deliberate.** The four shapes at 3
  and below are 2px outlines at .34, which is texture rather than object —
  `--accent-warm` is 1.94:1 on the ground, so the amber triangle at 1 is
  the faintest thing in the field by a distance. Nothing should be "fixed"
  about that without Jack asking: every step this field has taken on his
  eye has been quieter, and the outline weight came down twice on his word.
  It is recorded so the next person does not find it and assume it was an
  oversight.
  **The occupancy scan answers this, and it is in `field-check` now** rather
  than being rewritten as a throwaway each time: twentieths of the field,
  counting how many shapes can REACH each slice. Reach is the actionable
  half — a slice no envelope covers is a part of the hero no shape ever
  visits, and no amount of re-timing will fill it. One slice is supposed to
  be thin, the nav band, and the line flags any other slice only one shape
  can get to. It currently reads `22555667677667555321` — the nav band reads
  2 because two slots carry `overNav`, and slices 12–13 read 6 and 6 because
  the marquee slab that used to sit there is open page. The only thin slice
  left is the very bottom, 4000px above nothing anyone is looking at.
### The seam ring, and why drop-shadow

- **The seam form** (`.work::before`) is one oversized ring at the top-right
  of #work, bleeding off the right edge, behind everything. The drifting field
  is small and moving, so its 306px overlap into #work read as leftover hero;
  one large, completely still form is the opposite register, and that contrast
  is what makes the seam read as composed. Small things drifting in front of
  one big thing holding still is depth; eleven small things drifting is
  weather. It used to echo the field's largest outline circle, which sat in
  the same corner at two scales; in the current arrangement that corner
  holds the field's largest SOLID instead, a 113px coral disc half off the
  right edge. **`z-index: -1` is load-bearing**: #work's content
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
### The theme switch

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
    section rules and marquee not at all (the strip has since gone, the rules
    have not). Two carve-outs: the knob gets
    `transform` back (it has to travel), and `.hero-shapes .shape` does not
    (JS writes its transform every frame, and a transition makes it smear).
- **The hero field is positioned the moment it is built** (`placeShapes()` at
  the end of `buildShapes()`), not on the next animation frame. That one-frame
  gap is invisible normally and very visible under a view transition: the
  theme switch rebuilds the field inside the transition callback and the new
  snapshot is taken BEFORE the next frame, so without it the wipe reveals
  eleven shapes piled in the top-left corner and holds them there for 620ms.
  **Anything JS positions must be positioned synchronously for the same
  reason.**
- **The browser pane cannot run a view transition.** Its frozen rendering
  means `transition.ready` never settles, so the wipe neither starts nor is
  observable there. Verify the logic by stubbing `document.startViewTransition`
  and `Element.prototype.animate` and asserting the keyframes, origin, radius,
  duration and which path was taken — not by watching.

## The loading skeleton

It exists to make the handover invisible, so **it is only as good as its last
measurement** — and it drifted badly three times before the numbers were
taken out of it. **Prefer deriving a bar from the rule it stands in for over
measuring it**, because a measurement is right at the width it was taken at
and nowhere else. Three of the four sweeps below found a value that had been
correct when someone wrote it down.

- **`.sk-hero` must mirror `.hero`'s `min-height` (66vh) and its 40px
  bottom padding, not `flex: 1`.**
  The loader is a fixed full-viewport box, so `flex: 1` made the skeleton
  hero 900px tall at a 900px window against the real 720. Both centre their
  group inside themselves, and centring the same content in 900 instead of
  720 put every landmark **87px low**. This was by far the biggest jump.
- **The headline comes off ONE custom property, `--sk-name`**, which is
  `.hero-name`'s own font-size copied clamp for clamp — including the mobile
  one, **at its own breakpoint, which is 900 and not 760**. Both title bars
  take both height and width from it: height is the 0.84 line-height, and
  width is the ink, which for one word in one typeface is a fixed multiple of
  the size. **JACK is 2.852× the font-size and MURRAY. is 4.687×**, measured
  identical to three decimals at 1440, 1280, 1024, 900, 760, 600 and 375. The
  grid's first track is the same 4.687, so the track and the bar inside it
  cannot drift apart.
  This replaced four percentage caps, and percentages were the wrong tool:
  they were percentages of a COLUMN, and the column keeps widening after the
  headline has hit its 12rem cap. At 1024 the second bar drew **860px of
  MURRAY. against a real 719.9**, and at 900 the pair were 161px and 137px
  too wide. Mirroring the mobile clamp at 760 instead of 900 made every bar a
  line-height too tall between those two widths as well.
- **The right column comes off `--sk-role`** the same way, and mirroring it
  needs the container query as well as the clamp: `.sk-side` carries
  `container-type: inline-size` and declares
  `clamp(1.45rem, 10.6cqw, 2.35rem)`, and only its CHILDREN read it — same
  rule as `.hero-side`, for the same reason. Badge margin `0.8×`, role margin
  `1.3×`, role height `2.2×` (two lines at line-height 1.1) and role width
  `7.94×` (the ink of DIGITAL CREATIVE).
  It replaced a flat 30 / 44 and an 83 / 79 pair. Thirty happened to be right
  at the cap; **44 never was — the real gap is 48.88** — and because the
  column is bottom-aligned on a desktop that 5px pushed the badge and the role
  line 4px up from where the page then drew them.
- **Only the fixed-size controls are still measured**: the badge at 222.1 ×
  35.5 and the CTA at 226.2 × 61.5, both in English at every width. **That
  badge number has moved four times** and the list is the warning — 296.4,
  then 295.4 when the availability dot became a square, then 126.6 for LET'S
  TALK, now **222.1 for LET'S MAKE SOMETHING**, plus 2 for the mark growing
  8 → 10 and 4 for the gap going 10 → 14. **A copy change is a skeleton
  change, and so is a spacing change.** Across the four languages it runs
  150.5 (ja) to 222.8 (es), and English at 222.1 is within 0.7 of the widest
  Latin one. Japanese is the tall one at 37.5, and takes the CTA to 65. A
  skeleton is drawn before i18n has run, so it can only ever be one language,
  and English is the default.
  **The overflow guard on `.sk-badge` is `min(100%, …)` and not 96%**, which
  cost a 5.5px error for one commit: at a column of 225.6 the container query
  below has just stopped firing, and 96% of 225.6 is 216.6 against a real
  badge of 222.1. Everything narrower than the badge is already handled by
  that query, so the percentage only has to not clip — 96 bought nothing and
  broke the one width where the two rules meet.
- **1281 to ~1296 is its own problem**, and both controls are in it. The hero
  is two columns there but the side column is narrower than the badge and the
  button, so both wrap — 51px and 81px tall, stretched to the column — and the
  skeleton has to wrap with them. Two **container** queries say exactly that
  (`@container (max-width: 222px)` and `226px`), because the condition really
  is about the column and not the viewport. Measured at 1281 (column 213) and
  1288 (219.3) the badge wraps; at 1295 (225.6) it does not, which is where
  the 222 comes from — the badge's own width. The badge band is 1281 to ~1291
  and the button's 1281 to ~1296.
  **That badge rule has been deleted and reinstated once**, and that is the
  part to read twice. At 295px of label the band was 1281 to ~1373 with
  1366 × 768 in the middle of it. LET'S TALK took the badge to 126.6 —
  narrower than the column ever gets in two-column mode — so the rule could
  not fire and was removed rather than left idle. LET'S MAKE SOMETHING took it
  back to 222.1 and the rule had to come back. Neither call was wrong: the
  point is that **this threshold is a function of the LABEL**, so it has to be
  re-derived whenever the copy moves, in both directions.
- **The nav is three children, not two.** `.nav` is `space-between` with
  wordmark, links and controls, so the links bar has to be a child of
  `.sk-nav` too — nested inside the right-hand group it drew at x984 against
  a real x537, a **447px** jump in the one row the visitor is already looking
  at. The right cluster is a 40px button and an **84px switch**, not three
  equal squares: both are flex-end, so that error kept the right edges lined
  up and put all of itself on the inside. And the nav's narrow-phone
  override is at **360**, mirroring `.nav`'s own rule — it sat at 480, where
  the page changes nothing.
- **The breakpoints are not interchangeable and mixing them up is the
  recurring bug.** The grid stacks at **1280**, the nav goes to a drawer and
  44px targets at **760**, the headline changes clamp at **900**, and the nav
  tightens at **360**. Three of those four were wrong in here at once.
- **THE SEAM BAR HAS TO BE DRAWN THE SAME WAY, not just put in the same
  place**, and this is the one thing the marquee's removal actually broke.
  `.sk-hero-grid` had a plain `border-bottom: 6px solid var(--ink)` while
  `.hero-grid` has a transparent border plus a full-bleed `::after`. Both
  were wrong and both were invisible while the strip existed. A border is
  bounded by its element and the element sits inside `.hero`'s 5vw padding,
  so the loader drew **1296px against the page's 1440** at that width — the
  strip underneath used to supply the full-bleed edges, so the black mass
  looked right. And `--ink` IS the dark ground, so in dark the skeleton's bar
  was invisible — which agreed with the page only because the page's own bar
  was `display: none` in dark while the strip drew its own 2px rules. Remove
  the strip and both errors surface at once. The skeleton now mirrors the
  `::after` exactly, `var(--black)` included; verified identical colour,
  width, height and y in both themes.
  **The lesson generalises:** a skeleton bar that merely MEASURES the same is
  not the same. Check how the real one is painted, not just where it sits —
  an element-box diff will not catch a border standing in for a full bleed.
- **IT COVERS THE WORK BAND NOW, NOT JUST THE HERO.** It stopped at the hero
  for as long as `.hero` was 80vh and the hero WAS the first screen. At 66vh
  the first screen also carries SELECTED PROJECTS, the filter row and the top
  of two cards — about 300px of it — and the loader was drawing nothing
  there. Jack, looking at a picture of it: *"we're missing all this stuff for
  the bottom."*
  **The way to see why it mattered is the cross-fade, not the skeleton.** The
  loader dismisses on a 0.5s opacity transition with the real page already
  painted underneath (the rAF in `dismiss` is there so the two cross rather
  than flashing). Caught at 55%, the hero was dissolving out of grey blocks
  while the bottom third faded up out of blank paper — two different
  handovers in one screen, and the lower one in the band the 66vh change
  exists to show.
  **Everything that POSITIONS it is shared with the real rules, not copied.**
  `.sk-head` rides along on `.section-head`, on `#work .section-head`'s 40px
  and on its 28px at ≤760; `.sk-filters` on `.filters` and its ≤760
  padding; `.sk-cards` on `.gallery`'s column count. A mirrored number cannot
  drift if it is not a second number. The 4px rule is drawn too — it is
  structure, not content, and it exists the moment the page lays out.
  **Only the BARS carry multiples**, by the same method the title bars use:
  SELECTED PROJECTS is 11.753× its font-size (identical at 1440 and 1024),
  and the chips are multiples of their own 0.8rem — 5.195 / 6.351 / 8.765 /
  11.37 / 7.556 for ALL, UX/UI, GRAPHICS, PHOTOGRAPHY, MOTION, identical at
  1440, 1024 and 390 because none of them depends on the viewport. **A copy
  change is a skeleton change here exactly as it is for the badge.**
  **The height multiple, 1.082, is a compromise rather than a measurement.**
  `line-height: normal` on Archivo Black lands on a rounded line box, so the
  real ratio wobbles: 1.0870 at 1440, 1.0892 at 1024, 1.0769 at 600. Taking
  1.088 from the two wide readings put the bar 1.43px tall at 600 — and an
  error in this bar is an error in **everything below it**, so the filter row
  and the cards moved with it. 1.082 is the centre and holds every width
  inside half a pixel of the bar itself.
  **Two structural cases.** The heading wraps to two lines at ~550, where the
  clamp has bottomed out at 2.3rem so the ink stays 432.5px wide while the
  column keeps narrowing (measured one line at 551, two at 540); below that
  the bar is 5.767× wide and two lines tall. And at ≤800 the gallery is one
  column, so the second card block is dropped — stacked, it would halve both
  blocks, and only the first row is ever on screen there.
  `.sk-card` carries `margin: -1.5px`, the same overlap `.card` uses.
  **Current state: within 1.2px at 320, 390, 540, 600, 801, 1024 and 1440.**
  The residual is the line-box rounding above and is not reducible with a
  single constant.
- **How to check it.** The loader removes itself 600ms after load, so do not
  race it: inject a second copy instead. `fetch('/')`, pull `.loader` out of
  the parsed document, give it a new id and `visibility: hidden`, append it to
  `body`, and diff its boxes against the real ones in the same frame — the
  clone is the same markup under the same stylesheet, and `visibility: hidden`
  still lays out. Compare the title and role bars against the text's INK
  (`Range.getBoundingClientRect`), not the element box, because those elements
  are blocks that fill their column. Drop the `visibility` and outline the
  bars to see it over the live page. **In the browser pane use `setTimeout`,
  never `requestAnimationFrame`** — a hidden pane never fires one and the
  probe simply hangs.
  **THREE WAYS TO WRITE THIS PROBE WRONG, all of which report a drift that
  is not there.** It took three passes on 2026-11-18 to get a clean answer,
  and every false alarm looked like a real regression:
  1. **Comparing the role bar's WIDTH against the element box.** `.hero-role`
     is a block that fills its column, so the box is 201px wider than the
     text at 1600 and the error grows with the viewport. Width goes against
     `Range.getBoundingClientRect`; Y and HEIGHT go against the box, because
     a Range returns the FONT box (ascent + descent), not the ink — on the
     headline that is 54px taller than the line box and sits 24px off.
  2. **Testing `visibility` or `opacity` to decide what is shown.** The clone
     is `visibility: hidden` on purpose, and that inherits, so the check
     calls every bar in the skeleton invisible and reports fourteen
     mismatches at once.
  3. **Measuring straight after a resize.** The phone nav drawer needs a
     moment to settle; at 150ms it reported as on-screen at 760 and 390 but
     not at 320, which is the kind of inconsistency that means the probe and
     not the page. 600ms is enough.
  4. **Adding `.in-view` without killing transitions FIRST.** Everything in
     `#work` is a `.reveal`, which rests 40px low, and the pane will happily
     report the class as applied while `getComputedStyle` still returns
     `matrix(1, 0, 0, 1, 0, 40)`. Every landmark below the hero then reads
     exactly 40px out — a clean, consistent, entirely fictional offset that
     looks far more like a real bug than a flaky one. Inject
     `transition: none` first, THEN reveal, then measure.
  **Use geometry for "is it shown": `display !== 'none'` plus a rect that
  overlaps the viewport.** That last part is not pedantry — at ≤760 the real
  `.nav-links` is a fixed drawer parked with its left edge exactly at the
  viewport's right edge, so `display` alone calls it visible while the
  skeleton correctly draws a burger instead.
  **Current state: all 14 landmarks clean at 320×568, 360×740, 390×844,
  600×900, 760×800, 768×1024, 820×1180, 900×800, 901×800, 1024×768,
  1280×800, 1281×800, 1285×800, 1290×800, 1296×800, 1366×768, 1440×620,
  1440×900, 1440×1200 and 1600×900.** **Heights are in that list now and
  belong there**: `min-height: 66vh` means the hero's height is a function
  of the viewport, and 1440×620 is the case where the content is taller than
  66vh so the hero is content-bound rather than height-bound — a different
  code path that the skeleton has to track too.
  The one deliberate exception is the first title bar, which is 6px short
  because that gap is taken out of its height and given back as its margin,
  so the pair measures exactly two lines.

### The case-study layout — one project, and the flag is the point

**`pot-clip` is the only project with it, and it replaces that project's
whole page.** `caseStudy` in `projectData` describes a masthead, three
summary cards, a brief band, a sticky table of contents beside seven
sections, and a disclaimer; `renderCaseStudy` builds all of it into
`#projectCase`, and `.project-detail.is-case` hides `.project-media` and
`.project-body`. Jack: *"we're going to redesign the entire page for the
project. Later, we might use it to do other projects, but right now we're
just going to work on this one."*

**THERE IS ONE OVERLAY BEHIND ALL SEVEN CASE STUDIES**, which is the whole
reason this is a flag and not a rewrite of the shared markup. The treatment
it replaces — `titleTop`, which moved the chip and the heading above the
media — started as an unflagged change and moved the title on all six
projects at once. That is the trap every experiment here falls into. Proof
rather than assertion: every landmark of the other six was diffed against
the committed build at **1440, 900 and 390, and all six are identical.**

**`titleTop` IS GONE**, absorbed by this: the case study puts the title at
the top on the full measure, which is what that flag existed to try. The
`.project-head` div, `.is-title-top` and their CSS went with it rather than
being left idle.

**Three things that bit, all of them invisible in the markup:**

- **An empty `<div>` is still a grid item.** `.has-sidebar` is a
  two-column grid, so an empty `#projectCase` took the first cell and
  **swapped the photographs with the write-up** on cat-coaching and
  monmouth-retreat, and cost oasis-journey a 40px row. Hence
  `.project-detail:not(.is-case) .project-case { display: none; }`. The old
  `.project-head` rule carried this same note for this same reason, which
  is how it was recognised.
- **`innerHTML` destroys what you moved in.** The layout MOVES three
  permanent elements into itself — the chip, the `<h2>` and
  `#projectStage` — and the next render starts by replacing all of
  `#projectCase`. So opening pot-clip, closing it and opening **anything**
  removed the heading from the document, and since it is the overlay's
  `aria-labelledby` target the panel lost its accessible name with it.
  `renderCaseStudy` now parks all three back home before it wipes.
  **The first open is the one case that cannot fail**, because nothing has
  been moved yet — so drive open/close four times, not once.
- **The lightbox was bound to `#projectMedia`.** Thirteen photographs had
  the cursor, the role, the tab stop and the title and did nothing when
  clicked. It is delegated from `.project-detail` now, and
  `markZoomableImages` walks the same root.

**Strings are FULL KEYS in `projectData`, not suffixes the renderer builds.**
A second project adopting this layout brings its own keys and needs no code
change, which is what Jack asked for. And `audit.js` finds a key by looking
for the literal, so a key composed from a prefix at runtime reads as dead —
which is how 19 dead translations once survived. The same rule caught
`cs-figs-' + list.length`: the row class is a lookup table so the three
names appear as literals.

**Alt text is BY KEY here, not by position.** `resolveAlt`'s
`proj.<id>.alt.<n>` is right for a wall that is one ordered sequence and
wrong for seven sections — moving a figure from Process to Testing would
silently hand it another picture's description. An entry carries `altKey`,
`mediaTag` stamps `data-i18n-alt`, and **i18n.js's own `apply()` pass
refreshes it on a language change** with nothing in `script.js` involved.

**EVERY GENERATED NODE CARRIES `data-i18n` OR `data-i18n-html`**, for the
same reason: a language change is then `apply()` walking the document, not
a re-render. That is not tidiness — the turntable lives inside the Design
section, and re-rendering to change language would tear the canvas down
under the visitor.

**The turntable MOVED here rather than being rebuilt.** `renderProjectStage`
appends `#projectStage` into `.cs-stage-slot` and puts it back for every
other project. One canvas, one poster, one owner. Verified across four
open/close cycles: exactly one `.model-canvas` each time.
**It is in "The design", not at the very top**, which is a change from
*"put it at like the very top"* — that instruction was about it not being
a tile in the photo wall, and the wireframe Jack drew afterwards places it
in that section.

**IT SHARES THAT BAND WITH THE PAINTED PIECE, AND IT HAS A FRAME NOW.**
Both on Jack's word, and both overturn something written here, so the
reasons matter.
*"Move it to the left and put in a new photo I added called
newpaintedmodel to the right of it to use the space better."* So the slot
is a 1.6fr/1fr grid — turntable left, photograph right, tops level. **It is the same object twice**, which
is why it belongs in this section rather than in Process: left, the
digital model you can turn; right, the physical one it was scanned from,
hanging in the spray booth in its silver finish. The section asks what the
thing is, and that pair answers it.
**A ratio here where `.cs-split` uses a fixed 340**, and the difference is
what the other column holds. There it is TEXT, and a fraction would
squeeze the measure as the viewport narrows. Here it is a canvas, and the
constraint runs the other way: the turntable is the subject and has to
stay the larger of the two. Fixed at 340 it did not — measured at 901 the
stage came out **435 beside a 507-tall photograph**, the supporting
picture winning the row. 1.6fr/1fr reproduces the 1440 answer almost
exactly (546 / 342 against 548 / 340) and holds the order all the way
down: the stage is the taller of the two at 1440, 1100 and 901.
**A FIXED TRACK IN A GRID DOES NOT STACK ITSELF**, and leaving that out
was the one real break this change shipped and caught. With `1fr 340px`
and no media query a 390px phone drew the stage at **50×50 inside a
426px-wide slot** — narrower than the thumbnail beside it and wider than
the screen. It stacks at 900 with `.cs-split`.

**THE FRAME IS RED, AND THAT IS NOT THE BOX THE VIEWER NOTE BANS.**
It began grey, on *"the 3d model should be given a boarder around to see
where you can drag, but it should be a light grey border, different from
the others"*, and it is `--accent` now on *"put the 3D model box in a red
outline so it stands out."*
The *Where it sits* note says no border, no background, no frame of any
kind — and it was written against the stage being **a tile in the photo
wall**, wearing the same hard 3px black as the thirteen things you only
look at. A frame of another colour says the opposite thing: black frame, a
picture; this frame, a region that answers the pointer. The photograph
beside it wearing the black one is what makes that legible, which is the
one reason this could only work once the band held a pair.
**Grey said it quietly and red says it out loud**, which is the whole of
the change: grey left the reader to notice, and this is the one thing on
the page you can take hold of. The colour is not a new one either — it is
the full stop after MURRAY, the section marks and every hover block, so
the frame wears the colour that already means *this part is live*.
**`--accent`, because it flips**: coral `#CF625A` on the light ground and
hot pink `#ff2d55` on the dark one, measuring **3.21:1 and 5.16:1**. Both
clear the 3:1 a non-text UI border owes; neither is text, so 4.5 does not
apply. One declaration, no theme override — the same reason the grey
`--line` it replaces was chosen (1.47:1 and 1.51:1, equally quiet in both
themes and, as it turned out, quieter than the job needed).
Same 3px as `.cs-fig` — the weight matches its neighbour and only the
colour differs. **Do not give it the hard rule**; that is the thing the
viewer note is about.
**AND IN DARK IT GLOWS.** Jack: *"in dark mode, can you make the 3D model
box glow a little bit like the neon?"* That is the brief's own split —
light refined, dark experimental — and the page already answers it the
same way in three places: the hero CTA, the badge mark and the seam ring
all bloom in dark and sit flat in light.
**`.btn-block`'s alpha and a slightly wider blur**: `0 0 30px` at **34%**
against its 26px at 34%. The same alpha because that is the strength Jack
already accepted on the CTA; wider because this is a 546px frame where
that is a 226px control, and a blur tuned to a small object draws a rim
round a big one instead of a halo. 26% at 34px was tried first and came
out closer to a smudge than a glow. `color-mix` on `--accent`, so it
tracks the token the border already uses, and **no light-mode
declaration** — a bloom on a coral frame over sand is the gradient this
page does not do.

**AND THE DRAG LABEL IS INSIDE IT NOW, 14px from the top-left corner.**
Jack: *"move the drag to rotate text to the top left inside corner of the
3d model box."* Under the canvas it was a caption ON the box; inside it, it
is a label on the region it names — the same thing the grey frame says,
said in words, on the surface the pointer has to be on for it to be true.
**There is room because the fit wastes it**: the camera fits the bounding
sphere at the worst orientation, so the object covers 52% of the height
whatever the box shape is and **73% of this box is dead area** — the figure
the square crop was argued over. The label spends one corner of it and the
object does not move.
**It is MOVED into `.model-stage` by `renderProjectStage`**, not written
there: `renderCaseStudy` owns the string and its `data-i18n` key, and that
function runs for all seven projects. `.model-stage` is `position:
relative` and fills the frame, so one rule places the label in the pair,
the stacked pair and a stage with nothing beside it — and the slot stops
needing to be a flex column, which is all the old `order: 2` was for.
**Two things are load-bearing and neither is visible.** `pointer-events:
none`, because `.model-stage` IS the drag target and carries
`cursor: grab`, so a label that took the pointer would kill the gesture in
the one corner it sits in. And `z-index: 2`, because `setupModelStages`
appends the canvas AFTER the label is moved in and the canvas is
positioned — at auto it paints over it. The same 2 `.model-hand` carries,
for the same reason.
**It sits on the frame's own `--white`, not on anything the renderer
draws**, because the canvas clears with alpha 0 — `--muted` measures
4.72:1 light and 6.78:1 dark. Measured 14.0 / 14.0 in all four languages,
widest at 161.6px (Italian) in a 540px box, and still clear inside a 282px
one at 320.

**The contents links scroll and do not navigate, and the default is
cancelled for modified clicks too.** A hash would work — the overlay is the
scrolling ancestor — but it also adds a history entry, and closing a panel
is `history.back()`. One click on the contents and Back stops closing the
panel and starts stepping through the sections, which is the Routing
invariant gone. Measured: history length unchanged, hash empty, pathname
intact, focus on the section (it carries `tabindex="-1"` so a keyboard
visitor continues from where they asked to be), and the heading lands at
y 72 under a sticky back button whose bottom is at 60.

**THE DISCLAIMER IS A SAFETY CONSTRAINT AND IS NOW CHECKED.** `pot-clip`
carries a real trademark and is not a client project; the paragraph that
says so is the last one of `proj.pot-clip.body`, which is what the markup
fallback and the JSON-LD description are built from. This layout hides
`.project-body`, so the paragraph needs a key of its own —
`proj.pot-clip.cs.disclaimer` — and two copies of a safety-critical string
in four languages is eight chances to edit one and not the other.
`audit.js` asserts they are the same string per language, and the check was
made to fail before being trusted. **Automated, not written down as a step.**
**JACK REWROTE IT ON 2026-11-23**, and what changed is worth reading because
it is the one paragraph on this site that is load-bearing for a trademark.
It now reads *"This was a student project at NABA in Milan. It is not
affiliated with Alessi and was not commissioned or reviewed by the company.
Alessi served as the reference brand for the assignment, and the posters are
an original concept campaign developed for this project."*
**The two claims that matter are intact and slightly sharper** — not
affiliated, not commissioned or reviewed, with "the company" in place of
"them". **Two things left.** The explicit *"is not a NABA product"* clause
is gone, carried now by "student project" and "the assignment"; and
*"classroom art direction rather than a real campaign"* became *"an
original concept campaign developed for this project"*, which claims the
posters as his work rather than disclaiming them as coursework. Both are
his call on his own project and neither touches the Alessi claims, but if
this paragraph is ever edited again, those are the two sentences a reader
could lean on. The title and the URL still carry no brand name.

**THE NEXT PROJECT SITS BESIDE THE DISCLAIMER.** Jack: *"add a button…
right next to that on the right side of it that would say like next
project, and then under that it would say the next project… that way it
leads them into more projects."* `.cs-foot` is a `1fr auto` grid and the
3px rule moved onto it from the paragraph, so one rule crosses the pair
and the foot reads as one block rather than two.
**The order is the gallery's, which is `projectData`'s own key order.**
"Whatever was to the right, and if there was nothing to the right, then
down and to the left" is exactly reading order on a two-column grid, so
next is simply the following key. **It wraps at the end** rather than
stopping: a dead end on the last project is the thing the control exists
to fix.
**A real `<a href="/work/<id>">` with `data-open-project`**, so cmd- and
middle-click still open a tab and the delegated handler in SECTION 07 — the
one the about copy's project links already use — does the routing. No new
routing code, and `navigate()` pushes exactly as a card click does.
**PROJECT-TO-PROJECT IS A PATH NOTHING COULD TAKE BEFORE, and it needed a
guard.** `syncToRoute` re-renders in place when the id changes, but
`openProject` ended with an unconditional `activateDialog`, which PUSHES —
so the same overlay would have sat on `dialogStack` twice, Escape would
have closed one entry and left the panel open, and `deactivateDialog` would
have restored focus to a trigger two projects ago. It now re-focuses the
overlay region instead when it was already open: focus still has to move,
because the link that was clicked is inside the markup the re-render is
about to replace.
**One consequence, recorded rather than fixed:** closing is `history.back()`,
so after following the chain, Escape steps back a project at a time instead
of closing outright. That is the same thing the browser's own Back does
and the price of the link being real navigation; `replaceState` would close
to the gallery from anywhere but would make Back skip the project you just
came from.
**The title under the label is NOT translated and carries no `data-i18n`** —
all seven live in `projectData` in capitals, identically in every language.
Only the label has a key, `project.next`, in the same namespace as
`project.back` / `type` / `year` / `role`. Measured: the control is
337 × 83 in English, Spanish and Italian and 337 × 87 in Japanese.
**The label is `--accent-ink`, not `--accent`**: it is 12.8px text, which
owes 4.5:1, and coral gives 3.21 on this ground where the ink gives **4.71
light and 5.16 dark**; the title measures 14.77 and 16.9.
**It is the house control** — flat at rest, a 3px lift into a 6px `--accent`
block on hover, which is `.form-submit`'s proportion — and it is in all
three hover-pad lists, so it cannot flicker. Verified under a real pointer:
`transform` translate(−3, −3), a 6px coral block, and the pad at
`0 −6px −6px 0`, which is the lift plus the 3px border exactly.
**IT IS ON pot-clip ONLY so far**, because the disclaimer it sits beside is,
and the other six would need the same block in `.project-body`'s foot — the
shared path for all six at once, which is the thing this file keeps saying
to do one at a time.

**Measured on the page, 1440×900:** `.project-detail` 1380 wide (the other
six keep 1100), 1236px of content, split 240 / 72 / 924 between contents,
gap and text column. Masthead 1.25fr / 1fr. Contrast: **0 failures across
82 text elements in both themes**, tightest `.cs-brief-t` at 4.60 (accent on
ink, light). All seven contents links are 44px tall in English and in
Japanese. (This also named `.cs-stat-num` at 3.21 against its 3 bar until
the Testing figures came out on 2026-11-22 and took that class with them.)

**The measure is wider HERE AND ONLY HERE.** Jack: *"you probably have to
widen out the sides of the borders, because right now I think they're too
small."* `.project-detail` is 1100 and stays 1100; `.is-case` is 1380.
Widening the base would reflow the other six, and the instruction when this
work started was not to touch them.

**Japanese needed two additions, and one deliberate omission.** `.cs-h`,
`.cs-brief-t` and `.cs-defs dt` join the `font-weight: 900` list — their
content IS Japanese, and Japanese falls through to Noto Sans JP, which
carries real weights. **The step counters are excluded** for the reason
`.stat-num` is: a counter is Latin in every language, so a 900 there is
synthetic bold and a smeared glyph. (`.cs-stat-num` was the other exclusion
and is gone with the Testing figures — "約50%" was three Archivo Black digits
beside one Japanese glyph, which is the same trap in one string.) Nine tracked classes also reset
`letter-spacing`, since tracking tuned for uppercase Latin reads as broken
spacing in a script with no word spaces.

**Photographs keep their natural ratios inside a row, and nothing is
cropped to even a row up.** Individual frames ARE cropped, where the
photograph has room in that direction and the page needs a shape — the
masthead, the render, both of card 1's and the rim shot all are, each noted
where it is set. What stays banned is cropping to make two pictures the same
height as each other.
Equal-height rows were the obvious alternative and they cost the pictures: a
1000×1778 spray booth forced into 3:2 loses 44% of its height, and the part
a process photo is for is the part that gets cropped. Ragged bottoms are
what an editorial page does with photographs of different shapes. **A lone
portrait is capped at 400px** — at the column's full 924 a 1000×1778 source
draws 1643px tall, two and a half screens of one photograph.

**LIMITATIONS ENDS ON ITS LAST "NEXT STEP", WITH NOTHING AFTER IT.** There
was a closing line — *"A second version would start with rim fit and heat
and let the form follow"* — and Jack took it out. It was the four rows of
the table said again in one sentence: rim fit and heat are the first two
rows, and "let the form follow" is what a list of next steps already
means. The brief's own words for that are *unnecessary descriptions*. **It
was the only user of `after`**, so the renderer branch and the four i18n
keys came out with it rather than being left idle — the same call as
`titleTop` and `stats`.

**AND IT OPENS ON A STATE RATHER THAN ON A TEST.** Jack: *"change 'Testing
showed real problems with the concept, and some of them need more research
before this could become a product.' to 'There are still real problems with
the concept, and some of them need more research before this could become a
viable product.'"* One sentence, two things.
**"Testing showed" had been opening two sentences in a row** — this line
and RIM FIT directly beneath it — and only the second one earns the phrase,
since it is reporting what a test found. The section says it once now.
**And *viable* is the word the rest of the page is careful about.** The
Outcome card says the idea is *working* on thin-rimmed pots, so what is
missing is not evidence that it works but the distance between a working
idea and a product, which is exactly what the four rows below it list. A
flat "a product" made the gap sound like a formality.
The Romance languages take the impersonal — *"Sigue habiendo problemas
reales en el concepto"*, *"Restano problemi reali nel concept"* — and
Japanese carries *still* as 依然として; *viable* is *viable*, *valido* and
実用的な.
**Nothing below it moved**: measured at 1440 by putting the old strings
back into the live nodes, the lead sets two lines before and after in all
four languages and the section is the same 606.5 (en, ja), 681.7 (es) and
631.6 (it) tall.

**TESTING CARRIES NO FIGURES ANY MORE.** It opened on two — `~50%` of pots
and `1 shoot` — and Jack took them out: *"just to make that section
smaller."* Nothing left the page with them: the half survives in
Limitations ("one clip profile fits only about half of pots", in all four
languages) and the product shoot is in the Finding sentence, which is
where it had been saying the same thing twice (the duplication this file
flagged when the copy went in). **It survived on the Outcome card too
until 2026-11-22**, when Jack rewrote the three cards and that one became
the deliverables — so Limitations is now the only place the half is
stated, and it is the place that qualifies it. **It was the
only user of `stats`**, so the renderer branch, the four CSS rules and the
sixteen i18n keys came out with it rather than being left idle — the same
call as `titleTop`, and all of it is in `docs/pot-clip-masonry.md`. Testing
is **835 → 556 → 362** over the three passes — and 362 is also what it
measures after `asideTop`, because the figure was out of flow before the
change and is out of flow after it, so starting at the heading costs the
page no height at all. (The 433 this line quoted was measured some other
way; the committed build before `asideTop` measures 362 at 1440 in
English, checked against `git stash`.)

**POSTERS IS "POSTERS", AND THE TEXT IS UNDER THE PICTURES.** It was
"Posters and packaging" over a one-line description; there is no packaging
in the section, and Jack rewrote the copy to say what the series is for —
the campaign line *Il buon design vive nei dettagli* tying back to what
research found about Alessi. `textBelow` is the flag: three posters are the
output of this section, and the paragraph explaining them is a promise
before you have seen them and a caption after. *"Move them to under the
posters."* The copy is `html` rather than `text` because it quotes that
line in italics, and `csText` escapes a `text:` string — it would have
printed the tag.
**THE CAMPAIGN LINE IS BOLD, AND THE SOURCES SENTENCE LOST ITS TAIL.**
Two more of Jack's: *"take out the words 'and current graphic design
trends'"* and *"make the 'Good design lives in the details' in the
paragraph bold."*
The first is a claim the page cannot show — the posters are in the
section and the brand's own posters are nameable, where "current graphic
design trends" is the kind of phrase that sounds like research and points
at nothing. What is left is *"drew on the brand's existing posters."*
**The bold goes on the line the reader can actually READ, which is a
different element per language.** In English, Spanish and Japanese that
is the gloss in brackets after the Italian — `<strong>` inside the
quotes, so the quote marks come with it — and in ITALIAN the gloss does
not exist, because the campaign line already is the sentence; there the
`<em>` carrying *Il buon design vive nei dettagli* takes the `<strong>`
instead. Bolding the Italian in the English version as well would put two
weights on one line and emphasise the half nobody in that language reads.

**THE DESIGN IS WRITTEN IN THE CONDITIONAL.** Jack: *"change 'Two
independent supports sit' to 'Two independent supports would sit'."* It
is the same correction as "proven" becoming "working" on the Outcome
card, one section along: the object is an appearance model, so what it
does on a real pot is what it WOULD do. The Romance languages take the
conditional on both verbs of that sentence, because they have to
(*"se apoyarían … se deslizarían"*, *"poggerebbero … vi scorrerebbero"*),
and Japanese carries the modality at the end of the sentence instead
(*"…スライドする想定だ"*), since there is no auxiliary to put in front.
The rest of the paragraph stays in Jack's present tense — he changed one
verb, not the voice of the section.

**THE PROSE MEASURE IS 66ch, AND THE NUMBER COMES FROM ONE LINE IN THE
PROBLEM.** Jack: *"'Space. A separate spoon rest takes up work surface
that small kitchens don't have.' has a widow at the end, just extend the
box so the last word can be with the rest."* That item sets **675.2px** on
one line in English and the box was **669.4** — it missed by 5.8px, half a
character, and dropped "have." onto a line of its own under two items that
each fit.
**66ch is 690px**, clearing it by 15 — slack enough that a word of copy
either way does not put it back — and it is +3% on every other paragraph,
which is invisible and still inside the 45–75 characters a measure is for.
Going wide enough for Spanish (754px) or Italian (739) would have meant
**73ch**, past that range, for two languages that wrap tidily at 66 anyway.
**It does not touch Research or Testing**, and that is the thing to check
before moving it again: their prose sits in `.cs-split`'s 1fr column,
548px at 1440, narrower than either cap — so the column binds and the two
heights that photographs are sized from do not move. Measured identical
before and after, 0.00 top and bottom in both.
**And the pull quote came up with it**: `.cs-quote`'s top margin is 26px
where it was 34 — *"pull things under it up a bit"* — and 26 is the gap
this page repeats everywhere else, where 34 was a number of its own. With
the third item back on one line, The problem is **427px → 392**.

**THEN ITS OPENING SENTENCE WENT, AND THE LIST IS THE SECTION NOW.** Jack:
*"remove 'While cooking, there's no clean, secure place to set a utensil
down for a moment.' so that way the bullet points under it take more
emphasis."* He is right about what it was doing: the three items ARE that
sentence, itemised — instability, dripping and space are the three ways
there is no clean place to put a utensil down — so the paragraph announced
the list and then the list said it properly. The brief's own words for
that are *unnecessary descriptions*.
It costs the section a full-measure line in English and Japanese and two
in Italian: **The problem is 392 → 344 (en, ja), 419.5 → 371.7 (es) and
474.9 → 399.5 (it)** at 1440, and everything from The design down moves up
by exactly that — measured against `git stash`, Research and The problem
start on the same pixel in all four languages and the five sections below
them move 47.7 / 47.8 / 75.4 / 47.7. Nothing else changed, at 1440, 1200
or 901.
**It also gave the drawing beside it more room, not less** — see the scan
in the next note.

**THE PROBLEM CARRIES A DRAWING IN ITS RIGHT MARGIN.** Jack drew a
dripping spatula — `Logo Inner Line Update.png` — and asked for it
*"to the right inside of The problem section"*. It belongs in that one
and nowhere else: a utensil with a drip running off it **is** the second
item in the list, and it is the same line-art family as the four utensils
drawn around the render on the gallery card, so the card and the section
it opens are drawn in one hand.
**IT IS A MASK, NOT A PICTURE, and the file made that easy.** 83% of it
is fully transparent, the spatula's own slots included, so its ALPHA is
the drawing — and the ink measures `#1A1A18`, which is `--black`'s light
value, so Jack drew it in the page's own ink without being asked.
`.cs-art` paints `var(--black)` through that alpha: the same value in
light, `#F4F2F5` in dark. One file, right in both themes, where an
`<img>` would be a near-black drawing on a near-black ground the moment
the page flips.
**The url is handed to CSS as `--art`, the same shape as `--fig-ar`**,
because `tools/asset-rev.js` only rewrites `?v=` hashes in `script.js` —
a `url()` written in the stylesheet could never carry one, and this is a
live path under `/assets/` with a week of stale-while-revalidate behind
it. Exported **380 × 667** from the 426 × 735 original, trimmed to its own
ink box (414 × 727) so the frame is the drawing; 9.8K as a palette PNG.
**The width is the SMALLER of the measure's leftover and a 168px cap**, and
both halves are derived. The prose caps at 690.3 and the pull quote at
711.5, so `calc(100% - 734px)` is whatever lies past the wider of the
two — exactly **190 at 1440**, where the column is 924. Bottom-aligned, so
it ends on the quote's last line; the section has no bottom padding, so
`bottom: 0` is that line.
**THE CAP EXISTS BECAUSE THE LEFTOVER PUT THE HANDLE ABOVE THE HEADING.**
Jack: *"make the clipart utensil slightly smaller because on mac it goes
just slightly too high."* This note used to call that a floor and leave it:
with the opening sentence out the section is **344 tall in English**, the
drawing was a fixed 333.5, and it is bottom-anchored — so its top sat
10.5px under the section's edge and **35.9px ABOVE the top of the word
"problem"**, up against the rule that divides the sections. The frame is
trimmed to the drawing's own ink box, so that top edge IS the tip of the
handle. Nothing collided, and it still read as the section starting too
high, which is the half the arithmetic could not see.
**The number is the room rather than a guess**: 344 less the heading's
46.4px cap offset leaves 297.6 of height, which at 380 × 667 is **169.5 of
width**, and 168 takes it with 2px of slack. Measured in all four languages
at 1366, 1440 and 1512: **168 × 294.9**, 0.0 at the bottom, and the top
lands **2.7px below the heading in English and 5.7 in Japanese** — the two
languages that set this section at its shortest. Spanish (371.7) and
Italian (399.5) were never the problem and now sit 30.4 and 58.2 clear.
**WHICH OF THE TWO BINDS IS A BAND, because the column is widest in the
MIDDLE of the range rather than at the end of it**: 840 at 1280, 924 at
1440, then back down through 916.8 at 1512, 908 at 1600, 895.2 at 1728 and
876 at 1920. So the cap governs from about 1330 to about 1660 and the
leftover governs outside it — 106 at 1280, 142 at 1920 — and the drawing is
never bigger than the 168 it draws at 1440.
**IT IS INSET 26 FROM THE RIGHT, NOT FLUSH TO IT**, on *"move the utensil
clip art in The problem section slightly more to the left"*. 26 is the
gap this page repeats — the pull quote's own top margin — rather than a
number of its own.
**WHAT THAT SPENDS IS BOX, NOT INK, and that is the only reason there was
room for it.** Flush, the box left 22.5px of air in front of the quote's
BOX, which is the number the width above is derived from — but the
drawing runs diagonally, handle top-left and drip bottom-right, so its
alpha starts at **65% of the frame's width across the bottom quarter**
where the quote sits, and reaches the frame's left edge only up at the
top where the prose lines are shorter. Scanning the mask row by row
against every line box in the section, the tightest ink-to-ink gap at
1440 was **Spanish at 53.3px** — the handle's tip beside a prose line
ending at 680.7 — against 100.5 in English, 113.6 in Italian and 152 in
Japanese. The inset spends 26 of that 53.3 and leaves **27.3 in the
binding language**; at 1280, where the drawing is 106 wide, it leaves
36.7. So the box now overlaps the quote's by 3.5px and nothing drawn in
it comes near anything set in the column.
**Re-run that scan, not the box arithmetic, before moving it again** —
the box arithmetic says there are 22.5px to play with and the drawing
says there are 53.3, and the second one is what you can see. Re-run after
the opening sentence came out, the worst gap is **82.2 (es), 87.6 (it),
92.3 (en) and 126 (ja)**: the line that was binding at 53.3 was that
paragraph, the only full-measure prose in the section, so losing it bought
the drawing 29px of clearance in the language that had the least.
Re-run again at the 168 cap, the worst is **Italian at 91.1**, with Spanish
93.2, English 107.0 and Japanese 129.5 — the right edge is pinned at 26, so
shrinking the frame can only move the drawing away from the type, and which
language binds changes because a shorter frame puts different mask rows
beside different lines.
**AND IT IS DESKTOP-ONLY, which is honest rather than lazy.** At 1280 the
column is 840 and the drawing 106 wide; a step narrower and it is a speck,
and at 1101 the prose takes the whole column and there is no margin left
to draw in. Decoration that would have to shrink past reading belongs off
the page — the same call the hero field makes when it thins on a phone.
Gated at **1280**, a breakpoint the page already uses.
**Decorative, so `aria-hidden` and no alt text**: it restates the
Dripping item beside it, and a screen reader saying "spatula with a drip"
there is the list read twice. It is the LAST child of the section for the
same reason `.chaos-work-cover` is the last child of `#work` — absolutely
positioned, so where it sits in the markup costs the layout nothing and
buys a parser the content first.

**THE "HOW MIGHT WE" LINE CARRIES A COLON**, on Jack wanting to see how it
looks: *"How might we: create a stable, adjustable place to rest utensils
directly above the pot…"* The colon turns a long single question into a
label and its answer, which is how the phrase is used in a workshop.
**Spanish and Italian take it and Japanese does not**, and that is
grammar rather than an oversight: both Romance versions put the
interrogative first, so the colon lands in the same place; Japanese puts
it last — 「…つくるには、どうすればよいか。」 — so there is no "how might
we" at the front to punctuate, and a colon dropped into the middle would
be a mistake rather than a device.

**PROCESS IS FOUR CARDS IN A 2×2.** Jack, with a mock-up: *"turn the process
part into some cards like this to make them a bit more condensed and
scannable."* It was four numbered paragraphs carrying up to two photographs
apiece — the tallest thing on the page, spent on the part a reader scans
rather than reads.
**ONE ROW OF FOUR WAS THE FIRST ANSWER AND IT WENT TOO FAR**, which is the
reusable part: *"I feel they are too small, and we took away some good text.
maybe make them 2x2 cards instead of one row of 4."* At four across the
photographs were **215px wide** and a card could only carry a caption. At two
across they are **442px** — more than four times the area — and each card
carries its own sentences again. **Condensing by making it a grid is not the
same as condensing by cutting**, and only one of the two was wanted.
**The prose on the cards is the original text, recovered from the commit
rather than retyped**, minus the bold title each sentence used to open with,
because the caption is that title now. The condensed section intro that
stood in for it while the cards were captions-only went with the change: with
every card carrying its own prose, a paragraph summarising all four says the
same things twice, which is the thing the brief names. It also means the
markup fallback is never in the one position it must not be in — saying
something the panel does not.

**THE FOUR CARDS WERE REWRITTEN ON 2026-11-23, AND THE SPLIT IS THE PART
THAT MATTERS.** Jack handed over all four in his own words: *01 Sketches
and paper profiles*, *02 Sculpting*, *03 Finishing*, *04 Digital model*.
Three are tighter versions of what was there. The change is that the old
card 2, "Foam model, spray-finished", was **one card doing two steps** —
carving and finishing — and it is now two, which is also what gives the old
card 4 somewhere to go: *"Renders / Every render comes from the digital
model"* was four words restating card 3, and card 4 is now the model
itself, scanned, rebuilt and driving the turntable, which is the one claim
on the page a reader can check by dragging it.
**THE WORDING MOVED THE PHOTOGRAPHS, and that is what a card changing
subject costs rather than scope creep** — with the words alone, "03
Finishing" would have sat over a Blender screenshot.
- **Card 3 needed a picture of the coats going on, and nothing already on
  the page could stand in.** `cs-painted` is the finished piece and The
  design shows it beside the turntable; `cs-booth` is **the same frame at a
  wider crop**, so either would have put one photograph on the page twice.
  What went in is `cs-finishing`, the old masonry wall's `06-finishing` —
  the primed clip in a gloved hand, the only photograph of the finishing
  itself — re-exported from its `-full` at **1000 × 1250, jpeg q82 / webp
  q85 at 44.2 and 43.5 dB** against a q98 reference. **Centre-cropped
  1333 × 2000 → 1333 × 1666 so it is 4:5 like the foam shot beside it**:
  measured, both draw **558.5px** of image at 1440, so the two physical
  stages are the same frame shape and read as one pair. What the crop costs
  is an unrelated architecture model at the top of the frame.
- **Card 4 took BOTH digital pictures** rather than losing one: the Blender
  mesh is the rebuild the sentence describes and the render is what that
  mesh produces. Two landscapes stacked, the shape card 1 already carries.
**Measured at 1440 after the move**: 647.6 / 623.6 across the first row and
647.9 / 690.5 across the second, so the grid reads as a 2×2 for the first
time — row 2 used to be **half the height of row 1**, 366 against 672.
Process is **1038 → 1378** tall in English, which is what a fourth
photograph and a step that previously had none actually cost. Checked in
all four languages, and at 390 where it is one column.
**`sips` is a trap for this.** It can centre-crop and resample, but it
**silently ignores `--cropOffset`** (the crop simply does not happen, and
the file comes back at its original size) and it **cannot write webp**
although `sips --formats` lists it. A `-z H W` after a failed crop then
squashes the photograph to the target box instead of scaling it. The webp
came from `sharp` installed in the scratchpad, per the rule below that it
must never become a project dependency.

**THEN THE WHOLE SET WAS LEVELLED TO ONE FRAME, AND THAT IS WHERE IT
STANDS.** Jack, looking at the cards: *"I want them to all end up being the
same ratio as the … Blender photo of the product, of me modeling it … I
want them all to be that same ratio and size."* So every step is now **ONE
photograph at 1200 × 767**, ratio 1.5645, and the 2×2 holds four identical
frames — measured **448 × 288.5 apiece at 1440 in all four languages**, and
351 × 226.5 at 390 where it is one column. Card heights then vary only by
how many lines the sentence takes, 353.6 to 402.2.
**1200 IS THE FOAM'S CEILING, and that is what picked the number.**
`cs-foam.jpg` is 1200 × 1500 and its camera original is not on this machine
— the old wall's `05-foam-full` is the SPRAY BOOTH, not the foam, so that
name lies — which makes 1200 the widest a landscape crop of it can be
without upscaling. The Blender capture came DOWN from 1400 × 895 to match:
a 14% downscale of a screenshot costs nothing, where upscaling the one
photograph that cannot be re-exported would have softened it. **Pick the
common size from the weakest source, not from the best one.**
**What each frame is now.** The profiles are the rotated source almost
whole — 2000 × 1333 after the 90°, cropped to 2000 × 1278, which drops 4%
of the height — where the old 1400 × 596 was a tight strip of it, cut to
make a two-photograph card add up. The foam is a 1200 × 767 window of its
own export at top 500, which keeps the hand and the offcut on the bench.
`cs-finished` is Jack's own `newnumber3.jpeg` (3024 × 4032, shot 13
October, the same session as the first coats), cropped 1900 × 1215 at
522,1429 so the clip reads at card size.
**The sketch spread and the gold render are OUT**, both on his word.
`cs-sketch-page.jpg` and `cs-render.jpg` stay in `assets/` unreferenced,
like `cs-booth` and `cs-hero-clip`, and `cs-finishing` — the finishing
photograph that stood in card 3 for one commit — was deleted outright,
since it had never been on the live site. Their alt keys came OUT of
`i18n.js` rather than being left to read as dead.

**ONE PHOTOGRAPH PER CARD IS THE RULE AND THERE ARE NO EXCEPTIONS LEFT,
BUT IT TOOK THREE GOES TO GET THERE.** Step 2 first kept two — the foam and the spray booth — and
two stacked PORTRAITS in a 215px column made that card **688px tall against
175** for the other three, so the booth shot came out (still in `assets/`,
alt text in the restore note). Card 1 carries two and it is fine, because
they were two LANDSCAPES, which is what made that card legal where two
portraits were not: **the shape of the photograph decided it, not the
count.** Both pairs went when the set was levelled above, so nothing on
this grid carries two any more.
**AND CARD 1'S PAIR WAS CROPPED TO ADD UP TO THE ONE BESIDE IT** — the
pair is gone, but the arithmetic is the worked example for matching a
stack to its neighbour, so it stays. Jack:
*"crop the heights of the Card 1 photos so that they are the same height as
the photo next to it."* Card 2 is a single 4:5 portrait, 551px of image at a
441px column, so with a 12px gap and two 3px borders a side the pair owes
**533 between them — 345 for the sketch spread and 188 for the paper
profiles**. Those two numbers are the aspect ratios the files carry:
**1400×1096 is 1.277:1 and 1400×596 is 2.349:1**. Measured, the stack lands
within **7px of card 2 at every width from 320 to 1440**, because both sides
scale with the column and only the 12px gap does not.
**Re-cropped from the ORIGINALS, not from the exports** — the files in
`assets/` are already one downscale deep and cropping those resamples them
twice.
**What each crop took.** The profiles lost height and nothing else: the
three paper pieces occupy the middle 48% of that frame and the rest is
cutting mat.
**AND THE PENCIL ON THEM WAS DARKENED**, because it could not be read at
442px: *"I feel like you cant see the drawing very easily, can you edit it a
little bit to make the pencil marks more dark?"* Measured in the big card,
the graphite sat at **223 against paper at 237 — a 14-level gap**. The edit
is a levels stretch of 195–248 on LUMINANCE, applied as a per-channel
multiplier so hue is preserved exactly (a per-channel stretch pulled the
card's warmth around), and it takes that gap to **61**.
**The mask is built from a BLURRED copy, and that is the whole trick.** Keyed
off each pixel's own value, a dark stroke surrounded by paper scores LOW and
gets excluded — the exact pixels the edit is for. Blurred at sigma 16, a
stroke inherits the card's brightness and comes along, while the cutting mat
(median 91) stays out of it entirely.
**A 1.0 pre-blur, because grain is the expensive thing.** The stretch
multiplies the paper's grain along with the graphite: the first version came
out 377KB of jpeg against the 240KB it replaced. Softening before the
stretch and sharpening gently after lands at **220KB / 162KB webp — lighter
than the file it replaces** — and the drawing reads. Four combinations were
rendered and weighed.
**THE RECIPE ABOVE IS NOT WHAT THE LIVE FILE WAS CARRYING, and the refit
is the number to use.** When the profiles were re-cropped on 2026-11-23
the darkening had to be redone, and applying the documented 195–248
stretch gave a visibly greyer card than the one already on the site.
Measured inside the card mask, the approved export sat at **paper 232 with
stroke-against-paper contrast p95 26.0**; 195–248 lands paper 211 and p95
46.4. Fitted to the approved numbers instead: **a 130–250 stretch plus a
1.4 sharpen**, which gives paper 232 and p95 26.9.
**Measure the STROKES, not the percentiles.** A paper-median and a 1st
percentile can both match while the pencil reads half as dark, because the
dark tail is card edges and shadows rather than graphite. The metric that
decides it is each pixel against its own local paper level (a sigma-4
blur), inside a sigma-14 mask that keeps the cards and drops the mat.
**And the sharpen is MASKED to the cards.** Sharpening the cutting mat's
dot texture is pure file size: confining it took the webp from 220K to
**152K**, under the 162K the old file shipped, at the same stroke contrast.
**It is a reproduction adjustment, not a retouch.** Nothing is added or
moved; the contrast that the camera lost on light graphite is put back. If
an edit would ever change what the photograph SHOWS, it does not belong in
a portfolio of real work. The sketch spread came in on every side, *"so it looks more
zoomed in and we just see the paper"* — to just inside the notebook page,
which drops the dark desk it was lying on and keeps the title and both
handwritten questions. **The bottom question sits close to the edge**, so
the window is slid 1% of the frame down from centre; take any more height
off the bottom and it goes.
**Cropping to even a row up is still wrong as a general move** — a square or
4:3 TILE takes 25–44% off the WIDTH of a 1400×788 source, and on the
paper-profiles shot that is the outer two profiles. What is fine here is
cropping each photograph to a chosen ratio in the direction it has room.
The number is a CSS counter (`decimal-leading-zero`), not part of the
string: it cannot drift from the order and there is nothing to translate
four times. **It carries no `font-weight`**, and it did for one commit —
the house bug in miniature, since the caption is Archivo Black, which ships
one face at 400, so a 700 there was synthetic bold on two digits. For the
same reason `.cs-step-cap` joins the Japanese 900 list (its content IS
Japanese) while `.cs-step-cap::before` is pinned back to 400 inside it.
The grid is **2 columns down to 700, then 1** — measured, the photographs
run 322–498px wide at every width from 320 to 1440.
**The one portrait needed a specificity fix, not a source-order one.**
`.cs-figs-1 .cs-fig.is-portrait` caps a lone portrait at 400px and sits
later in the file, so an equal-weight override lost and the foam shot drew
394px inside a 448px card — narrower than the card holding it, which reads
as a mistake rather than a choice.

**The dimensioned notebook page moved to "The design"** when the cards
arrived, and then **came out of the page entirely**. Jack: *"right above the
Process area there is a photo of paper, can we take that out?"* He is right
about what it was doing. The section already ends on a 3D object you can
turn, which is the most complete answer to "what is it" this page has, and a
drawing of the same object underneath is a second answer to a question
already answered — sitting directly above a process card that is itself a
photograph of a notebook page. The files stay in `assets/`;
`proj.pot-clip.alt.4` and the rest are in the restore note.

**TWO SECTIONS PUT THEIR PHOTOGRAPH BESIDE THEIR PROSE**, off an `aside`
flag and `.cs-split`. Jack: *"move the alessi photo to the right of the research
text to help that section visually."* That section is four definition pairs,
so it is the tallest column of plain text on the page, and the storefront
was a portrait sitting under all of it doing nothing for the shape. The
sketch spread that used to sit next to it went down to process card 1,
which is both where sketching belongs in the story and what evens that row
up. **The closing line went too** — *"I explored five directions, from an
S-hook to an egg cup…"* — so the section now ends on the notes themselves.
**AND IT ENDS WHERE THE NOTES END**, off a second flag, `asideEnd`. Jack:
*"move the alessi store photo up so that the bottom of it hits the bottom
of the last line in that section, then we can move the sections under that
up a little bit so the transition to the next section looks good."* Both
halves are one change: side by side the row was as tall as the PICTURE —
600px against 566 of notes — so the section ended on 34px of photograph
with nothing beside it, and everything below sat that much lower.
**The figure goes out of flow** (absolute, placed by `grid-column` /
`grid-row` so the 340 is still stated once), which is what lets the row be
the prose's height; `top: 0` and `bottom: 0` then make the photograph
exactly that tall. **Scaled, never cropped** — the whole shopfront is still
there, a few per cent smaller.
**SCALED AND NOT LIFTED, BECAUSE LIFTING BROKE IN JAPANESE.** The first
version left the picture at its natural 600 and pinned only the bottom,
which is right in English (it rises 34px into a 46px gap under the heading)
and wrong in Japanese: CJK sets the same notes in **515px**, so it rose 84
and its top edge came out **21px above the heading**, over the rule between
the sections. A fixed ratio cannot bottom out on four different column
heights. Scaled, all four land at 0.0 top and 0.0 bottom; what varies is
width — 335 in Spanish, 321 in English, 293 in Japanese — so the figure is
pinned RIGHT and the gutter takes the difference.
**`align-self: end` cannot do this**, which is worth knowing before trying
it: a grid row is as tall as its tallest item, so bottom-aligning inside it
is a no-op while the picture *is* the tallest.
**AND STACKING IT NEEDS THE PLACEMENT UNDONE, not just the position.**
`position: static` alone leaves `grid-column: 2` in force, so the figure
asked for a second column of a one-column grid and the browser made an
implicit one: measured, `grid-template-columns: 1fr` computed as
"320px 400px" at 800, and at 390 the notes came out **120px wide**. This is
the second time in two commits that a grid has failed to stack because of
something other than the template — the stage pair's fixed 340px track was
the first.
**It is a flag and not a rule on `.cs-split`**: Testing's photograph is 65px
TALLER than its prose, so the same treatment there would slide it into the
title.
**The last definition's trailing 18px went too.** With it the picture
bottomed out on the prose BLOCK and sat 20.6px under the last descender,
where the ask was the last line. A trailing margin on the last item in a
list is spacing before nothing, and the section's own padding is the gap.
Research is **711 → 654** across the two changes.

**RESEARCH OPENS ON THE STORE NOW, NOT ON JACK'S OWN KITCHEN.** Jack:
*"move 'User observation' to the 3rd point, it is currently the first.
That would make 'In-store market research' the first."* So the four notes
run In-store market research, Product and catalog review, User
observation, Competitor review. The outside research comes first and the
personal note sits inside it, which is also the order the write-up tells
the story in. **It is one string per language**: the notes are a `<dl>`
inside `proj.pot-clip.cs.research.grid`, so re-ordering is moving a
`<dt>`/`<dd>` pair in four places and touches no key, no renderer and no
alt text. It costs no height — measured, Research is 653.6 at 1440 before
and after, and the storefront still lands 0.00 top and 0.00 bottom.
**And the observation itself says "where messes originated"** where it
said "where drips landed" — his wording. It is five characters longer,
which is enough to add a line at 901 in English (prose 597.8 → 622.9), so
the photograph's `max-height` cap fires there and it ends 23.07px above
the last line instead of on it. **That is the documented cap doing its
job** — Spanish has always done this at 901 — not a new fault, but it is
the one measurable cost of the longer phrase.

**THE WIDOW IN THAT NOTE IS FIXED IN THE STRING, AND text-wrap: pretty IS
NOT THE ANSWER HERE.** Jack: *"don't let there be a text widow there."*
In English the item ended on a **70px fourth line** ("of space.") under
three full ones at 1440 and 1512, and the same at 901 and 390.
**The rule this file has twice recommended does nothing on this
paragraph.** `text-wrap: pretty` was applied to `.cs-defs dd` first and
measured at 1512, 1440, 1280, 1200, 1100, 901 and 390: the line arrays
come back **identical with it on and off**, in a browser where the
computed value really is `pretty` (Chrome 156) and where the same
property demonstrably moves the eyebrow's break one commit earlier.
Chrome re-breaks only the last few lines and only when its own score
improves; pulling "lack" down off a 530px line to rescue a 70px one does
not qualify. **So the declaration came back out** — a rule that measures
identical to no rule is dead CSS, whatever its intent.
`balance` does work and is wrong: at 901 it evens the item into five
326–328px lines in a 435px column, which is the summary-card failure one
layer down.
**The glue is a non-breaking space, written as a `\u00A0` escape so it
is visible in the source.** English binds "around the lack of space."
(192.3), Spanish "sorteaba la falta de espacio." (215.6, which also fixes
an 86.6px tail it had at 1100) and Italian "la mancanza di spazio."
(237.9, for a 70.9px tail at 1512). **Glue the WHOLE tail including the
last word** — the first attempt left a plain space before "space." and at
901 the browser simply broke there instead, for a 49.7px last line, which
is worse than what it replaced.
Measured last lines across 1512 / 1440 / 1280 / 1200 / 1100 / 901 / 390,
the three Latin languages now run 169–474px and the glue is **inert at
every width that never had a widow**. Japanese is left alone: it sets
without word spaces, so there is no two-word unit to bind, and its short
last lines (109.8 at 1280 and 390) are a different thing from a widow.
**The other three notes still have short last lines at some widths** —
47.9 and 55.3 in English at 1280, for instance. They are not glued,
because that is the residue of fixed strings in a fluid column and he
asked about this one.

**AND TESTING TOOK THE SAME FLAG.** Jack: *"adjust the photo so it is in
line well and not unnecessarily under the text to the left of it."* It was
342×321 beside 256 of prose, hanging 65px below the argument it
illustrates; scaled to the text it came to 271×256 in English, and 0.0 top
and 0.0 bottom in all four languages.

**THEN TESTING TOOK `asideTop` AS WELL, AND IT IS THE ONLY SECTION THAT
HAS.** Jack: *"uncrop the top enough so that it hits the top of the word
testing and the bottom still hits the bottom of the last sentence."*
Matched to the prose alone the picture started **63px below the heading**,
so the two columns began on different lines and the band read as text with
a thumbnail beside it rather than as two columns.
**The heading moves INSIDE `.cs-split` for it**, so the figure can span two
grid rows and reach the top of the word. A negative `top` on the figure was
the other way and it is the lifted-photograph bug one layer up: the number
would be `.cs-h`'s height plus its 26px margin, which is a clamp of the
viewport *and* deeper in Japanese, so one value would be a near miss in at
least one language. Two rows is no value at all — the rows measure
themselves. Measured **0.00 top and 0.00 bottom in all four languages at
1440, 1100 and 901.**
**Both placements are explicit, and that is not belt and braces**: with the
heading pinned at 1/1, auto-placement's next free cell is row 1 *column 2*,
so the prose would land in the photograph's track.
**AND THE TWO-ROW SPAN HAS TO BE UNDONE AT ITS OWN WEIGHT WHEN IT STACKS.**
`.cs-split-end .cs-figs { grid-row: auto }` in the ≤900 block is 0-2-0 and
the span is 0-3-0, so the reset lost and the figure was placed back over
the heading and the prose in the only column there is — measured at 390 it
came out **6×6, its two borders and nothing between them.** The same shape
as the `grid-column` bug that rule already exists for, one specificity step
up, and the **fifth** time this file has had to say that specificity beats
source order.
**RESEARCH DELIBERATELY DOES NOT TAKE IT**, and the reason is arithmetic:
its notes are 548–573 tall, so the span would be 611–636, and at 901 that
asks for a ratio of 0.53 where the storefront is 0.5625. The cap would fire
and the bottom would stop landing on the last line — the one thing Jack
asked that photograph for.
**THE SCALED FIGURE NEEDED A CAP, AND IT WAS ALREADY OVERFLOWING WITHOUT
ONE.** Sized by height, a picture's width is its height times its ratio,
and nothing stopped that exceeding the 340px track. Measured at 901 in
Spanish, Research's 623px of notes asked for a **350px photograph in a
340px column** — shipped that way in `96c1e4f` and found by measuring the
next change rather than by looking. Testing's asked for 360.
**`max-width: 100%` does not fix it**, which is the part worth keeping:
clamping the width leaves the height alone, so the picture overflows
instead of shrinking. Measured, 350.3px with the clamp on.
**The height is the axis to cap**, and the cap is arithmetic: the image may
be the column less the frame's two borders, so the figure may be that over
the ratio, plus the borders back. The ratio comes from the entry's own `w`
and `h` in `projectData`, handed to CSS as `--fig-ar` by `fig()` — the one
number the stylesheet cannot work out for itself. Clamped, the picture is
shorter than the prose rather than wider than its column.
**And `max-height` has to be released when the layout stacks**, the same
lesson as `grid-column` one commit earlier: below 900 there is no 340px
column, and the cap left on held the research photograph to 600px at a
width that wanted 624 — a 4% squash, which is worse than the overflow it
was written to prevent. **Undo everything the rule set, not just the part
that names the layout.**

**The photograph is `cs-storefront`, and the new filename is the point.**
It is a different, taller frame of the same shopfront (9:16 as shot, against
the old 4:5). `vercel.json` gives
everything under `/assets/` an hour of freshness and a **week** of
stale-while-revalidate, so replacing a photograph in place shows returning
visitors the old one for up to a week. For a re-crop that is a shrug; for a
different picture it is wrong, so it got its own path and `cs-store.*` was
deleted.
**AND THE SAME IS TRUE OF A RE-CROP — THAT CARVE-OUT WAS WRONG AND COST A
ROUND.** The reasoning was that "a stale crop is briefly a slightly
different crop, and it heals itself". Jack, after pushing: *"They look good
on the photos in here but on the website it doesn't look changed even when
I pushed it."*
**Measured against the live site: the origin was right the whole time** —
`cs-profiles.jpg` served 1400×596 and `cs-sketches.jpg` 1400×1096, byte for
byte what was committed. What he was looking at was his own browser, holding
the previous files under `max-age=3600, stale-while-revalidate=604800`: one
hour of not even asking, then a week in which the stale copy is served
INSTANTLY while the new one is fetched in the background — so the first
visit after the hour still shows the old picture.
**Two things make that worse than "briefly different" here.** The crops
existed to make card 1 add up to card 2's height, so with the old bytes the
feature is simply absent rather than approximate. And `.cs-fig img` is
`height: auto`, so the moment the old file decodes, ITS ratio wins over the
`width`/`height` attributes — the layout silently reverts to the old
heights instead of showing a distorted picture, which is why it reads as
"nothing changed" rather than as a bug.
**SO THE CASE-STUDY ASSETS CARRY A `?v=` CONTENT HASH NOW**, the thing the
mesh has always had. It was renames first — `cs-profiles` →
`cs-paper-profiles`, `cs-sketches` → `cs-sketch-page`, `cs-hero` →
`cs-hero-bowl` → `cs-hero-clip` — which works, costs no code, and costs a
new filename every time a crop is tuned. Four re-exports in four turns is
where that stops being cheap: the next one had no honest name left, only
`-v2`.
**`node tools/asset-rev.js` writes the hashes and the pre-commit hook runs
it**, so changing the bytes updates the URL on its own — the same shape as
`write-fallback.js`, and for the same reason. *A hash somebody has to
remember to update is a hash that will be wrong*, which is the line the
model's own note has carried from the start.
**It is opt-in by marker**: it only touches paths that ALREADY carry a
`?v=`, so enrolling a path is adding one and nothing sweeps through the
other ~90 assets. `?v=0` is the way in — stale by definition, so the first
run fills it. **`.jmm` is skipped**, because `model-check.js` owns the
mesh's hash and two tools writing the same characters is how they drift.
**`mediaTag` had to become query-aware**, and this is the part that would
have failed silently: the webp path came from `src.replace(/\.jpg$/, …)`,
anchored at the end of the string, so `x.jpg?v=ab12cd34` did not match and
the `<source>` would have offered a JPEG labelled `image/webp` — which a
browser accepts and then cannot decode. Both that and the `endsWith('.jpg')`
test go through one helper now, unit-tested on four forms including
`/a/jpg.dir/c.jpg`.
**`audit.js` runs `asset-rev --check`** as belt and braces, because a hook
only runs where `core.hooksPath` is set and that is local config which does
not survive a clone. Made to fail before being trusted.
**`audit.js` now checks that every `/assets/` path in `projectData` resolves
to a file and that each jpg has its webp sibling** — 91 paths — because a
rename done halfway is otherwise silent, and `<picture>` falls back on an
undecodable TYPE, never on a 404. Both halves were made to fail before being
trusted. It strips comments first, since SECTION 03's own header documents
the entry shapes with `/assets/projects/x/01.jpg` as an example.
**A flag, not a rule**: it only pays where the prose is tall enough to stand
a column beside it. Under a short paragraph the same photograph is a small
picture in a wide gap.
**TESTING IS THE SECOND, AND IT COST A CROP RATHER THAN ANY CODE.** Jack:
*"move the current photo under it to the right of the text, but you may have
to crop the height because it is quite tall."* The rim shot shipped as the
full 9:16 phone frame, 1000×1778, and the object only occupies the middle of
it — so under the prose it drew a screenful of photograph at the end of a
three-point argument. Re-cropped near-square from the original — a
2613×2465 window at 600,2631 — it drew 340×321 against 256 of English
prose, and the section went **835px tall to 556**.
**THEN A QUARTER OF THAT TOP WENT BACK ON**, when `asideTop` asked the
picture to start at the heading. Spanning heading to last line wants
319–394px of figure depending on the language and the width, and at 1.06
that is 338–418 wide in a 340 column — so the cap would fire and the bottom
would not land. **The window grew upward and only upward: 2613×3070 at
600,2026.** Same bottom edge, same sides, 591px more wall above the bowl,
which is what "uncrop the top" means in the source rather than in the
layout.
**0.851 is the ceiling less 4px.** The binding case is the narrowest
two-column width, 901, in the longest language: the prose is 435 wide
there, so the span is 394px and the figure may be 334 of image plus its two
3px borders — 334/388 = **0.861**. 0.851 exports as **1000×1175** and draws
273 wide in English at 1440 against 271 before, so the picture is the width
it already was and 63px taller. Measured, the cap never fires between 901
and 1440 in any of the four: widths run 223–336 against the 340 track.
**THE OBJECT IS LOW IN THE FRAME NOW AND THAT IS NOT AN OVERSIGHT** —
837px of wall above it and 246 below. Its own bounding box is 2244×2001,
aspect 1.12, so there was never room to balance this crop and keep the
subject big; the air goes where the layout needed it. The file is 64KB
jpeg / 36KB webp at 45.0 and 43.6 dB PSNR — 25% more pixels for 9% more
bytes, because most of what was added is a smooth grey wall.
**THE COPY IS METHOD / FINDING / IMPLICATION**, in Jack's words, replacing a
two-item list headed "Fit testing" and "Product photography" — which named
what he DID twice and what he LEARNED nowhere. The rim is the finding and
the next section opens on rim fit, so the implication is the hinge between
them. It is a `<ul>` with `<strong>` leads, the same shape as The problem,
because three labelled sentences in a 548px column is exactly what that
pattern is for.
**It left one thing doubled and the duplicate has since gone.** The second
stat read "held utensils securely through a full product shoot" about 100px
from a finding ending "including through a full product shoot" — recorded
here as the closest this page came to the brief's "unnecessary
descriptions", and left as Jack's to cut. He cut it on 2026-11-22 with the
rest of the Testing figures, so the finding is now the only place the shoot
is mentioned.
**The photo column is a fixed 340px, not a fraction**, because it is the
supporting half and should not widen with the viewport at the expense of the
text it supports. **It stacks at 900, and 760 was wrong**: measured across
the range the prose gets 548px at 1440, 614 at 1100, 435 at 901 — and 344 at
800, which is the column of five-word lines the stacking exists to prevent.
900 because the page already uses it; the honest threshold is about 907, and
18px of measure does not earn a twelfth breakpoint.
**Stacking has to turn the lone-portrait cap back ON.** Side by side the
340px column is its own limit so the cap is off; stacked, the column is the
whole measure and 810px of storefront draws 1012px tall. Both rules are
stated at 0-4-0 rather than left to source order — the same specificity trap
that drew the foam shot 394px wide inside a 448px card.

**The photographs are the new `Final Alessi Flow` set**, exported as
`cs-*.jpg` + `.webp`, plus two survivors of the old wall:
`04-measurements` (the dimensioned notebook page, the one that arrived on
its side) and `14-object` (the silver render, which is now only the
turntable's poster). **`cs-render` is cropped, and had to be**: the source
Jack asked for is a screenshot of the `<model-viewer>` editor, and the right
third of it is a code snippet, a File Manager and a Download Scene button —
tooling rather than work, and a thing this codebase pointedly does not use.
Centred on the render's own ink box (446–1661 × 570–1318 in a 2948×1578
source), 1800×1200 at source scale, margins 293/292 and 226/226.
**THE TITLE IS "POT CLIP", AND THE CARD NOW SAYS WHAT WAS DONE RATHER
THAN WHAT THE THING IS.** Jack: *"lets change the title just to Pot
Clip"*, and the card description to *"Designed, hand-sculpted, digitally
modeled, and tested."* The two are one move. POT CLIP UTENSIL REST put the
object's function in the headline, which the lede repeats one line below
it; and the card described the object beside a photograph of the object.
What the card carries instead is the process, which is what a portfolio
card is actually offering.
**It is set in caps like the other six, because the string IS the caps.**
No `text-transform` touches a project title — all seven are stored
uppercase — so "Pot Clip" would have made this the one mixed-case title in
a gallery of seven. That is the opposite call from the eyebrow below, and
the difference is that an eyebrow is a sentence and a title is a name.
**A title is FIVE files** (see *Routing*), and three of them carry it in
sentence case: the JSON-LD `name` and the llms.txt bullet are "Pot Clip",
which `audit.js` compares case-insensitively, and the markup fallback is
regenerated by the hook. Measured, the h2 draws **655.6 × 69.9 at 1440**
and sets on one line in all four languages.
**THE META TABLE READS Context / Duration / Role / Digital Tools**, the
first and the last on Jack's word. The context value is "Product Design
course, student project" where it was "Student project, NABA Milan" — the
school is in the eyebrow directly beneath it, so the row was saying it
twice and not saying what the brief was FOR. And "Tools" became "Digital
Tools" because the row lists Blender, Illustrator and Canva while the
project's other tools were a scalpel, dense foam and spray cans: the list
was accurate and the label was not.

**AND THE LEDE IS NOW THE CARD'S SENTENCE TOO**, on Jack asking for
"Two movable clips that sit on a pot rim and hold your spoon above the
pot" to become *"Designed, hand-sculpted, digitally modeled, and
tested."* **That finishes the move the title started.** The note above
records the old title putting the object's function in the headline
"which the lede repeats one line below it" — and the lede was repeating
something else as well: the Solution card, 150px further down, says
"Two clips that slide along the pot rim and hold the utensil above the
food, so drips fall back in", which is the same sentence with the
*why* attached. So the page opened by saying what the thing is three
times before saying anything else. It says it once now, on the card
that explains it, and the lede carries the process instead — the same
line the gallery card outside carries, so the card and the page it
opens agree word for word.
**It cost nothing below it and removed two widows.** Measured at 1440
against `git stash`: the lede is two lines in all four languages where
Spanish and Italian were **three, with a 39.7px and a 51.4px last
line**; the masthead is 746.1 tall before and after in every language
(the poster sets it, not the text); and the document height, the
problem section and every landmark below are identical. What moved is
the text column's foot — see the brief note below for the numbers.

**AND IT SETS ON ONE LINE NOW, WHICH TOOK DELETING ITS MEASURE CAP.**
Jack, looking at it on his own machine: *"the 'Designed, hand-sculpted,
digitally modeled, and tested.' in the pot clip page should stay in one
line."* It was folding at 1512 because `.cs-lede` carried
`max-width: 34ch` — 453.2px against the 562.8 the sentence needs — in a
column 651.6 wide. **A measure cap is for a PARAGRAPH**, to stop a block
of prose running past about 75 characters; this is one 55-character
sentence, so its own length IS the measure and the cap could only ever
fold it in half.
Uncapped, the masthead's text column binds, and it is wide enough at
every width where the masthead is two columns: 519.4 at 1101, 658.5 at
1387, 639.6 at 1728, against **Spanish, the longest of the four**, at
508.4 and 600.9 — so the slack is 11.0px at the narrow end and 38.7 at
the wide. Measured one line in all four languages at 1101, 1200 and
1512. On a phone it is two, where the measure is 345 and the sentence
wants 476, and that is unchanged: the stacked rule had already set the
cap to `none`, and it is gone now with the cap it was undoing.
**What this moves depends on which half of the masthead is taller, and
the page has both regimes.** At 1512 the poster binds, so every landmark
in all four languages is identical to the committed build to the pixel.
At 1101 the TEXT binds — the masthead is 605 there against 741.5 at
1512 — so losing a line takes 26.4px off the masthead and pulls
everything below it up by the same, in every language.

**THE EYEBROW IS A CREDIT LINE UNDER THE TITLE, NOT A LABEL OVER IT.**
Jack: *"move the red eyebrow to under the title and have it read as A
product concept for Alessi, NABA Milan 2026."* Over the title it said
"Product design · 2026" — a category and a year, which is the job the
gallery card's chip already does on the page that card opens. Under it,
naming the brief and the school, it answers what kind of thing this is and
who set it, which is the question a case study opens on.
**It is spaced like a caption now**: 14px above it and 36 below, where it
was one 18px gap. It belongs to the title, so the gap that attaches it is
the smaller one; 14 is `.cs-brief-t`'s gap to its own paragraph, the same
relationship, and 36 is the lede's own gap to the meta table, so the
rhythm below the title is one step repeated. One line in all four
languages at 1440, 1200 and 1101.
**IT IS SET IN SENTENCE CASE, WHICH IS THE SECOND EXCEPTION ON THE PAGE.**
It shipped in caps for one commit, on the reasoning that the string is
stored sentence-case and the uppercase belongs to the element, like every
other eyebrow. Jack: *"make the eyebrow sentence case like I wrote it."*
He is right, and the reason is the same one that took the caps off
`.contact-statement`: this is a **sentence**, not a category label, and 44
characters of tracked capitals under a 73.6px title is a second headline
shouting under the first.
**The 1.8px of tracking went with the caps**, and that is consequence
rather than tidying: tracking is there to open up uppercase Latin, where
every glyph is the same height and the counters need air. On lowercase it
reads as broken word spacing — the same reason nine classes reset their
tracking under `html[lang="ja"]`, one script along. `.cs-eyebrow` stays in
that Japanese list for its `line-break: strict` half, which still decides
where a Japanese sentence may break.
**So the page now has two kinds of small coral line and that is correct**:
the meta keys and the card headers are LABELS and stay tracked caps; this
one is a line of prose that happens to be small. Measured at the time,
the ink went from about 380px to **269.8** in English — one line in all
four languages at 1440 and 390, two in es/it/ja at 320, and no overflow
anywhere. Those numbers are superseded by the rewrite below.
**"Alessi" in it is not a client claim**: the disclaimer that says the
project is not affiliated is unchanged at the foot of the page, and the
title and the URL still carry no brand name, which is what the safety
constraint actually asks for.

**AND IT NAMES A STYLE RATHER THAN A CLIENT.** Jack: *"instead of 'A
product concept for Alessi, NABA Milan 2026', change it to 'A product
concept developed in Alessi's style, NABA Milan 2026'."* **It closes a
gap rather than opening one.** The write-up has always said the brief
was to design kitchenware *"in the spirit of Alessi"*, and until now the
one line on the page that named the brand said "for Alessi" — a
preposition a reader can take as a commission. The disclaimer, the title
and the URL are all unchanged; this is the opening line no longer
needing them.
It is 62 characters where it was 44, so the ink goes **269.8 → 368.6**
in English (431.2 es, 420 it, 383 ja) — still one line in all four
languages at 1101, 1200 and 1512, since the column is 519.4 even at its
narrowest. **It is two lines on a phone**, which is new, and costs 15.5px
of masthead at 390.
**And two lines is what put a widow in it.** English and Japanese both
broke with "2026" alone on a 29.5px second line — the widow Jack has
caught twice elsewhere — so `.cs-eyebrow` takes `text-wrap: pretty`,
the same answer `.cs-brief-b` uses, for the same reason a rule beats a
non-breaking space in four strings. Measured at 390: English becomes
"Milan 2026" (63.8), Spanish "NABA Milán 2026" (97.9), Italian
"Milano 2026" (71.1).
**JAPANESE OPTS OUT, AND THAT IS THE HALF WORTH READING.** Pretty fixes a
short last line by re-breaking the lines BEFORE it, and in a script that
may break between any two kana, "before it" includes the middle of a
word: at 390 it took the clean "NABAミラノ / 2026" and made it
"NABAミラ / ノ 2026", splitting ミラノ across the break. A split proper
noun is worse than four digits alone in a 12px credit line, so
`html[lang="ja"] .cs-eyebrow { text-wrap: wrap; }` takes the rule back
off for that one script — `wrap` and not `auto` because the shorthand
resets the style half, and because every engine that has `pretty` has
`wrap`. **Measure what a last-line rule does to Japanese before shipping
it**: it is a different failure there, not a smaller one.

**THE THREE SUMMARY CARDS ARE PROBLEM / SOLUTION / OUTCOME, AND THE
OUTCOME IS DELIVERABLES NOW.** Jack rewrote all three on 2026-11-22. The
first two got longer and more specific — the problem names the small
kitchen it happens in, the solution says what the clips do rather than
only where they sit — and the third stopped being results and became what
the project produced: *"A sculpted appearance model, an interactive 3D
model, and a three-poster campaign, with the core idea working on
thin-rimmed pots."* That last clause is the only claim in it, and it is
the one Testing's Finding supports word for word, so the card and the
section cannot drift apart.
**It read "proven" until 2026-11-23**, when Jack changed the one word,
and it is the more honest verb for exactly that reason: the Finding says
the rim *decided whether it works* and that on thin rims it held, which
is a thing working rather than a thing proved. One word and no reflow —
the cards measure 147.7 at 1512 and 171.3 at 1101 in English before and
after, and the other three languages are unchanged at both widths too. **The `~50%` left the page with it** — see the
Testing-figures note above for where the half still lives. The cards grew
from **126px to 150** in English at 1440 (measured by putting the old
strings back into the live nodes) and the three stay level with each
other in every language, because they are grid items in one row.

**THE BRIEF SITS IN THE MASTHEAD'S OWN COLUMN**, under the meta table.
Jack: *"move The brief box up to the empty space to the left of the hero
photo and above the problem, solution and outcome."* There was 318px of it
at 1440 — the left column ran out at the meta table while the poster
carried on — and the brief is the one block early enough to belong there
and short enough to fit. The 34px this line used to claim for the gap
between the two columns' feet has not been true for several commits —
measured at 1440 today it is **106.5 in English, 85.2 in Spanish and
Italian, 123.9 in Japanese**, and the poster is what sets the masthead's
height in every one of them, so the text column's foot floats. It moved
again when the lede came down to two lines in es/it (see the lede note
below); it is recorded rather than tuned, because nothing is aligned to
it. In the column the brief takes its 36px gap above instead of below,
since the masthead's own 56px is what separates it from the summary cards.
**AND IT CARRIES `text-wrap: pretty`.** Jack: *"in The brief section dont
let there be a hanging widow or whatever its called."* English broke "…on a store / **shelf.**" — one word
alone under two full lines, in the one block here set at display size on a
54ch measure, where a short last line shows most.
**A rule rather than a non-breaking space in the string**, because the
string exists four times and the break depends on the width as well as the
language: at 1440 the last line ran 1 word in English, 2 in Italian and 4
in Spanish, and a tie between two of those moves at the next clamp step.
Measured at 1440, 1200, 1101, 900, 600 and 390 in all three Latin
languages, every last line now carries **two words or more**, English
becomes "store shelf.", the other three are untouched, and the box is the
same 199.7px tall — so nothing below it moved. (Japanese is one run with no
word spaces and has no widow to fix.)
**NOT ON `.cs-prose`, deliberately.** Those columns' heights are
load-bearing now that two photographs are sized from them, and a last-line
rule that can add a line does not belong under a measurement unless it is
asked for. Where the property is unsupported the paragraph wraps exactly as
it does today, so there is nothing to fall back to.

**THE SUMMARY CARDS ARE SIZED SO THEIR LONGEST SENTENCE HOLDS TWO LINES,
AND THAT IS THE FIX FOR BOTH COMPLAINTS ABOUT THIS BLOCK.**
**First `balance`, which solved the widow and broke the shape.** Jack:
*"the solution box has a widow; fix it."* At 1320 the Solution card was
breaking to "…so drips fall / **back in.**", and `balance` evens the lines
within the line count, so it became three lines filling **73/66/65%** of
the box — no widow, and a narrow column of text inside a bordered card
with a quarter of it empty down the right. Jack again: *"the solution box
seems far off now with the text."* On unbordered prose nobody would see
it; **the border is what makes unused measure a visible shape.**
**The cause is 1.5%, not the wrap rule.** That sentence needs about 700px
of line. At 1440 the card gives it 2 × 361 and it sets in two full lines;
at 1320 it gives 2 × 345 and misses — so it spills into a third line that
is 2.15 lines' worth of content however it is distributed. Every wrap rule
is then only choosing where to put the same hole: `pretty` puts it all at
the end (a 17% stub), `balance` spreads it across every line.
**So the measure buys the 1.5% back**: `0.95rem` instead of `0.98` and
**14px** of side padding instead of 16, together about 5% more line.
Measured, the Solution card sets two full lines at **98/101%** at 1320
where it was 73/66/65, and 1440 is unchanged and still full. The 14 also
puts the body on the same left edge as `.cs-card-t` above it, which had
been **2px out** since the cards were built.
**`pretty` underneath**, because with the text fitting again the only job
left is the tail. **Between about 1150 and 1280 the sentence still lands
just over two lines and the third is a stub** — that band is the honest
residue of a fixed string in a fluid column, and the only answer there
would be a breakpoint for something nobody can name. The brief keeps
`pretty` for its own reason: one wide paragraph at display size where only
the last line was ever wrong.
**AND IT CARRIES THE CARDS' OWN 3px `--black` FRAME, WHICH ONLY SHOWS IN
DARK.** Jack: *"on dark mode, the outline on the box for The brief
disappears or blends in."* He is reading the tokens exactly right —
`--ink` is `#111117` in dark and so is `--white`, so the slab and the
ground are **literally the same colour** and the box had nothing but its
coral title to say where it began. That sameness is deliberate everywhere
else; it is what keeps the loader, the about slab and the footer part of
the page rather than panels on it. But those three are full-bleed bands,
and this is a box in a column with a shape to lose.
**One declaration, no theme override.** `--black` flips, and in LIGHT it
is `#1A1A18` — the same value as `--ink` — so the frame is invisible there
and the box is exactly what it already was, while dark gets the off-white
rule (16.9:1) that the three summary cards directly below it already
wear. Same shape as the about panel's `--white` sliver: **the theme that
needs nothing sees nothing.** It also makes the brief and the cards read
as one family instead of a band and three cards.
It costs 6px of measure, since `box-sizing` is `border-box`. Re-measured
after: the paragraph still sets three lines in en/es/it and two in ja at
1440, still carries no widow, and the box is 205.7px against 199.7.

**THE POSTER STARTS AT THE TOP OF THE TITLE TEXT**, and is 4.4% smaller
than it began. The size came off the grid (1.15fr / 1fr to **1.25fr /
1fr**, 548.8 to 524.4) on *"maybe make the tiniest bit smaller"*, rather
than from a cap on the figure, because a cap would leave slack in the
media column and the poster's right edge has to stay on the measure. The
24px goes to the text column, which now carries the brief.
**It was level with the BACK TO WORK button first**, lifted out of the
masthead by that button's own 45.5px plus its 36px margin — and that was
right while the eyebrow sat above the title, because the title was not
the top of its column. With the eyebrow moved under it, the title IS the
column, the two columns begin together, and the lift is gone.
**What is left is the ink offset, and it is the whole rule.** The figure's
top edge is a hard border; the title's is the top of a capital letter,
which sits BELOW its line box — `line-height: 0.95` is tighter than the
font, so the content area overhangs by half the difference, and the cap
sits lower again by the gap between the font's ascent and the actual
ascent of these glyphs. Measured through the font's own metrics (canvas
`fontBoundingBoxAscent` against `actualBoundingBoxAscent`): **6.83px at a
73.6px title, which is 0.0928em.**
**As a fraction, not a pixel value**, because the title is clamped and so
different at every width between 1101 and ~1132 — and every term in that
offset is proportional to the font-size, so one ratio is exact
everywhere. Measured **0.00 at 1440 and 1200, 0.35 at 1101**, in all four
languages.
**And the Japanese override is gone.** The old number needed one because
it measured a CONTROL above the masthead and Noto Sans JP made that
control 3px taller. This measures a sibling in the same grid row, and the
title is "POT CLIP" — Latin in all four languages, Archivo
Black in all four — so one number is right in each. One rule where there
were two.
**It stays in the `min-width: 1101px` query**, the only one in this
stylesheet, because below that the masthead is one column with the media
`order: -1` and FIRST, where a top margin would just push the opening
frame down the page for nothing.

**`--project-title-size` LIVES IN `:root`, AND PUTTING IT ANYWHERE ELSE
BROKE THREE PROJECTS.** The offset above is a fraction of the title's
size, so the clamp became a token rather than being written twice. It was
declared on `.cs-mast` first, which reads correctly — both users are
inside the masthead — and is wrong, because the `font-size` rule is
`.project-body h2, .cs-title-slot h2`, one declaration shared with the six
write-up layouts. Outside `.cs-mast` the var is undefined, an undefined
`var()` makes the declaration **invalid at computed-value time**, and
`font-size` then falls back to *inherit* — so easter-riverside, sandcastles
and fuse drew their titles at **16px instead of 73.6**.
**Nothing caught it**: the braces balance, `audit.js` is clean, and the one
project being worked on looked perfect. Diffing the other six against
`git stash` is what found it — which is the check this file already asks
for after any change to the case study, and this is the commit that proves
why.

**THE MASTHEAD IS THE POSTER, NOT THE PHOTOGRAPH IN IT.** Jack: *"change the
current hero image to 6.jpg. Its a poster that I made with the exact photo
in it so I think it may look better."* Same bowl, rod and clip, set under
*Il buon design vive nei dettagli* with the ALESSI lockup and the credit
line — so the page opens on a finished piece of design rather than the shot
it was built from, which is what the page is arguing this project is.
**It is the same file as the third poster below, deliberately.** A second
copy at a second path would cost a second download for anyone who scrolls
to Posters; one path, loaded eagerly up here, is in cache by the time the
three-up needs it. The cost is that the picture appears twice on the page.
**Re-exported at 1400** where the posters run alone was happy at 900: the
masthead draws ~549 CSS px, so 900 was 1.6× on a retina screen. 1414 is all
the source has.
**AND THE STACKED MASTHEAD NEEDED A CAP, which the square never did.**
`.cs-mast` goes to one column at 1100, and the media is `order: -1`, so the
opening frame becomes the whole measure with the title under it. At 901 the
1414×2000 poster drew **805×1138 in a 900px window** — you could not see the
whole poster, let alone the project's name. Capped at 440 it is 434×614 and
the title, the lede and the meta table are all on the first screen. **Stated
at 0-3-0**, because the rule it narrows is
`.cs-mast-media .cs-fig.is-portrait` and specificity beats source order —
the fourth time this file has had to say that.

**`cs-hero-clip.jpg` is still in `assets/` and no longer referenced.** It is
the 1.55× crop of the same shot, moved four times on Jack's eye — 1.00, then
1.24 at left 584, then 1.24 at left 284, then 1.55 at 80,810, then the same
window 140px higher up the 3024×3024 source. Two things are worth keeping if
it ever comes back. **Moving the WINDOW left moves the SUBJECT right**, so
"zoom in" and "more white space on the left" are both paid for out of the
right edge, where the bowl already ran off the frame — the cheapest thing in
it, and protecting every pixel of it is what made the first version wrong.
And **the rod's top edge is y 1025 with the cast shadow running to 2745**,
which is what the last pass measured after this note had claimed 2490 for
two crops running. *A number nobody re-measures outlives the thing it
describes.*
**THE GALLERY CARD IS A PIECE JACK DREW FOR THE SLOT.** *"Change the
project card to newAlessicard.png"* — the render on its own red ground
with four drawn utensils around it, **1400 × 1050**, which is the 4:3 and
the exact export size this project's card spec asks for. No crop and no
composite: the file lands in the slot as it is. **80K jpeg / 59K webp at
43.7 and 42.6 dB** against a q98 reference — bigger than the 37K composite
it replaces, which was mostly flat colour, because this one carries a
full-frame render.
**It keeps clear of the two things that eat a card's edges**, which is
what the spec exists for: the `.card-media::after` badge is a 46 × 46
square pinned top-right with two hard black rules, and the hover zoom
scales the image 1.04 — about 2% off every side. This card's top-right
corner is empty ground and its nearest drawing sits inside 88% of the
width, so neither reaches anything.
**`bg` IS INERT, AND THAT IS A FINDING RATHER THAN A DECISION.**
`renderGallery` writes it onto the card as `--bg` and **nothing reads that
property** — checked across `styles.css`, `script.js` and `index.html`:
one write, no `var(--bg)` anywhere. So the colour that is supposed to stop
a card flashing something the image then contradicts does nothing today.
It is kept correct (`#7B1610`, sampled from the new file's corner pixels,
where the composite's was `#7C1611`) rather than left stale, because the
thing it was for is still worth having and the fix is one rule on
`.card-media` rather than six values to re-derive.

**IT REPLACED A COMPOSITE OF THE RED POSTER**, which was the previous
answer to the same slot. Jack then: *"for the project card in the main
page, change the image to 20.jpg and let's see how that looks."*
The card slot is 4:3 and the poster is 1414×2000, so a crop can hold the
object or the ALESSI / NABA lockup and not both. **It is composited
instead**: the poster scaled to the full height of a 1280×960 canvas filled
with `#7C1611`, the poster's own ground sampled at all four corners. The
bars are therefore the same red as the picture, nothing reads as
letterboxed, and no part of the poster is cut. It is also **37K against
198K**, because most of it is flat colour.
`bg` is that red for the same reason it was the photograph's grey: the card
must not flash a colour the image then contradicts.
**It carries a `?v=`** — the bytes changed at a live path, and without one a
returning visitor keeps the old bowl photograph for up to a week.
**And it gained an `altKey`.** pot-clip's positional `alt.N` keys went with
the masonry wall and nothing replaced them for the thumb, so the one image
representing this project in the gallery had been falling through to the
generic *"Photo 1 from POT CLIP"*.

**`cs-storefront.jpg` has identifiable bystanders** — the Milan shopfront —
so it falls under the safety constraint below.

**The old photo wall is in `docs/pot-clip-masonry.md`**, verbatim, with the
48 alt-text lines that came out of `i18n.js` and the list of 11 photographs
left unreferenced on disk. Gitignored, like the other restore notes;
`git revert` is the other route.

### Which detail layout, and why it is arithmetic

`mixed` divides ONE 956px row between however many tiles it is given, so
the tile count is not a free choice: easter-riverside's three come out
383×311 and sandcastles' two 472×380, which is roughly the ~311px the
export spec assumes. **Nine tiles came out 109×88** — thumbnails too small
to read, on the project whose process is the whole argument. That is what
sent `pot-clip` to `masonry` — **and `pot-clip` has since left both**, for
the case-study layout above. The arithmetic is unchanged and still decides
the other six; the worked example is now historical.
**`masonry` is the layout for a SEQUENCE**: it packs rows of three columns,
keeps the photos in order, and gives the write-up a sticky sidebar. Two
things follow from the packer and both are load-bearing:
- **It pairs a landscape with a portrait** (landscape + portrait = 2 + 1,
  three portraits = 1 + 1 + 1, a lone landscape = full width), so the
  ORDER of `photos` decides whether the wall has holes in it. pot-clip ran
  feature, L+P, L+P, P+P+P, feature — five full rows. Square crops defeat
  this entirely: `isLandscape` is `w >= h`, so a square is a landscape and
  nine of them become nine full-width rows.
- **Alt text is positional.** `resolveAlt` uses `index + 1`, and masonry
  passes the array index, so `proj.<id>.alt.N` tracks the `photos` array.
  Reordering the array reorders the alt text silently — pot-clip's alt.8
  and alt.9 had to be swapped in all four languages when the poster moved
  ahead of the render.

**FOUR THINGS ABOUT `pot-clip`'S WALL WERE WRONG ON THE FIRST PASS**, and
all four are the same mistake: deciding by eye what the files could have
been asked. **The wall itself is gone** — see the case-study layout above —
but three of the four are facts about the project rather than about the
layout, so they travelled with the photographs and are still true.

- **THE ORDER WAS AN ASSUMPTION, NOT THE PROCESS.** The Blender capture sat
  fourth, between the paper profiles and the spray booth, because that is
  how a digital designer's process usually runs. Jack: *"I did the 3D model
  last, but its picture of in Blender is in the middle."* **The EXIF dates
  settle it**: sketches and paper studies 6 October, foam and first coats 13
  October, finishing and the final object 20 October — and **every Blender
  screenshot is 20–21 November**, weeks later. The physical model came
  first and the digital one was built from it.
  **The write-up carried the same error**, in all four languages: it said
  "a model built in Blender, and then the physical one". That is a false
  claim about how he made his own object, published under his name. **Read
  the capture dates before narrating a process.**
- **ONE POSTER WAS A MISREAD OF THE PROJECT.** Jack: *"I'm a digital
  creative, so I feel like we need more emphasis on the posters that I
  created. And I created so many posters, and we only put one in there."*
  There are five now — three as a run of their own, two flanking the model.
  The posters are an output of the project, not a footnote to the object.
- **A PHOTOGRAPH ARRIVED ON ITS SIDE AND STAYED THAT WAY.** The notebook
  page carrying the orthographic views and the dimensions (26 / 45 / 31 /
  19 mm) was shot in portrait with the page turned, so everything on it
  reads vertically. It was not in the project at all, which is how it went
  unnoticed. Rotated 90° ANTICLOCKWISE — verified by rendering both
  directions and reading the labels, because the other way is upside down —
  and baked to orientation 1 rather than tagged, per the double-rotation
  gotcha in `assets/README.md`.
- **CLICK-TO-ZOOM IS ALL OF THEM.** It was on two tiles out of nine and
  looked arbitrary, because it was: `full` had been added only where the
  source happened to be large. The rule survived the redesign: every figure
  in the case study carries `full`, and **11 of the 12 images in the panel
  zoom** — the twelfth is the turntable's poster, which is a fallback
  rather than a photograph. (14 → 13 when the dimensioned notebook page
  came out of The design, back to 14 with a finishing photograph, then to
  12 when Process went to one photograph a card; counted in the live panel
  each time, not inferred.) For the new exports `full` is the file's own
  path: they are 1000–1600px sources drawn 300–600px wide, so opening one at
  full size really does show more, and there is no second file to fetch.

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

- **Asset paths must be root-relative — `srcset` included.** This is the one
  that actually broke: `src="assets/…"` resolves against `/work/` on a deep
  link, so every image, the stylesheet and both scripts 404 and the page
  arrives dead.
  **One survived until 2026-11-19 because the audit only looked at `src` and
  `href`**: `<source srcset="assets/about/jack-centrale.webp">` in the about
  portrait's `<picture>`. It read "0 found" with a relative path sitting in
  the markup. It matters more on a `<source>` than anywhere else — a
  `<picture>` falls back when a browser cannot DECODE a type, not when a file
  404s, so a source that resolves against `/work/` is a broken image rather
  than a quiet downgrade to the jpg. `audit.js` checks all three attributes
  now; it was made to fail on the live bug before the path was fixed. All of
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

**The JM logo and BACK TO TOP are `<a href="/">`**, not `#top` fragments.
They were, and a fragment leaves `/#top` in the address bar — so anyone who
clicks home and then copies the URL shares a link with a stale anchor on it.
Jack's framing was the sharing one: "when I reload the site with
jackmurraydesign.com, it goes to the top… if someone copies the link for the
page and they're at the very top, then that might be good." The anchor buys
nothing, because landing on `/` already puts you at the top.
They route through `navigate()` like everything else, then scroll and move
focus; `navigate()` only pushes when the PATHNAME differs, so clicking home
while already home adds no history entry, and a lingering hash is cleared
with `replaceState` because a hash is not part of the pathname. **The hero
keeps `id="top"`** so links already in the wild still work, and gained
`tabindex="-1"` so the home links can move focus there the way the fragment
used to — otherwise a keyboard user is scrolled to the top with focus left at
the bottom. `.hero:focus` has no outline on purpose: it is a page region,
not a control, and a 1440px ring round the hero is noise.

**Cards are `<a href="/work/…">`**, not `<article role="button">`. That is
what makes the URL copyable, middle-clickable and crawlable; the role,
`tabindex` and keydown handler all went away because a link supplies them.
The click handler ignores modified clicks on purpose — calling
`preventDefault` on a cmd-click would quietly remove open-in-new-tab, which
is most of the point.

**Adding or renaming a project means FIVE files**: `projectData`,
`sitemap.xml`, `llms.txt`, the JSON-LD in `index.html` — and the
`.gallery-fallback` list inside `#gallery` in `index.html`, which is the
same six projects written out in markup, write-ups included (see *Machine
readers*). It was four until 2026-11-19.
**THE FIFTH LOOKS AFTER ITSELF — `.githooks/pre-commit` REGENERATES IT ON
EVERY COMMIT.** It was a documented manual step for one day, which Jack
ended: *"I wont remember that so make sure it auto does it."* He is right,
and it generalises past this one file — **a maintenance step a person has
to remember is a bug with a manual workaround.** If you add another derived
file here, hook it rather than writing it down.
`node tools/write-fallback.js` still exists and still works by hand; the
hook just calls it so nobody has to.
**It refuses rather than sweeps.** `git add index.html` inside a hook can
pull unrelated unstaged edits into a commit, which is a worse surprise than
the stale block it prevents. So it checks whether `index.html` was already
dirty: clean, it regenerates and stages; dirty, it regenerates, stages
NOTHING, explains, and exits 1 so the commit stops. `SKIP_FALLBACK_HOOK=1`
is the escape hatch. Both paths were driven before being trusted.
**It is not a build step** — nothing runs at deploy and nothing runs in a
browser; it writes static HTML on this machine, like `field-shuffle.js`.
**`core.hooksPath` is LOCAL config and does not survive a fresh clone**, so
that is the one way this silently stops working: `audit.js` has a check for
it that prints the one command to fix it
(`git config core.hooksPath .githooks`).
`node tools/audit.js` also checks all five lists agree and re-derives the
fifth to prove it is current — an id can agree while the words beside it
are a release out of date, and those words are what a reader without
JavaScript actually sees.

## UX rules

### State, and saying things out loud

- **State lives in one place, and a class is not state.** The language button
  shows the translate mark only; which language is on is told by the menu's
  marked option + `aria-current`. The filters carry `aria-pressed` for the
  same reason — they had only the `.active` class, so the current filter was
  visible as a fill and announced as nothing. `aria-pressed` rather than
  `role="radio"`: radio is the tighter match for "exactly one at a time" but
  commits to arrow-key navigation between the options, and a
  half-implemented radiogroup is worse than honest toggle buttons.
- **WHAT IS ON SCREEN WHEN THE PAGE LOADS IS REVEALED OUTRIGHT; ONLY WHAT IS
  BELOW THE FOLD WAITS FOR THE OBSERVER.** The scroll reveal used one rule,
  "show it once 15% of it is on screen", and 15% is a fraction of the
  ELEMENT — so what it means in pixels depends entirely on how tall that
  element is. 15% of a 32px heading is 5px; 15% of a 714px project card is
  107px. That was invisible until `.hero` came up to 66vh so the cards would
  break the fold: the first row peeks 63.5px at 1440×900, which is **ratio
  0.089**, under the bar — so the cards sat at opacity 0 and the thing the
  shorter hero exists to show could not be seen. Jack: *"they're not loading
  automatically… you can't see them unless you scroll down."*
  **Raising the threshold would not have fixed it, and the phone is the
  proof.** The 40px offset is part of the resting state, so an unrevealed
  element sits 40px lower than where it ends up: at 390×844 the settled card
  clears the fold by 24.5px while the unrevealed one is 15.5px **below** it.
  No threshold can help, because the element is only on screen once revealed
  and only revealed once on screen.
  So the load case does not use an observer at all. It takes the element's
  own transform back out of its rect — `DOMMatrixReadOnly(…).m42`, read from
  computed style rather than hardcoding the 40 — to find where it will
  SETTLE, and reveals it outright if that lands in the viewport. Everything
  else keeps the 15%, which is where it has always been right.
  **The class goes on in a `requestAnimationFrame` with a `setTimeout`
  behind it.** The rAF is so the browser paints the resting state first and
  the transition runs; set it synchronously and the element snaps in. The
  timeout is not belt-and-braces for its own sake — a rAF never fires in a
  background tab, and content that is invisible until a frame is painted is
  one bad assumption away from never appearing. Both paths are idempotent.
  The routing runs again on `load`, because the first pass reads a layout
  taken before webfonts have swapped.
  **The first two cards also load `eager` with `fetchpriority="high"`.** Two,
  because the grid is two columns on a desktop and one on a phone, so two
  covers the first row either way. An image the visitor can already see has
  no business being lazy. **The other four are flipped to `eager` 400ms
  after `load`**, which costs first paint nothing because it has already
  happened, and makes the rest deterministic rather than leaving it to
  Chrome's own lazy distance — that distance is generous but it NARROWS on a
  slow connection, which is exactly when a blank card is most likely.
- **THE SCROLL TRIGGER IS A DISTANCE, NOT A FRACTION OF THE ELEMENT**, and
  that was the same mistake as the load case in a different place. It was
  "reveal once 15% of it is on screen", so the taller a block is, the longer
  it waits. Measured at 1440×900, how far you had to scroll PAST a block's
  top edge before it would even begin to appear:
  | block | height | scrolled past before it starts |
  |---|---|---|
  | `.about-panel` | 747 | **112px** |
  | `.card` | 714 | **107px** |
  | `.contact-form` | 526 | 79px |
  | `.section-head` | 154 | 23px |
  | `.filters` | 90 | 14px |
  | `.contact-bottom` | 23 | 3px |
  **Exactly backwards.** The big photo-carrying blocks — the ones that are
  obviously there and obviously blank — waited longest, while a 23px strip
  appeared instantly. The 40px offset and the 0.8s fade then ran on top, so a
  card was blank for 107px of scroll and still arriving for most of a second
  after. Jack: *"the user, I feel like, should always know that there's
  something under."*
  It is `rootMargin: '0px 0px 20% 0px'` with no threshold now — 180px at
  900 — so every block starts its fade while still below the fold whatever
  its size, and is part-way through before any of it shows. At a normal
  600px/s that is 300ms of head start on a 0.8s fade. **If it still feels
  slow, the remaining lever is that 0.8s**, not the margin.
  Verified on a clean load: 4 revealed (all genuinely on screen), 15 still
  waiting with the nearest 688px below the fold, and all six card images
  ready without scrolling.
  Verified on a cold load: at 1440×900 the first two cards carry `.in-view`
  with opacity 1 and 63.5px showing, cards 3–6 still at 0; at 390×844 the
  first card is revealed with 24.5px showing and everything below the fold
  still hidden.
- **A visual-only change needs saying out loud.** Filtering takes the grid
  from six cards to one with no sound at all, so `#filterStatus`
  (`role="status"`, `.sr-only`) announces the count. Singular and plural are
  separate keys, not "1 project(s)" — three of the four languages are not
  English. `.sr-only` uses `clip-path` and 1px rather than `display: none`,
  which would take the live region out of the accessibility tree and silence
  the thing it exists for.
### Copy, cards and the section marks

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
- **THE CONTACT BAND ENDS ON ITS OWN PADDING, with nothing drawn across it.**
  `.contact-bottom` was an empty div below the form whose only effect was a
  3px `--ink` rule the full width of the band and 20px of coral under it.
  Jack: *"there's like a single black bar that goes across the whole screen,
  and then there's like a bit of red space… not really sure what that is
  about."*
  It was the divider above `<p class="contact-loc">BASED IN ILLINOIS —
  AVAILABLE ANYWHERE</p>`. The line was cut and the container was left, so
  the rule had been separating the form from nothing. Both are gone; the
  section's own 50px of bottom padding is the gap, and the coral now meets
  the footer's ink on a hard edge like every other band on the page.
  **The class, its CSS and its i18n key all went at different times**, which
  is why nothing caught it: `audit.js` checks for dead CSS classes and
  unreferenced i18n keys, and `.contact-loc` and `contact.location` had both
  been tidied away properly. An empty element whose rule still matches is
  invisible to both checks — it is live CSS on live markup, and only the eye
  can tell that what it is dividing no longer exists.
- **The contact statement is "Say Hello!", and it is the one display line on
  the page that is NOT set in caps.** It read "GOT AN IDEA? / LET'S TALK!"
  across two lines, which is the register of a pitch; the `text-transform:
  uppercase` is gone from `.contact-statement` rather than overridden, so
  the four translations are set exactly as `i18n.js` writes them —
  "¡Saluda!", 「こんにちは！」, "Salutami!". Shouting a greeting would undo
  the point of making it one.
  **It also fixes a repetition nobody had named.** The badge says LET'S MAKE
  SOMETHING, the magnetic headline says LET'S MAKE / SOMETHING., and the
  contact heading used to say LET'S TALK — three variations on one register,
  and that register is the generated default. The big one keeps the phrase;
  this one has a different job now.
  Measured on the coral ground at 57.6px/700: **4.6:1**, where display type
  owes 3.
- **The social list is LinkedIn, Instagram, Resume, GitHub, in that order.**
  Resume moved above GitHub on 2026-11-18. The list is read top down and the
  resume is the thing an employer came for, where GitHub is supporting
  evidence; it had been last of four, under three social profiles, which is
  a ranking nobody intended.
- **THE SECTION EYEBROWS ARE GONE AND THEIR SLOT IS THREE MARKS.** It held
  "01 / PROJECTS" beside a heading already reading SELECTED PROJECTS, and
  "02 / ABOUT" beside ABOUT. Jack: uppercase numbered eyebrows "look too
  AI" — and he is describing something real, not a mood. A tracked-out
  all-caps label restating the heading next to it is the house style of
  every template, and the brief asks for exactly its deletion: *avoiding
  unnecessary descriptions*, prose that restates what the work already
  shows. The number was the only part carrying anything the heading did
  not, and a number is better drawn than spelled.
  So `.section-marks` is three of the page's own mark — the same slightly
  wide rectangle as the full stop after MURRAY, the JM wordmark and the
  availability dot, now at a fourth size, 10 × 9.4 for the glyph's 1.065.
  One lit, two not. **A little bigger than the badge's 8**, because it
  answers a 73.6px heading across the width of the page rather than sitting
  inside a 12px label.
  **Unlit is the section's own foreground, dimmed; lit is `--accent`.**
  Dimmed ACCENT was the first try and was wrong: three pale coral squares
  read as one faded thing, where a grey pair beside a coral one reads as
  off and on. `.contact` is the exception, because its background IS
  `--accent`: there the lit mark is `--ink`, the colour the section already
  writes in.
  **THE ALPHA IS PER SURFACE AND MEASURED.** One number across three grounds
  was the second thing Jack caught — "they look a bit off on the different
  backgrounds" — and he was reading real numbers: the same 26% ink gave
  **1.51, 2.23 and 1.50** to one in light and 1.77, 2.20 and 1.59 in dark,
  so the ink slab's pair was half again as loud as the other two in both
  themes. Tuned to **1.8:1 on every ground** instead — `--mark-dim` is 28%
  on sand, 20% on the slab, 37% on coral, and 20 / 20 / 33 in dark — which
  lands them at 1.81 / 1.83 / 1.79 light and 1.77 / 1.78 / 1.81 dark. **A 2%
  spread where it was 49%.**
  Dark gives `#work` and `.about` the SAME alpha and must: `--white` and
  `--ink` are both `#111117` there, so the two grounds are literally the
  same colour and two different alphas on them is the bug, not the fix.
  **The LIT mark is deliberately NOT equalised.** It is 3.21:1 on sand
  against 4.60 on the other two, and `--accent-ink` would fix it (4.71). It
  stays `--accent` because the nav is fixed: the JM wordmark's coral mark is
  on screen at the same time as these, and being that same mark again is the
  whole point. Two reds in one view is the near-miss bug. The three lit
  marks are never co-visible with **each other**, so hue beats parity.
  **Vertically they are centred on the heading, not hung off its baseline.**
  `.section-head` is `align-items: baseline`, which left them 20px below the
  heading's optical centre and, on a phone where SELECTED PROJECTS wraps,
  pinned to the first line while the heading grew past them. `align-self:
  center` fixes both, and centring on the h2's BOX is right here for a
  reason worth keeping: measured through the font's own metrics at 1280, the
  cap band runs 904.5–959.3 (centre 931.9) and the box 892.2–972.2 (centre
  932.2). **They agree to 0.3px because the heading is all caps with no
  descenders.** A lowercase heading would not, and would need measuring
  again.
  **The gap IS the mark's width**, so the row is five equal units and reads
  as one rhythm rather than three things that happen to be 7 apart.
  **On `.about` they stay on the TEXT measure, and that was settled the hard
  way.** That section has two right edges: prose stops at `--about-inset`,
  while structure — the stats band, the heading's own rule — runs the extra
  56px and lands on the photo panel. The marks were pushed out to the panel
  edge so the row would line up with the band below it. Jack, on a Mac: "the
  three marks on the about section is clipping in the photo." Measured, the
  third mark's right edge and the panel's left edge were **the same number to
  three decimals** — 1092.000 at 1512 — so the mark was flush against the
  panel's bright 4px border, and in the 800–1100 band where the panel is
  `34vw` both resolve to fractions, where half a device pixel of rounding is
  enough to put ink over the rule.
  **Flush is right for the band and wrong for the mark, and the difference is
  SIZE, not alignment.** A filled band meeting a panel reads as two planes
  abutting; a 10px square touching a bright rule reads as a collision. The
  favicon note records the identical thing — a circle got away with reaching
  that far because only its tangent point did, and a square did not.
  So they sit on the measure, aligned with the paragraph directly below them,
  with `--about-gap`'s 56px between them and the photo — verified at 56.000px
  of clearance at 901, 1000, 1024, 1100, 1366, 1512, 1728 and 1920. **If this
  ever looks stranded to you: it was tried, and it clipped.**
  **They are NOT links.** They look like pagination and the pull to wire
  them up is strong, but PROJECTS / ABOUT / CONTACT is in the nav on every
  screen, so three marks × three sections is nine controls doing what three
  already do — and at 10px they are under half a touch target. They are an
  indicator; the nav is the control. `aria-hidden` follows from the same
  thing: the heading beside them already says which section this is. That is
  also why this was free in four languages — **it replaced twelve i18n keys
  with none.**
  `#work`'s row keeps the opaque patch the eyebrow had, with one extra
  reason: the hero field is made of drifting squares in `--accent` and
  `--blue`, so three small static squares inside its reach can read as four
  more of them.
  **The about overlay's "ABOUT JACK" chip went with them**, for the same
  reason and nothing else: it sat above a heading reading HI, I'M JACK. The
  heading's 14px top margin went too — it was the gap to that chip, and with
  nothing above it the margin was an orphan costing the layout its one
  alignment. `.about-page-intro h2` now starts on the same line as the top of
  the portrait frame, measured 0px apart in both themes and in Japanese.
  **The project overlay's `.project-cat` STAYS**, and the distinction is the
  point: the same element there is filled with the project's own category by
  `openProject`. A tag that tells you what kind of work this is carries
  something the title does not; a tag that repeats the title does not. Cut by
  what a label SAYS, not by how it is set.
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
### The hero column, its badge and its CTA

- **The hero column's spacing is one ratio, not three numbers.** Badge, role
  and CTA, and the three vertical whites between and inside them each run
  about 1.75× the one above — measured ink to ink at 1440, where the role
  sets 37.6px: 15.0 between the role's own two lines (line-height 1.1), 26.6
  badge-to-role, 45.7 role-to-CTA. A column saying three things — an opening,
  a statement, an action — has to answer "which of these belong together"
  before anything else, and it answers with white: one consistent step makes
  the badge read as a label ON the statement and the button as the separate
  thing you do about it.
  **The badge was a STATUS and is now an invitation**: it read OPEN TO
  PROJECTS & DESIGN WORK, then LET'S TALK, and now **LET'S MAKE SOMETHING**,
  which is the magnetic headline's own words — so the page opens and closes on
  the same phrase, and the badge is a small preview of the section it links
  to. The translations are `magnetic.rows` joined up, so this is already
  Jack's approved copy in four languages rather than new wording. Worth
  knowing what that costs, because the spacing argument above was built on it
  being a status: the hero now carries two things to click, the badge to
  /#contact and the button to /#work, where it used to carry one action and
  one fact. It still works because the two are different sizes doing different
  jobs — a 12px tracked tag against a 62px filled button — and because the
  badge has always been a link to the contact section, so the label now says
  what it does. But if the hero ever reads as nagging, this is where it
  started. It was 30px and 44px flat, which came out 26.5 and
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
- **THE HERO CTA CASTS NOTHING AT REST.** It carried a 4px coral block for a
  few releases, argued for on the grounds that a flat button is a label until
  you hover it and that a phone never hovers. Jack: too loud standing still,
  "make it like it was before and only see the red background rectangle when
  you hover over it like other buttons". **Reverted, and the argument it
  replaced was wrong twice over.**
  First, the button is not flat — it is a filled near-black rectangle with
  white type on a sand ground, which is already unmistakably a control. The
  block was emphasis on the one element in the hero that needed none.
  Second, **"like other buttons" is literally true**: `.form-submit` lifts 3
  into a 6px block, `.badge-available` 3 into 5, the cards 4/6 into 8, and
  every one of them casts on hover and nothing before. The resting block made
  this the only control on the site wearing its shadow at rest — and a button
  that is already raised when you arrive has nowhere to go when you point at
  it.
  **Hover is 4px lift into a 7px block**, back to the number it had before.
  The 8 existed only to PIN the resting block: a shadow offset is measured
  from the element, so a `translate(-4px, -4px)` lift carries the shadow with
  it, and 4 + 4 held the block on the exact spot it had been occupying. With
  no resting block there is nothing to pin and the number is free, so it goes
  back to the house proportion — 3px past the resting silhouette, the same as
  `.form-submit`.
  **Dark loses the block at rest and keeps the bloom**, which is what the
  comment in `styles.css` had claimed all along while the code did something
  else. Light's button is flat until pointed at; dark's is flat and lit,
  because a glow is what every other accent thing in dark mode does. The dark
  override replaces `box-shadow` wholesale, so its hover has to restate the
  block alongside the bloom and track the base rule's offset — a stale number
  there cancels the press in dark mode only.
  **On touch the button never casts**, since the hover rules sit inside
  `@media (hover: hover)`. That is the trade the resting block was bought to
  avoid, and it is the same trade every other control on the site already
  makes.
- **AND `.project-back` LOST ITS RESTING BLOCK FOR THE SAME REASON, ON ALL
  SEVEN PROJECTS.** Jack: *"make the back to work button like most buttons,
  because it's too loud. Make it not have the red drop shadow til after the
  hover and have it not change to white on hover."* It carried a 4px coral
  block standing still, argued for on the grounds that it is **sticky** and
  the page scrolls underneath it, so it needed an edge of its own. That is
  the same argument the hero CTA's resting block was reverted for, and it
  fails the same way: this is a filled rectangle with a 2px border and
  reversed type, which is already unmistakably a control, and a button
  wearing its shadow at rest has nowhere to go when you point at it. It was
  the only control on the page carrying one.
  **The edge worry was tested rather than assumed.** Driven over
  easter-riverside's full-bleed sky photograph in both themes, the button
  reads cleanly — an opaque near-black chip on the picture in light, an
  opaque off-white one in dark. It never needed the shadow to separate.
  **Hover is the house pattern now**: a 3px lift into a **6px** block, 3px
  past the resting silhouette, the same proportion `.form-submit` and
  `.btn-block` use. The colour inversion went with the block — `.btn-block`
  does not invert either, so the lift and the block are the whole gesture —
  and `:active` drops both, so a press reads as a press.
  **The transition was wrong in both directions and that is the "animation"
  half of the request.** It listed `background` and `color`, which no longer
  change, and NOT `box-shadow`, which is the one thing that now arrives on
  hover — so the block popped in with no transition at all. It is
  `transform .25s, box-shadow .25s`, the same two properties and the same
  duration as `.form-submit`.
  **The hover pad is unaffected**: `--lift-x/y` are still 3px and
  `--lift-edge` 2px, so the `:hover::before` still gives back exactly what
  the lift takes.
- **The CTA arrow is `scale(1.3, 1.85)`** — wider as well as longer. `\2193`
  is drawn narrow, a thin stem under a shallow chevron, and at 15.2px the head
  read as a tick. X stays well under Y deliberately: at equal scales the glyph
  just gets bigger, and the point is a broader arrow, not a louder one. Both
  scales live inside the keyframes, because the animation drives `transform`
  and a static one on the element is overridden every frame.
  **Y went 1.55 → 1.85** on Jack asking for it "a little bit longer… but keep
  like the width and the thickness the same", and a glyph transform happens
  to give exactly that. Measured by rasterising the glyph at ten times size
  and scanning the ink: total height 16.8px → 19.9px, of which the **shaft**
  takes 10.1 → 12.1 and the head only 6.7 → 7.8, about a pixel at the size it
  renders. Head width is 11.0px at both and stem width 1.8px at both, because
  scaling Y cannot touch either. **Re-measure the same way before moving it
  again** — the head is a third of the glyph, so there is a point where
  lengthening starts stretching it into a spike.
### The red mark, at four sizes

- **The red mark appears THREE times and is one mark at three sizes.** The
  full stop after MURRAY, the mark in the JM wordmark, and — since
  2026-11-17 — the availability dot in the hero badge. All three are
  `--accent`, and all three are the same SQUARE, because that is what
  Archivo Black's full stop is: a very slightly wide rectangle, 42.4 × 39.8
  measured at 200px, ratio 1.065. The nav mark is 0.34em × 0.319em
  (7.6 × 7.1px) and the badge mark 0.667em × 0.625em of its own 0.75rem
  (8 × 7.5px, ratio 1.067).
  Getting the nav one there meant dropping its `\25CF` glyph. As TEXT at
  22.4px/400 it sat just under the large-text threshold and owed the full
  4.5:1, which coral cannot give on the ground (3.21:1) — that is why it used
  to be the darker `--accent-ink`, and why it read as a near-miss rather than
  a repeat. Drawn, it is non-text content, the bar is 3:1, and 3.21 passes.
  Both spans are empty; the nav one is `aria-hidden` because the glyph was
  being announced as "black circle" after the J and the M. In dark all three
  are the same neon, so nothing changes there.
  **The badge dot was a pulsing green circle until Jack called it out**: "it
  looks cool but like AI". He was right about what it was — a green dot that
  breathes is the status indicator every SaaS dashboard ships, and it meant
  "service up" rather than "Jack Murray". Making it the same square as the
  wordmark costs nothing and stops the hero carrying a fourth kind of object.
  It is 8 × 7.5 and not 9 × 9 because a square carries more optical weight in
  the same box as a circle — the favicon note below records the same trade.
  **The green took `--green` with it**, which was the only thing using the
  token. It also took a contrast failure nobody had seen: at rest green
  measured 3.49:1 light and 11.74:1 dark, but the badge fills with
  `--black` on hover, and in dark that is `#F4F2F5` — neon green on it is
  **1.44:1**. Coral/pink gives 4.60:1 and 3.28:1 on the same fills. One more
  for the pile of bugs that only live in `:hover`.
  **THE BADGE MARK IS OUT OF ITS SLOT UNTIL YOU POINT AT THE BADGE.** Jack's
  idea, and his words for it: "like it's not complete". The badge shows a
  dotted socket with the mark sitting up and to the right of it; hovering the
  badge snaps the mark home and starts it pulsing. The pulse used to run all
  the time and now it is the reward.
  **Built as `.badge-dot` (the socket) plus `.badge-dot::after` (the mark)**,
  so the socket stays in the flex row and holds the badge's width while the
  mark moves independently of it. `inset: -1px` makes the mark exactly the
  socket's border box, so landing covers the dotted rule completely — the
  point is that the mark COMPLETES the shape, not that it sits on top of it.
  **DOTTED, not dashed, and that is arithmetic.** Chrome draws a dashed
  border with dash and gap both at 3× the border width, so 1px dashed on an
  8px side fits one 6px cycle and you get a square with broken corners.
  Dotted is 1× and 1×, so the same side takes four — the perforated look the
  reference actually shows. Going to 2px to make it heavier doubles the cycle
  and makes it worse. That is why **size is the lever, not weight** — and the
  mark took it: 8 × 7.5 → **10 × 9.4** on Jack asking for it bigger, four dots
  a side becoming five, and the same 10 the section marks use. The 1.065 ratio
  is the full stop's and does not move.
  **6 × −5 of displacement**, about two thirds of the mark's own size — far
  enough to read as displaced rather than as a misprint, near enough that the
  two still read as one object. Up and RIGHT because the gap to the label is
  the only slack around it; the same move left would eat the padding and crowd
  the border. The mark is absolutely positioned, so it costs the badge's width
  nothing.
  **THE BADGE HAS ONE MEASURE NOW, 14, USED THREE TIMES**: border to mark,
  mark to label, label to border. It was 10 against a 14 padding, which is the
  near-miss that looks almost deliberate — and at 10 a 6px displacement would
  have left the square 4px off the L, which reads as a collision rather than
  as a thing out of place. At 14 it leaves 8, or 0.67em. Measured in all four
  languages, the three distances come out **14.00 / 14.00 / 14.00**.
  The word space in this type is **4.55px** (3.05 glyph + 1.5 tracking, through
  the font's own metrics), so the CTA's comment calling its own 14 'a word
  space' was wrong about the arithmetic and right about the number.
  **A 1.5px correction for the trailing letter-space was tried and reverted**:
  `letter-spacing` does add its 1.5 after the last glyph, but `Range`'s ink box
  already excludes it, so the right side measured 14.00 without help and the
  correction took it to 12.50. The probe caught it; the eye would not have.
  **`--knob-ease`, the theme switch's curve**, which overshoots slightly. The
  note there applies word for word: a thing that slides to a hard stop reads
  as a value being set, one that arrives with weight reads as a switch being
  thrown. The pulse is **delayed by the snap's own duration** so it starts
  once the mark has landed — run together they read as two effects on one
  object, sequenced they read as cause and effect.
  **Both halves are gated on `(hover: hover)` AND
  `(prefers-reduced-motion: no-preference)`.** A touch device never hovers and
  a reduced-motion visitor never sees the snap, so for them a displaced mark
  is not a tease, it is a mark that looks broken with no way to fix it. They
  get the completed badge, static, which is exactly what this was before.
  **DARK HAS NO GLOW AT REST.** It carried the 10px bloom standing still —
  dark mode doing what dark mode does — and Jack's read was that it took too
  much of your attention for what it is: *"maybe it's taking up a bit too much
  priority… can we try it where there's no glow and it's just that pink red
  color"*. So the resting mark is a flat square in **both** themes now, and
  dark's whole character here arrives with the pointer: snap, glow, pulse.
  That also makes the two themes agree about what REST means, which they did
  not before — light was flat and dark was lit, and the difference bought
  nothing once the pulse had already moved to hover.
  **The bloom is declared on `:hover` rather than only in the keyframes so it
  can TRANSITION.** The pulse is delayed by the snap's duration, so with the
  glow living only in the keyframes it would have popped on 0.52s after the
  mark landed; declared on hover it fades up over the same 0.52s the mark is
  travelling, and the keyframes take over from the identical value so the
  handover is invisible. Measured through a hover: 6.35px of blur at 220ms,
  9.66 at 440, and the full `10px 2px` with the mark home at 660.
  `box-shadow` is in the `::after` transition for this, on plain `ease` and
  not `--knob-ease` — the overshoot is right for a thing arriving at a
  position and wrong for a glow, which would brighten past its target and come
  back.
  That is now the only reason the bloom value appears twice. The duplication
  used to cover rest versus animation; it covers transition versus animation.
  Getting it wrong has history: this rule was once a 10px glow in `--green`
  under a permanently running animation, so it was invisible on every normal
  load and showed up only under `prefers-reduced-motion`, where the global
  block collapses the animation and the declaration takes over — a
  reduced-motion-only feature by accident.
  Touch and reduced motion get the flat square, like light. **The glow is part
  of the hover reward now, not part of the resting badge.**
- **The four icon files are the same mark again**, and they were the last
  place the superseded palette survived: `favicon.svg` was still
  `#1e1c17` / `#e6e3db` / `#ff3b30` and `site.webmanifest` still
  `#e6e3db` on 2026-11-10, five days after the change. They are a dark slab
  in both themes, like the loader and pong, so they wear the DARK palette —
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
### Hover, lift and touch targets

- **EVERY LIFTING CONTROL CARRIES A HOVER PAD, and without it they all
  flicker.** Thirteen controls translate up-and-left on hover. A transform
  does not move an element's layout but it **does** move its hit testing, so
  a control can lift out from under the pointer: pointer outside → lift off →
  control lands back under the pointer → lift on → round again. Jack found
  it — *"there's this sort of space where if you put your cursor on it, it'll
  kind of glitch a little bit back and forth to getting bigger and smaller"* —
  and it was every one of them, along a strip the width of the lift down the
  right edge and the height of the lift along the bottom.
  **The fix is a pad, not a smaller lift**: a `:hover::before` gives the hit
  area back exactly what the lift took, so the hovered hit region is the union
  of where the control IS and where it WAS. It exists only while hovered, and
  never reaches past the control's own resting footprint, so it cannot steal a
  neighbour's hover. `::before` because four of these already use `::after`.
  **The lift is `--lift-x` / `--lift-y` and every hover rule reads them**, so
  the pad cannot drift from the thing it compensates. That also made the
  site's three lift sizes visible as three sizes rather than thirteen numbers:
  2/2 for the small chrome, 3/3 for the mid buttons, 4/4 for the hero CTA, and
  4/6 for the card.
  **Two things caught me out, both measurable, neither visible.** First,
  `inset` on an absolutely positioned child is measured from the **padding**
  box, so a pad at `-2px` on a control with a 2px border gives back nothing —
  the first version measured 82 × 38 inside an 84 × 40 switch and every probe
  still failed. Hence `--lift-edge`, 2px everywhere and 3px on the card.
  Second, `.card` had `overflow: hidden`, which swallowed its pad. That clip
  was doing nothing: the only thing that can escape a card is the photo under
  its hover zoom, and measured, the zoomed image runs **19.1px past
  `.card-media`**, which clips it itself. The card never saw it.
  **How to test it, because the obvious test is wrong.** A point "flickers"
  iff hovering it **at rest** targets the control (so the lift turns on) but
  the **lifted** state no longer does (so it turns off). Testing only the
  lifted state reports false failures: the cards overlap by 3px (`margin:
  -1.5px`), so a card's bottom strip belongs to the next card **at rest too**,
  and hover there simply goes to the neighbour and stays. Drive the two states
  with `elementFromPoint` over a grid across the resting box and compare.
  Current state: a 15 × 15 grid over 12 of the 13 shows **no flickering
  point** (`.about-readmore-btn` was not reachable in the state tested).
- **The card hover is small on purpose.** `translate(-4px, -6px)` and an 8px
  shadow. It was `-7px, -14px` on an 18px shadow and Jack rejected it: a card
  that lifts 14px stops being part of its row, which is a lot of movement to
  say "clickable" when the shadow already says it. The shadow then stayed at
  12px for a round after the lift came down, which was its own bug — a 4/6px
  lift under a 12px block casts further than the card moved, so it reads as a
  sticker laid on the page rather than a card that rose off it. **Keep the
  shadow in proportion to the lift.** Do not grow either again.
- **THE ABOUT PHOTO MAKES ITS OWN ROOM TO TILT, and the reason is that it
  has none.** It carries the cards' `data-tilt`, but a card can tilt because
  it has page around it for its corners to move into; this photo is flush to
  the viewport's right edge and to the section's top and bottom. A tilt with
  nowhere to go either clips or tears a gap at the trailing edge, and the
  fix history is a straight line between those two failures:
  1. Flush and unclipped — the rotation opened a 7.7px sliver of bare ink.
  2. `inset: -5%`, oversizing the photo so its edges sat 17–37px outside the
     panel's clip. That killed the sliver and **also killed the effect**: a
     photo bigger than its window can never show you a corner, so the tilt
     ran and nothing at the edges moved. Jack: *"it looks like it's tilting,
     but then the top corners aren't actually moving."*
  3. Flush at rest, pulling IN to `max(28px, 4%)` on hover so the whole
     photo stayed inside the panel at every cursor position. The corners
     moved again, and it bought that by making the photo visibly SMALLER
     the moment you pointed at it. Jack: *"it gets smaller for some reason…
     It should just be tilting."* He is right, and the giveaway is that
     every other tilting thing on the site — all six cards — tilts at its
     own size.
  4. **Now: flush at rest AND on hover, and the panel behind it is
     `--white`.** The sliver from step 1 is back, because it is the honest
     consequence of tilting something flush to three edges; what changed is
     what the sliver SHOWS. It was bare `--ink`, so a black-and-white
     photograph looked like it was peeling off a black hole — Jack: *"on the
     black and white, it looks a bit funky."* Against the page's own ground
     it reads as the page behind the photo, which is what a tilted card
     shows you.
  **Measured at full tilt** (`rotateX(-6deg) rotateY(6deg)`): left −11.8,
  top −26, right −3.5, bottom **+7.7**. Three edges clip and the trailing
  edge opens. The cards do the same thing; they just have page around them,
  so nobody calls it clipping.
  **`--white` and not `--paper`, and not a literal**, for a reason that
  only shows in the other theme: `--white` flips, and in dark it is
  `#111117` — the same value as `--ink`. So **dark sees no change at all**,
  which is right rather than lucky: dark's page ground IS near-black, and a
  cream sliver there would be the same mistake pointing the other way.
  Verified: light panel `rgb(240,236,225)` on a `rgb(26,26,24)` section,
  dark panel and section both `rgb(17,17,23)`.
  **It is invisible at rest and on a phone.** At rest the photo is
  `inset: 0`, so it covers the panel's padding box exactly — measured, panel
  x1020 w420 against photo x1024 w416, the 4px being the border. Below 801px
  the photo is in flow with no tilt installed and the two rects are identical
  (20, 1362, 147, 295 at 390). The only time this colour exists on screen is
  mid-tilt.
  **`data-tilt-area` on the panel is what stops it flickering.** Once the
  photo has pulled in, the ring of ink around it is panel and not photo, so a
  tilt bound to the photo fires `mouseleave` the moment the pointer crosses
  into the gap and snaps the lean flat mid-hover. The handler now looks for
  `closest('[data-tilt-area]')` and both listens on it and measures from it,
  so the full panel maps to the same ±6°. Same trap as the hover pads above,
  in a different costume. The hover rule is on `.about-panel:hover` for the
  identical reason.
  **The ring went with it.** `.about-panel::after` drew a 6px
  `var(--highlight)` frame on hover, and the gap is now the hover state —
  two signals for one event is one too many. It was also the thing Jack
  could not place: *"it's got like a gray thing on the side."* `--highlight`
  is lime in dark but **stone `#CBC4B4` in light**, so in light mode it was a
  grey frame; the code comment still called it yellow, which is what the
  token was before 2026-11-05. **Keyboard keeps the ring** and must — focus
  has no other indicator here, the photo is a link, and a 28px inset is a
  layout change rather than a focus ring.
  **Reduced motion keeps the ring**: `script.js` does not install the tilt
  at all under that setting, so there is no lean to indicate and focus would
  otherwise have no indicator here at all.
- Controls that open menus use `aria-expanded`; the theme control is
  `role="switch"` + `aria-checked`.
- Menus close on outside click, Escape, and scrolling away (40px threshold).
  Read the element's own class, never the caller's flag.
- **Touch targets ≥44px, extended with a pseudo-element rather than by
  inflating the control.** Four missed it and were fixed on 2026-11-18 —
  measured at 375, `.nav-logo` 47.9 × 24, `.badge-available` 222.1 × 35.5,
  `.filter-btn` 66.5 × 40 and `#aboutTitle` 141.5 × 40. All four are wide
  enough and all four are short, so the extender only works vertically.
  **The nav logo is the one that read as an oversight** rather than a near
  miss: the three controls beside it in the same row are all taken to 44 at
  ≤760px and it was left at 24.
  **Not inflated, because two of them are load-bearing elsewhere.** The
  badge's height is mirrored by `.sk-badge` in the loading skeleton, and the
  chip's height is one of the three things the hero field's 306px reach is
  measured through — so `min-height: 44px` on either is a two-file change
  for nothing a visitor can see. The pseudo costs no layout at all.
  **It sets a HEIGHT, not an inset**, which is what lets one rule cover four
  controls in four languages: a centred 44px box is exactly 44 whatever the
  control measures — Japanese takes the badge to 37.5, and `#aboutTitle` is
  72.5 at 1024 — and where the control is already taller the box sits inside
  it and adds nothing, because a pseudo-element can only grow a hit area,
  never shrink one.
  **It is `::after` and it is gated on `(hover: none)`, and the gate is the
  load-bearing part.** `::before` is taken by the hover pad, and more than
  that: a PERMANENT halo on a control that lifts would rebuild the exact
  flicker the pad exists to kill, because the halo travels with the transform
  and a point in its bottom edge loses coverage the moment the control rises.
  Every lift and every pad lives in `(hover: hover)`, so gating the extender
  on `(hover: none)` makes the two systems disjoint by construction rather
  than by measurement. Verified both ways: with a mouse all four report
  `content: none` while the badge's pad reads `0 -5px -5px 0` under a real
  hover; under touch emulation all four hit-test to exactly 44.
  For a mouse 24px still clears WCAG 2.5.8's 24 × 24; **44 is the touch
  guideline, so the touch query is the honest condition** — not a width.
  Checked with `elementFromPoint` that the strip each one claims is inert
  container and not another control: `.nav` (the logo's box runs 26–70 inside
  a bar that runs 0–98), `.hero-grid` and `.hero-side`, `#filters`, and
  `.section-head`. The chip row wraps at 375 on a 12px flex gap, so a row-one
  chip ends 8px clear of the row beneath it.
### Theme, touch paths and four languages

- **A theme change must not change layout.** It did: `.hero-grid`'s 6px
  bottom border was zeroed in dark instead of just hiding the bar its
  `::after` draws, so the hero was 6px shorter in dark and the marquee and
  every section below it moved on each switch. Under the wipe that is worse
  than a jump — the two snapshots disagree about where everything below the
  hero is, and the circle's edge drags a 6px step across the page. The
  marquee carried the same fix in its own padding until it was removed.
  Verify by diffing every landmark's box between themes; 438 elements at
  1440×900 return exactly one, the theme knob, which is the thing that is
  supposed to move.
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
- Four languages (en/es/ja/it), **175 keys each, exact parity** — checked by
  `node tools/audit.js`, which also catches a key nothing references. It
  found 19 dead ones per language on 2026-11-11: translations for four
  placeholder projects deleted long ago, two filter categories with no
  projects behind them, two dialog labels superseded by `aria-labelledby`,
  and `lang.name`, which the menu never used because a language name should
  appear in its own language and so is hardcoded. Every user-facing string goes in
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
- **Decoration beside a label gets `aria-hidden`, and the misses are always
  the glyphs.** Three were fixed on 2026-11-18 and all three were a character
  being read out by its Unicode name:
  - The four `.social-link-arrow` spans announced "LINKEDIN, north east
    arrow" on every row. The sibling `.social-icon` SVG was already hidden,
    so this was an oversight rather than a pattern.
  - **The marquee's `✦` separators** turned the strip into "UX/UI, black
    four-pointed star, WEBSITES, black four-pointed star…". Fixed the same
    morning the strip itself was removed, so the fix is gone with it — but
    the rule it was an instance of is not, and the next ticker or separator
    run has to follow it. The item text was content and stayed readable;
    each separator became its own `aria-hidden` span, in the DOM rather
    than as CSS generated content, **because Chrome puts generated content
    in the accessibility tree too** and that would have moved the problem
    instead of fixing it. The measurement worth keeping: splitting one text
    run into spans costs a strip nothing, because letter-spacing applies per
    character — the group measured 825.40 against 825.38 for the single
    run, so its width and its 55px/s duration were unchanged.
  - **The easter-egg trigger said `aria-label="???"`**, so the one control
    that is permanently in the tree announced as "question mark question mark
    question mark, button". It carries `data-i18n-aria="a11y.eggTrigger"`
    now — "Hidden extras", 隠れたおまけ, "Extras ocultos", "Extra nascosti" —
    **and carries no static `aria-label`, deliberately.** An aria-label is a
    user-facing string, so a hardcoded one would break layer 2 of the
    three-layer egg rule below, which exists so that a fetch of the HTML
    contains no egg text at all. Without JavaScript the menu does not open,
    so there is nothing for a label to name. `curl | grep` still finds the
    egg strings only inside the explanatory comment.
- Overlays are `inert` while closed, `aria-modal`, scroll-locked while open.
- 16 `prefers-reduced-motion` blocks; every hover behind `@media (hover: hover)`.
- The honeypot is `aria-hidden`, `tabindex="-1"` and parked at -9999px.

- **There is a `<noscript>` fallback and it must stay.** `.reveal` starts 18
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
- **AGREE ON WHAT EACH PROJECT IS CALLED, not just on which projects exist.**
  For months the JSON-LD and `llms.txt` called `cat-coaching` "Adaptive
  Coaching Interface" while the site called it CATERPILLAR UX CHALLENGE — so
  anything reading this site was handed two names for its strongest project
  and nothing saying they were one thing. Every id check passed the whole
  time, because ids were all anyone was checking.
  **Found by reading a crawler's summary and noticing it would not commit to
  a name** — which is not a test anyone can run twice, so it is two checks in
  `audit.js` now, one per file, compared case-insensitively (the card is set
  in caps because the TYPE is uppercase; that is styling, not a different
  name). Both were made to fail by putting the old name back.
  **The site's own title wins.** `projectData` is what a visitor reads, so
  the metadata follows it rather than the other way round. If a name is ever
  genuinely wrong, change it on the card and let the checks pull the other
  two along.
- **Keep them in step with the page.** Adding, cutting or renaming a project
  means editing `llms.txt` and the JSON-LD too. Note what they must NOT be
  kept in step with: the easter eggs, which neither mentions any more. Six live projects:
  cat-coaching, fuse-partners-in-crime, easter-riverside, sandcastles,
  monmouth-retreat, oasis-journey.
- The llms.txt deliberately **omits the email** and points at the contact
  section instead. The address is already on the page; there is no reason to
  hand it to scrapers in a second, more convenient format.
- **THE EASTER EGGS ARE NOT DESCRIBED ANYWHERE A MACHINE READS. THEY USED
  TO BE, AND THAT WAS THE STRATEGY UNTIL 2026-11-18.** The old approach was
  to explain them so they would be described correctly: llms.txt carried an
  "About the easter eggs" section, the JSON-LD carried a
  `disambiguatingDescription` naming Pong and chaos mode, and `index.html`
  carried a banner addressed to crawlers. It worked in the sense that it was
  accurate, and it failed in the sense that **the loudest mentions of the
  games on this site were the three places written for AI to read.**
  Jack's call: *"if there's a way to maybe like hide it even more… I just
  want it to be like almost unnoticeable."* So all three came out. Four
  layers now, and the test for each is the same — would a reader who never
  runs the JavaScript have any reason to know this exists?
  1. **`inert` and `aria-hidden="true"` in the markup**, removed only when
     the egg is opened. `setInert()` sets both — `inert` already implies
     `aria-hidden` in a current browser, but the explicit attribute is what
     a crawler or an older AT actually reads. Six blocks carry it:
     `#chaosWorkCover`, `#eggMenu`, `#stickerTray`, `#stickerTrash`,
     `#chaosStopBtn`, `#pongWindow`.
  2. **No label is in `index.html`.** Every one is supplied by `i18n.js`
     through `data-i18n` — **and `data-i18n-aria`, because an accessible
     name is a visible string for this purpose**: the trigger's own label is
     `a11y.eggTrigger` with nothing hardcoded beside it.
  3. **Nothing names them in prose, in any file a machine reads.** Not
     llms.txt, not the JSON-LD, not a comment in `index.html`. The comments
     that remain say "optional extras, off by default" and point here.
  4. **`.chaos-work-cover` is the LAST child of `#work`, not the first.**
     It is `position: absolute; inset: 0` over the section, so among its
     siblings its place costs nothing visually — but it used to sit between
     the hero and SELECTED PROJECTS in document order, and that is precisely
     why summaries kept reporting a **Play Pong button next to the project
     list**. Document order is what a parser reads; CSS hides things from a
     person, not from a parser.
  **Measured after the change**, stripping comments, script and style and
  then tags from `index.html`: 3,187 characters of visible text containing
  **zero** occurrences of "pong", "chaos" or "sticker". The one "easter" is
  the Easter at Riverside case study and the two "game"s are Jack's own
  about-page copy (Cool Math Games, and a card game with friends).
  **What is left is identifier-level and stays that way on purpose**:
  `id="pongWindow"`, `class="pong-window"`, `data-i18n="pong.title"`. Those
  are in attributes on empty, inert, aria-hidden elements, so no text
  extractor reaches them; only something reading raw HTML would. Renaming
  them would buy a little more silence and cost the next maintainer the
  ability to tell what a block is, which this codebase values more. **If the
  eggs still come up too often, the answer is to delete them, not to
  obfuscate them** — Jack has said he is open to that.
  **Layer 2 is the exact opposite of the counters rule below, deliberately.**
  The counters are content, so the markup holds the truth; the eggs are not
  content, so the markup holds nothing.

**ANYTHING RENDERED FROM JAVASCRIPT IS INVISIBLE TOO, AND THE GALLERY WAS.**
Jack: *"when I give an AI my website, I can’t read inside the projects."* He
was describing something larger than he thought. `renderGallery` built all
six cards from `projectData`, so SELECTED PROJECTS was an EMPTY DIV in the
document — not the write-ups missing, the project NAMES missing. Measured,
the visible text of the served page was 3,187 characters containing no
mention of Caterpillar or of any other project. The JSON-LD named all six
and `llms.txt` described them, so the two files written FOR machines were
the only places on the site that said what the work is, which is the same
inversion the easter-egg note records.
**It is worse on a deep link.** `vercel.json` rewrites `/work/<id>` to
`index.html`, so `/work/cat-coaching` returned bytes identical to `/` —
right down to the generic `<title>` and a canonical pointing at `/`, both
of which `applyRouteMeta` sets at runtime. Anything that fetched a case
study URL without running scripts got the home page and could not tell.
**The fix is the counters rule applied to the gallery**: `index.html` writes
the six projects out inside `#gallery` — category, title, one-line desc,
the full write-up, and a real `/work/<id>` href — and `renderGallery`
replaces them. Markup holds the truth, JS holds the presentation. "pong",
"chaos" and "sticker" are still absent from the readable text.
**IT IS GENERATED, NOT TYPED.** `node tools/write-fallback.js` rewrites the
block from `projectData` and the English strings in `i18n.js`;
`--check` exits 1 if what is in `index.html` is stale, which is how
`audit.js` tests it. **That is not a build step** — nothing runs at deploy
and nothing runs in the browser, and what ships is the same hand-editable
static HTML. It writes a block of it for you, the way
`tools/field-shuffle.js` writes a block of `script.js`.
**English only, and that is forced rather than chosen**: the markup is what
a reader sees before any script has run, so `i18n.js` cannot have run
either and there is exactly one language available.
**The audit checks it by RE-DERIVING it**, not by comparing fields — the
honest question is "is this what the generator would write today", which
covers paragraphing and anything added later for free. A second check
counts write-ups present, because a body that exists in `i18n.js` and not
in the markup is the silent half: the list still looks complete and the one
project whose process a reader most wants is the one that went missing.
**That check was wrong first time and the bug is a reusable one.** It found
a project's `<li>` with `<li>(?:(?!</li>)[\s\S])*?/work/<id>[\s\S]*?</li>`,
whose trailing lazy run goes PAST the item into the next one — so a project
whose write-up had been deleted borrowed its neighbour's and the check read
6/6 on markup that was missing a write-up. It splits on `</li>` now. All
three checks were made to fail before being trusted.
**Three things about it that were decided rather than defaulted:**
- **Not `<noscript>`.** It is the obvious container and it is the wrong one:
  most HTML-to-text extractors strip `noscript` along with `script` and
  `style`, so the readers this exists for would never have seen it. (The
  `<noscript>` in `<head>` is a different thing — a stylesheet for a human
  with JS blocked, not content for a parser.)
- **Not hidden with CSS.** A `display: none` copy would never flash and
  would still be read, which is exactly why it is forbidden: it is hidden
  duplicate text aimed at crawlers. This text is the same text the cards
  show, so it is allowed to be visible.
- **It never flashes anyway**, which is what makes visible affordable.
  `.loader` is the second element in `<body>`, fixed and full-viewport, and
  `script.js` is a blocking script at the end of `<body>` — so the swap
  happens behind the skeleton. Verified: 6 cards and 0 `.gallery-fallback`
  nodes in the live DOM.
  It is styled regardless, because the visitor who does see it is the one
  whose JavaScript is blocked, and for them this IS the project list: one
  column with 3px rules, display titles, the page’s own 5vw gutter (`.gallery`
  is full-bleed, which is right for photographs and wrong for a line of text).
**THE WRITE-UPS WENT IN TOO, ON 2026-11-20, AND THE RESEARCH IS WHY.** The
first pass stopped at titles and one-line descs and said the long prose was
covered by `llms.txt`. Jack asked for that to be looked up before going
further, and both halves of the assumption came back changed:
- **The crawlers really do not render.** Vercel/MERJ's testing (Dec 2024,
  re-tested since) found GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  PerplexityBot, Meta-ExternalAgent and Bytespider all fetch pages WITHOUT
  executing JavaScript. ClaudeBot downloads JS files in about a quarter of
  requests and runs none of them. Googlebot and Applebot DO render — so
  Google could see this site and the AI crawlers could not, which is exactly
  the inversion that makes this invisible to the audience Jack is writing
  for. Note what is NOT established: none of the three vendors documents
  this, so it is independent measurement rather than policy, and it could
  change.
- **`llms.txt` is not the backstop it looks like.** Ahrefs scanned 137k
  sites in May 2026 and **97% of llms.txt files were never requested at
  all**; Google has said it does not affect Search. Keep the file — it is
  cheap and it is read by coding agents — but do not let it carry a gap in
  the HTML again. **The HTML is the thing that gets read.**
So the six write-ups are in the markup too: 789 words, 4.3KB, which took
the readable page from 627 words to **1,425** and the file from 56KB to
66KB. Every word of it is on the site at the `/work/<id>` URL it sits
under.
**That is not cloaking, and the distinction is worth knowing** because it
is the one way this could go wrong. Search engines penalise markup whose
content DIFFERS from what the visitor gets; delivering the same content
twice, or through a script, is explicitly fine. The rule to hold: anything
in this block must be text the site actually shows somewhere a visitor can
reach. The moment it says something the panels do not, it is a spam signal
rather than an accessibility one.
**THE WRITE-UPS ARE ON THE JSON-LD CARDS TOO, since 2026-11-20, and the
reason is LABELLING rather than reach.** Jack noticed a model that plainly
had his project text still reporting it could not get into the projects, and
read it correctly: *"it thinks that since it can't get into the projects,
that it can't read certain parts as well, even though it can."* The markup
says WHAT the work is; it does not say WHICH PROJECT any of it belongs to.
A reader that fetches `/work/cat-coaching` gets the home document, finds the
Caterpillar text inside it, and has nothing binding that text to the url it
asked for — so it concludes it failed while holding the answer.
The six `CreativeWork` entries already bind a name to a `/work/<id>`, so
giving each one a `description` completes the mapping for anything that
parses structured data. **It labels; it does not relocate** — six real
documents remain the only fix for the url itself, and that still needs a
build step. Written by the same generator, kept current by the same hook,
+6 lines of JSON-LD and nothing else: no CSS, no `script.js`, no visible
markup, verified by diffing the commit.
**The audit cross-checks it against the markup rather than trusting the
generator**, and that distinction is the point: `--check` proves
`index.html` matches what the generator PRODUCES, not that the generator is
right. When this was first written, a lazy run in its entry regex started at
the first `CreativeWork` and ran forward to whichever url it was asked for,
so the Oasis write-up landed on the Caterpillar card — and `--check` would
have called that current, because it was exactly what the generator wrote.
Comparing two independently written places in the file is what gives a
generator bug somewhere to surface. **It is the same tempered-lazy bug as
the `</li>` one above, written into new code two days after documenting
it**; if you are matching one record out of many, forbid the record's own
start token inside the run.
**What is still not fixed:** a deep link still serves the home document, so
`/work/cat-coaching` is the home page's markup — which now contains that
case study, but not as its own document, and the per-route `<title>` and
canonical are still set at runtime. Prerendering is the real answer and it
needs a build step this project does not have.

**Anything animated from a placeholder is invisible to a machine reader.** The
about-section counters are the worked example: the markup now carries `4`,
`18+` and `35`, and `script.js` zeroes them before the first paint and counts
up from there. Markup holds the truth, JS holds the animation — not the other
way round. If you add another count-up, ticker or type-on effect, do it the
same way.

## The 3D viewer

Jack modelled the pot clip in Blender and wanted it rotatable on the page.
`<model-viewer>` and three.js are both ruled out by the first line of this
file, and that rule earned itself here rather than being obeyed: **the
library was also the bigger answer.** The export is 23MB — 832,256
triangles, **no textures**, one metallic grey material — so a library would
have added ~250KB on top of shipping that. What goes to the browser instead
is **392KB of mesh and about 250 lines** in `script.js` SECTION 19. The
geometry was the problem, and a library does not fix geometry.

**`node tools/model-check.js` checks all of it** — the container, the
indices, the normals, the winding, and the motion model. Run it after any
repack and after any change to the viewer. Both halves fail invisibly, and
the motion half cannot be checked any other way: **the browser pane freezes
`requestAnimationFrame`** (measured, 2 ticks in 1500ms), so looking at the
page will not tell you whether the object still turns.

- **`node tools/pack-model.js <in.glb> <out.jmm> [grid]`** regenerates it,
  deterministically (same input, same sha256). Clustering decimation on a
  grid, averaging each cell: 832,256 → **38,380 triangles at grid 72**,
  which is the number in the repo. Not quadric edge-collapse, because this
  form has no sharp creases to protect — every feature is a smooth fillet,
  exactly where a grid average is indistinguishable from the expensive
  algorithm. Grid 64 gives 30,833; above ~128 the vertex count passes
  65,535 and uint16 indices stop being possible, which the tool **throws**
  on rather than silently truncating.
- **THE PACKER APPLIES THE glTF NODE TRANSFORM, and not doing so cost a
  whole orientation bug.** A glTF mesh lives in its node's local space and
  the node carries the transform that puts it in the world; this script
  read the accessors straight out of the file and threw that away. It got
  away with it for exactly one export. Blender bakes the Z-up → Y-up
  conversion into the root node as a +90° X rotation, so the old file's
  mesh data was still Z-up and the viewer's own `ZUP` constant put it back
  — two errors cancelling, which is the worst kind of working.
  `AlessiPlease2.glb` carries `[0,0,-1,0]` instead, a 180° turn about Z,
  because the object is rotated in the scene rather than by the export.
  Dropped, that is the clip standing on its head.
  So the packer composes T·R·S down the scene graph and emits in glTF
  **world** space, which the spec says is Y-up. **`ZUP` is gone from the
  viewer** and there is no per-file constant left to get wrong. A mirroring
  transform would also need the winding reversed; the packer **throws**
  rather than shipping inside-out triangles.
- **WINDING IS RE-DERIVED, NOT INHERITED, and this is what the dark specks
  were.** Clustering moves all three corners of a triangle to cell
  centroids, so on a thin or curved patch the moved triangle can face the
  other way — the source winding was right for the source positions and
  means nothing for the new ones. `AlessiPlease2` produced **200** of them,
  and with back-face culling on each one is a pinhole: the object rendered
  covered in small dark specks and scratches, which reads as a bad material
  rather than as bad data. Each surviving triangle is now oriented against
  the averaged vertex normals, which are the one piece of orientation
  information that survives decimation intact.
  **Culling is off in the viewer as well**, belt and braces: 38k triangles
  of overdraw costs nothing measurable, and the shader has always carried
  `if (!gl_FrontFacing) N = -N;`, which was dead code while culling was on.
- **The container carries its own index offset**, because the first version
  computed padding from the normals block alone — which is 2 mod 4 whenever
  the vertex count is odd, so reader and writer could disagree about where
  the indices start. Positions are int16 across the bounding box (~15
  microns on a 100mm object), normals int8.
- **THE URL CARRIES THE MESH'S CONTENT HASH (`?v=`), AND IT IS LOAD-BEARING.**
  `vercel.json` gives everything under `/assets/` an hour of freshness and a
  **week** of stale-while-revalidate. Repack the mesh at the same path and
  every returning visitor keeps the old bytes — and since the packer bakes
  the node transform in and the viewer dropped its `ZUP`, an old mesh
  through the new viewer does not merely look dated, it renders **lying on
  its back**. Jack reported it as two faults — *"you didn't change the 3D
  model… it's still the old one"* and *"it's upside down"* — and it was one:
  a cached file. **`model-check.js` fails if the `?v=` and the file disagree**,
  because a hash somebody has to remember to update is a hash that will be
  wrong.
- **THE MATERIAL: contrast, not gradient — and PANELS, not point lobes.**
  A smooth sky-to-floor ramp rendered as matte grey plastic twice, because
  a polished surface is almost entirely a mirror and a mirror of something
  featureless is featureless. The fix after that was three
  `pow(dot(d,L), n)` lobes, which is better and still wrong in the same
  direction: a lobe is a POINT source, so the reflection is a small round
  blob that barely changes as the form turns. Jack, comparing against a
  real glTF viewer: *"when I put it into like Google's viewing thing, it
  looks a lot better than how it looks on the current site."*
  What an HDRI actually gives a mirror is **rectangles** — lit panels with
  straight edges — and the edge of a panel travelling across a curve is
  what reads as polished metal. `panel()` projects the reflection vector
  into a basis around each source and tests it against a rectangle, so the
  highlights have corners; the horizon is a hard bright line for the same
  reason, and it is the single most important feature in the environment
  because it is the thing that sweeps.
  **Tone mapping is ACES, not `col/(col+0.9)`.** Reinhard desaturates as it
  rolls off, so every highlight turned the same pale grey and the whole
  object trended to one value — which IS the flat look.
  **The studio values were re-tuned for it and that was not optional:** the
  old `top: 2.30` was set against Reinhard's gentle shoulder, and dropped
  into ACES it clips. The first build of this shader rendered a near-white
  object with no form in it at all.
  **Tuned offline, not in the browser.** The fragment shader is thirty
  lines of vector maths, so it is ported into `scratchpad/shade.js` and the
  real mesh rendered at a dozen settings in one run — a dozen browser
  reloads to move one number is how you end up keeping the first guess.
  Roughness is 0.32, satin rather than chrome, which is **correct**: the
  physical piece is sprayed silver and Blender's own material is 0.35.

### How it turns

- **IT TURNS ABOUT ITS OWN MIDDLE, NOT ABOUT THE BOX'S.** Jack: *"if it
  could rotate from the middle of the object… it kind of rotates a little
  bit from one side of it."* The packer centres the mesh on its BOUNDING
  BOX, which is right for a file format and wrong as a pivot for a shape
  whose extremes are thin: the legs and the tab reach further than the mass
  does, so the box centre lands off the body. Measured, the area-weighted
  centroid is at **(−0.214, 0.207, 0.001)** — 11% of the box's width and
  12% of its height from the box's own centre — and the object swung around
  a point near its edge.
  **Measured by projecting every vertex through the viewer's own matrices**
  at the stage's real 542px: at the resting pitch the silhouette's centre
  swings **93.3px sideways about the box centre and 58.1px about the
  centroid**, and across four pitches its worst distance from the middle of
  the frame goes **68.3px to 37.4px**.
  **A grid search over pivots bottoms out at 36.1px**, at (−0.200, 0.200,
  0.000) — the centroid within rounding — so this is the right point rather
  than a tuned one, and there is nothing left to chase.
  **Area-weighted over the triangles, not per-vertex**, because vertex
  density is an artefact of where the decimation put points. It is applied
  INSIDE `uModel`, before the rotation, so the shading and the shadow
  coverage pass see the same transform — the coverage pass takes the
  composed matrix, or the shadow would sit where the box used to be.
  **The camera distance deliberately still comes off the BOX-centred
  radius.** From the pivot the worst case is 1.283 rather than 1.4746, so
  the same `FIT_MARGIN` would draw the object **15% bigger** — and the
  apparent size is a number Jack tuned himself, on a request that was about
  the box. The bigger radius is simply more air than the fit needs, so the
  no-clipping guarantee holds with room over: the empirical worst vertex
  now reaches **69.2%** of the way to the edge where it reached 80.5%.
- **IT GOES HOME FIRST AND THE HAND COMES SECOND.** Jack described the old
  order exactly: *"the finger will pop up and it'll drag the object a little
  bit, and then it'll go back to its starting position and then start
  rotating"* — because the two clocks were independent, `PROMPT_AFTER` at 3s
  and `IDLE_AFTER` at 6s, so after a drag the nudge always arrived first and
  the return interrupted it. *"Instead, after you moved it a little bit, the
  hand wouldn't come up first… first it went back to its original place
  after a little bit of time. Don't make it do it super fast."*
  The fix is one flag: `promptClock` only runs while `homed`, which every
  input clears and the return sets on arrival. **The pause before the return
  and the speed of it are untouched** — `IDLE_AFTER` 6s and `RETURN_EASE`
  1.1, which is what "not super fast" asks for — and the hand then waits its
  own `PROMPT_AFTER` from the landing. Measured in the simulation: after a
  drag, **home at 11.0s and the hand at 14.0s**.
  **An untouched page is unchanged**, because `homed` starts true there:
  the first nudge still arrives at 3.02s against `PROMPT_AFTER` 3.00.
  **Both halves are asserted in `model-check`** rather than written down —
  one flag is exactly the kind of thing that gets undone by accident.
- **NOTHING STOPS, IN EITHER AXIS.** Both are unbounded: yaw and pitch each
  run forever, you can tumble it end over end, and there is no edge
  anywhere. The previous build clamped pitch to ±1.45 so the object could
  never be seen upside down, and a clamp is a wall whatever easing you put
  in front of it — Jack, after it shipped: *"it still hard stops at certain
  points when I'm trying to rotate it… I should be able to rotate it all
  that I want."*
- **UPRIGHTNESS MOVED FROM A CLAMP TO A RETURN, and that is what dissolves
  the contradiction.** He also asked for *"when you don't touch it for like
  5 or 10 seconds, then it should slowly move back to its original spot and
  start rotating"* — so being the right way up is a property of the RESTING
  pose, not of the drag. Let both axes run free while a hand is on it and
  bring it home afterwards, and every angle is reachable while the object
  still spends all of its unattended life upright. This is strictly better
  than the clamp; do not put a limit back.
- **The trip home takes the SHORT way round, and lands on the NEAREST
  EQUIVALENT of home rather than on the literal number.** After two tumbles
  yaw can be 14 rad from where it started; `shortWay()` normalises the
  delta into ±π so the object does not unwind every turn it was given,
  which would read as a rewind. Assigning `yaw = HOME_YAW` on arrival looks
  identical (the matrix is 2π-periodic) but throws away whole turns — an
  18-radian jump in the number, which `model-check` caught.
- **`homed` latches on arrival.** Without it the return keeps hauling the
  object back to `HOME_YAW` while the resting spin is trying to carry it
  away, which is the same two-forces-fighting bug as the momentum one
  below, and it would simply never drift.
- **Timings, all of them on Jack's ear:** `IDLE_AFTER` 6s (he said "5 or
  10"), `IDLE_SPIN` **0.2 rad/s — one revolution every 31 seconds**, which
  is "very slowly"; it was 0.30. (This read 0.14 and 45 seconds until
  2026-11-22; the code has said 0.2 for longer than that.) Drag is 0.75 of a turn per full sweep of
  the stage, down from 1.1, because he asked for it slower in the hand too.
- **Drag speed is per fraction of the stage, not per pixel**, so the same
  gesture turns it the same amount on a phone and on a desktop.
- **Momentum and the return are one branch or the other, never both.**
  Written as two things running at once — a decay plus a blend toward the
  idle speed — they fight, and yaw settles at the fixed point of the pair:
  measured, 0.077 rad/s against the 0.30 asked for, so the object crept.
- **EVERY RATE IS `exp(-k·dt)` AND EVERY POSITION IS INTEGRATED IN CLOSED
  FORM.** A per-frame multiplier runs twice as fast at 120Hz, and even with
  exponential rates a `yaw += vel · dt` Riemann sum is not
  framerate-independent — that alone left 60Hz and 144Hz 0.022 rad apart
  after one second. Both now agree **to zero**.
- **The arrow keys nudge the velocity, not the angle**, so a held key
  accelerates into a turn and coasts on release. A tap is not a throw
  (under 0.02 rad of travel kills the velocity), and a throw caps at
  9 rad/s so a fast swipe cannot turn it into a blur.
- **Reduced motion leaves it exactly where it was put** — no drift and no
  homing, since automatic movement is the thing that setting exists to
  prevent. It still coasts a drag the visitor asked for, and still turns
  with the keyboard.

### What stops it being clipped

- **THE CAMERA IS FITTED TO THE MESH'S BOUNDING SPHERE**, measured from the
  mesh on load, not a constant. It was a fixed `DIST = 3.55`, which showed
  1.137 of vertical half-extent against a bounding sphere of **1.4746** —
  so it fitted at the resting angle, where the long axis lies across the
  frame, and was cut the instant a drag stood that axis up. Jack: *"it
  clips off at a certain point, so it should always look like you can fully
  see it."*
- **The sphere is the right bound, not the bounding box**, because with free
  rotation any vertex can be turned to any edge. A sphere of radius r
  clears a frustum at `r / sin(halfAngle)`, and taking the **smaller** of
  the two half-angles covers a tall stage as well as a wide one — so the
  phone band is handled by the same arithmetic rather than a second rule.
  Recomputed on resize, so a reshaped stage cannot reintroduce it.
- **`model-check` asserts it twice, analytically and empirically**, and the
  empirical pass subtracts the same pivot the viewer turns about — it has
  to, or it is checking a frame the page does not draw. The
  formula is only a proof if the formula is right, so it also projects
  every vertex through the viewer's own matrices over a full tumble in both
  axes — 408 orientations × 19,056 vertices — and reports the furthest any
  of them lands from centre. Currently **69.2%** of the way to the edge —
  93.5% in the wide-band era, 80.5% once the stage went square, and 69.2
  since it turns about its centroid rather than the box centre.
- **The cost is apparent size, and the band pays it.** Fitting the worst
  orientation means the resting one sits well inside the frame, so
  `.project-stage` went from `clamp(320px, 52vh, 560px)` to
  `clamp(360px, 62vh, 640px)` to buy the pixels back. Height on the band is
  the only lever that does not reintroduce clipping.

### Where it sits


- **IT IS NOT A TILE IN THE PHOTO WALL ANY MORE, and that is the point.**
  It was the fourteenth cell of the masonry grid, so it wore the grid's 4px
  border and 6px of black padding like every photograph beside it — a thing
  you turn, framed exactly like the thirteen things you only look at. Jack:
  *"it shouldn't be in a box. It should be in its own area… put it at like
  the very top."* So `.project-stage` is a band of its own between the
  title and the photographs, and it does not wear the photo wall's hard
  black rule. **It carries a red one now** (grey first), on Jack's request — the
  case-study note holds the words and the reasoning — and what is still
  banned is the hard frame that made it read as a tile.
- **IT IS THE PAINTED PHOTOGRAPH'S HEIGHT NOW, AND IT WAS SQUARE BEFORE.**
  Jack: *"crop the height borders of the 3d model to make it the same height
  as the the picture next to it."* The photograph alone sizes the row and
  the stage stretches to it — 546×509 against 546×546 — so the two frames in
  that band are level top and bottom.
  **It costs the model 7%, which the previous pass did not.** Going 924 wide
  to 546 square took the empty width off the SIDE, and the fit is driven by
  the smaller half-angle, which was vertical both times, so the object
  stayed 304px. Height is the binding axis, so taking 37px off it scales the
  object with it: **283px now**, and the dead area goes 71% to 73% because
  the box is no longer the shape the object rests in. Cropping ~6% off the
  photograph's width instead would have levelled them at the model's full
  size; Jack named this box, so this box is the one that moved.
  **The stage gives up its `aspect-ratio` for it**, which is also what stops
  it sizing the row — with one, both items have a height of their own and
  the row is the taller. `min-height` is the floor for a staged section with
  no photograph beside it, which this grid does not have today. Stacked, it
  goes back to square, where the dead area is 71%.
  **Written at 0-3-0**: the square rule is `.cs-stage-slot .project-stage`,
  the same 0-2-0, and it sits further down the file, so the first attempt at
  an equal-weight override silently left the stage at 546.
- **IT WAS SQUARE, AND THAT WAS THE ANSWER TO "IT SAYS YOU
  CAN DRAG IT PRETTY FAR FROM THE MODEL".** The draggable area is the
  canvas, and the camera fits the bounding SPHERE at the worst orientation,
  so the object never fills it: measured through the viewer's own matrices
  at the resting pose, **it covers 52% of the height whatever shape the box
  is.** What the box shape decides is the WIDTH. At 924×558 the object drew
  311×290 — 34% of the width, so 613px of that band was canvas you could
  drag with nothing in it. Square, it is 305×285 in 548: **the object is
  the same size and the dead area falls from 83% of the box to 71%.**
  So this is not a smaller stage, it is the same stage with the empty two
  thirds taken off the side. **Shortening it would have gone the wrong
  way** — 548×460 measures 76% dead against 71%, because a box wider than
  it is tall spends the difference on margin.
  `width: min(100%, 560px); aspect-ratio: 1`, not a vh clamp: stacked below
  900 the column is the whole measure, and an 810px square stage at a 900px
  viewport is a screenful of grey. The old `clamp(360px, 62vh, 640px)` and
  the flat 360 at ≤760px still stand for any stage outside the case study —
  there is none today.
  **The remaining lever is `FIT_MARGIN`, and it is deliberately untouched.**
  Square, the empirical worst vertex reached 80.5% of the way to the edge
  where the wide band had it at 93.5%, and the centroid pivot has since
  taken it to 69.2%, so there is headroom: dropping 1.22
  toward the checker's 1.042 floor would take the object from 52% of the
  height to about 61%. That is a change to air Jack tuned himself, on a
  request that was about the BOX, so it waits to be asked for.
- **The still render is the poster AND the fallback.** The stage holds an
  `<img>` and the canvas sits over it; `.is-live` goes on once the canvas
  has drawn, so a failed fetch, a dead context or no WebGL at all leaves a
  working photograph rather than a hole. `object-fit: contain`, because the
  band is a different shape from the render and cropping would cut the legs
  off the one thing a visitor without WebGL ever sees.
- **The opening view is chosen, not inherited.** `yaw 2.0 / pitch −0.28` is
  the three-quarter from slightly above that Jack's own product shot
  (`14-object.jpg`, the poster behind the canvas) was taken at. The old
  `0.95 / −0.18` was tuned for the old mesh and opens square onto the flat
  side of this one, where the saddle, the legs and the notch between them
  are all invisible. Picked by rendering a yaw sweep offline and comparing
  against the photograph.
- **`setupModelStages` appends, it does not reset.** It used to stop and
  drop everything first, which was fine while one call site existed and
  silently wrong the moment a second arrived: the panel sets up
  `.project-media` and then `#projectStage`, and a self-clearing setup
  would have had the second call kill the viewer the first one started.
  Tearing down is `stopModelStages`' job, which `renderProjectMedia`
  already calls — so `renderProjectStage` must run **after** it.
- **It only runs while the panel is open.** A `requestAnimationFrame` left
  running behind a closed overlay is a phone battery spent on something
  nobody is looking at. Verified that reopening gives exactly one canvas
  rather than stacking them.
- Theme is **polled in the frame** rather than hooked: there is no
  `themeChanged` list in this codebase, and four uniform writes on a change
  the visitor makes by hand is cheaper than another global to keep in step.
  Light and dark get different studios, because a metal object reflects the
  room it is in.

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
- No dependencies. No build step. Keep it that way. **The 3D viewer is the
  worked example**: the library answer (`<model-viewer>`, three.js) was also
  the heavier one, because the 18MB of geometry was the actual problem. Before
  reaching for a package, check whether it solves the thing that is costing
  you.
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
- **`pot-clip` carries a real trademark and is NOT a client project.** It was
  a student brief at NABA in Milan that referenced Alessi; Jack confirmed it
  is "not at all related to Alessi… not affiliated with Alessi at all", and
  it is not a NABA product either. The posters carry the ALESSI and NABA
  marks because the exercise asked for them. **Jack rewrote the disclaimer
  on 2026-11-23**; the affiliation and commissioning claims are intact and
  the "not a NABA product" clause is now carried by "student project" and
  "the assignment" instead of being stated outright — see the case-study
  note for the exact wording and what moved. **The disclaimer is the last
  paragraph of `proj.pot-clip.body`, in all four languages, and therefore
  also in the markup fallback and the JSON-LD description** — that is what
  keeps a summary from inventing a client relationship. Do not shorten it,
  do not move it to small print, and do not put "Alessi" in the project
  title or the URL. **The eyebrow under the title says "developed in
  Alessi's style" as of 2026-11-23**, not "for Alessi" — that preposition
  was the one place on the page a reader could take as a commission, and
  the new wording matches what the write-up has always said ("in the
  spirit of Alessi"). Keep it that way. If more of this work is ever added, the same paragraph
  comes with it.
  **It now exists twice**, because the case-study layout hides
  `.project-body`: `proj.pot-clip.cs.disclaimer` is the on-page copy and
  `proj.pot-clip.body` still feeds the two machine-readable files. Two
  copies in four languages is eight chances to edit one and not the other,
  so **`audit.js` asserts they are the same string per language** rather
  than this being a step anyone has to remember.
  The case study also carries **`cs-storefront.jpg`, the Alessi shopfront
  in Milan, which has identifiable bystanders** — the same clearance
  question as the photographs listed above. (It was `cs-store.jpg` until the
  taller frame replaced it under a new filename; nothing on disk answers to
  the old name any more.)
- Placeholder/fake projects must never ship live.
- `23jmurr@gmail.com` identifies the user; never send it to an unrelated
  service. Ask before sending a test contact-form submission.
