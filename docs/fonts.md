# Fonts

Self-hosted from `assets/fonts/`. Nothing on the site reaches a third party.

## Why

Before: one `<link>` to `fonts.googleapis.com` for Anton, Archivo Black,
Space Grotesk (400/500/700) and Noto Sans JP (400/500/700/900).

Measured on the English page:

| | before | after |
|---|---|---|
| third-party requests | all of them | **0** |
| render-blocking font CSS | **119 KB** | 0 (rules are in styles.css) |
| `@font-face` declarations parsed | 510 | **6** |
| font files fetched | 5 Latin + **26 Japanese subsets** | **3** |
| font bytes | ~340 KB | **43.1 KB** |

Three things were going wrong.

1. **Asking for Noto Sans JP pulls 496 `@font-face` blocks into the
   stylesheet.** That is where the 119 KB came from, and every visitor
   downloaded it render-blocking regardless of the language they read.
2. **The English page was downloading 26 Japanese font subsets.** `← → ↗`
   are not in any Latin subset's `unicode-range`, so they fell through the
   stacks to Noto Sans JP, which does cover them. They now render from the
   system font, which is indistinguishable for an arrow.
3. **Space Grotesk was downloaded three times.** Google serves 400, 500 and
   700 as three URLs holding byte-identical files (same md5) — it is one
   variable font. One file now, declared `font-weight: 400 700`.

## What ships

| file | subset | notes |
|---|---|---|
| `space-grotesk-latin.woff2` | latin | variable 400–700, preloaded |
| `space-grotesk-latin-ext.woff2` | latin-ext | variable 400–700 |
| `archivo-black-latin.woff2` | latin | preloaded |
| `archivo-black-latin-ext.woff2` | latin-ext | |
| `anton-latin.woff2` | latin | `.magnetic-text` only, below the fold |
| `anton-latin-ext.woff2` | latin-ext | |
| `jp/noto-sans-jp-NN.woff2` × 48 | Japanese | variable 400–900, ~1.07 MB |

No `vietnamese` subsets: there is no Vietnamese content in any of the four
languages.

**Japanese loads on demand.** `assets/fonts/noto-sans-jp.css` is attached by
`ensureJapaneseFont()` in `i18n.js` the first time Japanese is selected. It
is called from `apply()`, not `set()` — `set()` returns early when the
language is already current, which is exactly the case on first load for
someone whose saved preference is `ja`. A Japanese visitor fetches ~743 KB
across 35 subsets, the same as Google would have served them.

## Regenerating

The 48 Japanese subsets are the ones whose `unicode-range` intersects the
characters that actually appear in `i18n.js`'s `ja` strings — 626 of them,
spanning 48 of Google's 124 buckets. If the Japanese copy changes enough to
introduce a new character, a glyph can go missing. To redo it:

1. Pull the character set out of the `ja` block of `i18n.js`.
2. Fetch `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400..900&display=swap`
   with a modern browser User-Agent (without one Google serves ttf, not woff2).
3. Keep every `@font-face` whose `unicode-range` intersects that set,
   download its `.woff2` into `assets/fonts/jp/`, and rewrite
   `assets/fonts/noto-sans-jp.css` with local `url()`s and the same ranges.

`docs/tools/jpvar_faces.json` records the current selection: file name,
`unicode-range` and byte size for each of the 48.

## Licensing

All four are SIL Open Font License 1.1, which permits self-hosting and
redistribution. That is the whole point of doing this: serving Google's
copies hands every visitor's IP address to Google, which is what the
*LG München I* ruling (3 O 17493/20, January 2022) found unlawful without
consent under GDPR. Self-hosted, there is no transfer to consent to.
