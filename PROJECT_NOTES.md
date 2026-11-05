# PROJECT_NOTES.md

Status log for the Jack Murray portfolio. Design rules live in `CLAUDE.md`.

**Last updated:** 2026-11-05

---

## Where it stands

Live at **jackmurraydesign.com** on Vercel. Apex + www resolve, HTTPS is good,
redirects work. The build is clean: no console errors, no horizontal overflow
at 320/375/1024/1440, zero WCAG AA contrast failures in both themes across the
home page, a project overlay and the about page.

**The site's engineering is in good shape. The gap is content.**

---

## Done

**Hosting / infrastructure**
- Migrated Netlify → Vercel (Jack's choice: he wanted to learn Vercel). No
  downtime. DNS at Porkbun; Vercel's values are project-specific
  (`216.198.79.1`, `203398039dea6086.vercel-dns-017.com.`) — the `76.76.21.21`
  in most tutorials is legacy and will fail.
- `vercel.json` ports the old security headers + asset cache policy.
- `.vercelignore` is **root-anchored** (`/docs/`, not `docs/`). It takes
  gitignore-style patterns, so an unanchored `docs/` matched `assets/docs/`
  and 404'd the live resume while it sat in the repo. Keep the anchors.
- Contact form is `api/contact.js` → Resend. Honeypot, validation, 5000-char
  cap. **Constraint:** the shared `onboarding@resend.dev` sender only delivers
  to the address on the Resend account. A custom domain sender would lift that.
- Removed the "Powered by Netlify" badge by leaving Netlify (hiding it was a
  paid feature — the docs omit that; the GitHub thread saying so was right).

**Design / build**
- Full repalette to warm ivory + coral/dusty-blue (light) and near-black +
  pink/electric-blue/lime (dark). `--yellow` renamed `--highlight`.
- Hero rebuilt: typewriter → standing "UX DESIGNER & DIGITAL CREATIVE.",
  no divider rule, CTA on a permanent accent block, marquee as a seam with
  SELECTED PROJECTS visible beneath it.
- Dark/light became a **switch** (`role="switch"`), theme applied pre-paint.
- Language control is the translate mark; state lives in the menu.
- Cards read as one pressable object (media badge + action bar + press/focus
  states). Hover lifts to `translate(-7,-14)` with an 18px shadow.
- Marquee: full-bleed, 38px, off-white light / lime dark, 55 px/s.
- Mobile pass: overflow, sticky-hover, timeline rail, skeleton loader, scroll
  restoration, menu dismissal, touch targets, magnetic headline on touch.
- Fixed an iOS compositing bug where a `translateY(100%)` overlay leaked
  through — `visibility` with a delayed transition, not transform alone.
- About photo is back to the Milano Centrale train shot (918×1600, sharp on
  Retina; the Dolomites file was 676px and soft).

**Removed deliberately**
- The colour-vision simulator. It simulated CVD rather than accommodating it —
  useful to a designer, useless to a colour-blind visitor, who would use an OS
  setting anyway. The real accommodation (never using colour as the only
  carrier of meaning) was already in place. **Settled; don't rebuild it.**

---

## Open — content (the real gap)

1. **The two Caterpillar sentences.** What the research found, and what round 2
   changed. Only Jack has these.
2. **The Bradley redesign.** The only thing that would give him a second real
   UX case study. Not started.
3. **Caterpillar confidentiality** — professor emailed ~2026-10-22, still no
   reply after ~2 weeks. Worth a nudge. Until it lands, CAT Figma frames and
   research artifacts stay out.

## Open — small / mechanical

4. **FortiGuard submission.** Jack's school network blocks the domain as
   uncategorised. Submit at `fortiguard.com/faq/wfratingsubmit`.
5. **VoiceOver pass.** Markup is correct (landmarks, labels, focus order, alt
   text) but has never been *heard*. Jack would need to drive it — `Cmd+F5`.
   This is the one genuine accessibility gap left.
6. **Placeholder artwork still uses old-palette hexes** — the masonry gallery
   placeholders (`generatePlaceholderSvg`) and the OASIS video SVG in
   `script.js`. Left alone on purpose: that's stand-in *project artwork*, and
   recolouring it is Jack's call.
7. **Language menu has no scroll-dismiss.** It's wired separately inside
   `i18n.js` while the egg menu uses the shared watcher. It never orphans (its
   trigger rides in the fixed nav), so this is consistency, not a bug.

## Open — needs a decision from Jack

8. ⚠️ **Before cancelling the old WordPress hosting**, confirm the
   eNom/hoster911 *domain registration* is separable from the hosting plan.
   Cancelling the wrong line item could drop the domain.

---

## Working agreements

- Jack pushes his own commits; the shell here can't authenticate to GitHub, so
  `origin/main` may read stale. Verify against the GitHub API, not the local ref.
- He responds well to being told when he's right and when a suggestion won't
  work — several good calls of his (the marquee not being full-width, the
  dark-mode switch looking wrong) were real bugs found by eye.
- He wants reasoning, not just output. Explain the *why*, including when the
  answer is "don't build that."
- Reference images he supplies are **direction only** — he has said explicitly
  that generated mockups contain elements that should not be copied.

## Mistakes worth not repeating

- Claimed a Netlify feature was free without checking the plan gate.
- Shipped an unanchored `.vercelignore` pattern after having fixed the exact
  same trap in `.gitignore` — carry fixes across files.
- Removed sticker-dragging on mobile from an untested assumption.
- Over-cropped the team photo after flagging the loss, then shipping it anyway.
- Repeatedly misread the browser pane's frozen transitions as site bugs. See
  the warning in `CLAUDE.md`.
