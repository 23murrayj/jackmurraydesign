# PROJECT_NOTES.md

**Where the site stands, and what is still open.**

This file holds *state*. `CLAUDE.md` holds *rules* — why things are the way
they are, and what not to break. Keeping them apart is deliberate: the two
used to overlap and drifted into contradicting each other (this file still
described the card hover as `translate(-7,-14)` with an 18px shadow five days
after Jack rejected that and it became `-4,-6` on 8px). **If a fact about how
the site should look belongs anywhere, it belongs in CLAUDE.md, not here.**

**Last updated:** 2026-11-10

---

## Where it stands

Live at **jackmurraydesign.com** on Vercel. Apex + www resolve, HTTPS is good,
redirects work.

Measured on 2026-11-10, not asserted:

| Check | State |
|---|---|
| WCAG AA contrast | 0 failures, light + dark, at 1440 and 375 |
| Horizontal overflow | none at 375 or 1440 |
| Console errors | none |
| Dead CSS classes | 0 of 233 |
| Unused CSS custom properties | 0 of 28 |
| Uncalled functions in `script.js` | 0 of 77 |
| Unused i18n keys | 0 of 199 |
| i18n parity | 199 keys × 4 languages, exact |
| Project list in sync | `projectData` / `sitemap.xml` / `llms.txt` / JSON-LD all agree on the same 6 |
| WebP invariant | 50 inline JPEGs, 50 WebP siblings |
| `debugger` / `console.log` / TODO left in source | none |

**The engineering is in good shape. The gap is content**, and that has been
true for a while now.

---

## Open — content (the real gap)

1. **The two Caterpillar sentences.** What the research found, and what round
   two changed. Only Jack has these.
2. **The Bradley redesign.** The only thing that would give him a second real
   UX case study. Not started.
3. **Caterpillar confidentiality** — professor emailed ~2026-10-22, no reply.
   Worth a nudge. Until it lands, CAT Figma frames and research artifacts
   stay out.

## Open — worth doing, ranked

4. **The contact form still sends from Resend's sandbox.**
   `onboarding@resend.dev` only delivers to the address on the Resend
   account. On a site whose entire job is getting a stranger to make contact,
   that is the highest-consequence open item here: a recruiter's message can
   be accepted by the form and never arrive. Fix is a verified domain sender
   in Resend, then one line in `api/contact.js`.
5. **The 29 `-full` lightbox JPEGs are 20MB and have no WebP.** Every other
   inline image was converted; these were skipped because a `<picture>`
   cannot drive a lightbox swap — the format choice has to be made in JS
   (`Image.prototype.decode` probe, or a one-time `createImageBitmap` test).
   Worth doing if the lightbox ever feels slow; it is the single biggest
   remaining byte cost on the site.
6. **VoiceOver has never actually been run.** The markup is correct —
   landmarks, labels, focus order, live region, alt text, a real focus trap —
   and it has been verified by driving the page, but never *heard*. Jack has
   to do this one (`Cmd+F5`). It is the one genuine accessibility unknown.
7. **`.layout-single` and `.layout-gallery` are supported but unused.** All
   six projects use `mixed`, `video` or `masonry`, so those two are the
   least-tested paths in the overlay. Not a bug — just know they are
   unexercised before relying on one.
8. **Placeholder artwork still uses superseded-palette hexes** —
   `generatePlaceholderSvg` and the OASIS video SVG in `script.js`. Left
   alone on purpose: that is stand-in *project artwork*, and recolouring it
   is Jack's call. It is the only place old hexes remain.
9. **The language menu has no scroll-dismiss.** It is wired separately inside
   `i18n.js` while the egg menu uses the shared watcher. It never orphans —
   its trigger rides in the fixed nav — so this is consistency, not a bug.

## Open — mechanical

10. **FortiGuard submission.** Jack's school network blocks the domain as
    uncategorised. Submit at `fortiguard.com/faq/wfratingsubmit`.
11. ⚠️ **Before cancelling the old WordPress hosting**, confirm the
    eNom/hoster911 *domain registration* is separable from the hosting plan.
    Cancelling the wrong line item could drop the domain.

---

## Settled — do not rebuild

- **The colour-vision simulator.** It simulated CVD rather than accommodating
  it — useful to a designer, useless to a colour-blind visitor, who would use
  an OS setting anyway. The real accommodation (never using colour as the
  only carrier of meaning) was already in place.
- **The typewriter tagline** and the "Research-led interfaces…" line. Cut
  under the brief's "avoiding unnecessary descriptions".
- **A keep-out for the hero shape field.** Tried, measured, rejected — it
  collapsed the field into one corner on a phone. See CLAUDE.md → Animation.
- **A fifth hero shape form.** Arc, bar and cross were built and cut the same
  day. Variety there comes from size and fill. See CLAUDE.md.
- **The squircle.** Two hero squares carried a 28% corner radius for a few
  releases, on the argument that a modifier is not a new form. Cut
  2026-11-11 — "I don't love the rounded squares anymore". The vocabulary
  is four hard-edged forms with no exceptions.

---

## Working agreements

- **Finish, commit, report — never ask.** Jack pushes his own commits; the
  shell here cannot authenticate to GitHub, so `origin/main` may read stale.
  Do not end a turn with "shall I commit?" or "want me to push?".
- He responds well to being told when he is right and when a suggestion will
  not work. Several good calls of his — the marquee not being full-width, the
  dark-mode switch looking wrong, the three new shapes not fitting — were
  real problems found by eye.
- He wants reasoning, not just output. Explain the *why*, including when the
  answer is "don't build that."
- Reference images he supplies are **direction only** — he has said
  explicitly that generated mockups contain elements that should not be
  copied.

## Mistakes worth not repeating

- Claimed a Netlify feature was free without checking the plan gate.
- Shipped an unanchored `.vercelignore` pattern after having fixed the exact
  same trap in `.gitignore` — carry fixes across files.
- Removed sticker-dragging on mobile from an untested assumption.
- Over-cropped the team photo after flagging the loss, then shipped it anyway.
- Repeatedly misread the browser pane's frozen transitions as site bugs. See
  the warning in `CLAUDE.md`.
- **Let comments rot.** The 2026-11-10 audit found 28 stale factual claims in
  comments — most of them counts left behind when the hero field went from
  nine shapes to twelve, including one that read "NINE, not twelve" after the
  answer had become twelve. The code was correct throughout; only the prose
  describing it was wrong, which is the kind of error that survives review
  and misleads the next reader. **When a number in a comment stops being
  true, fix the comment in the same commit.**
- **Audited a count with `grep` instead of running the page.** The same audit
  nearly "corrected" a true statement — `.reveal` is on 19 elements at
  runtime, but only 16 appear in the markup because `renderGallery` adds the
  rest. Count things where they happen.
