# Research notes — brutalist / portfolio patterns

Collected 2026-10-29 while reworking the About section. Each item is checked
against this codebase, so "we do / we don't" is verified, not assumed.

Caveat worth keeping in mind: most of what's written about neo-brutalism is
agency and tool-vendor blog content with a commercial stake in the style.
NN/g is the only source here that runs actual usability research. I've marked
which is which, and nothing below is a measured result from real users.

---

## 1. The style's core recipe — we already match most of it

Sources converge on three mechanics: thick borders (2–5px), **zero-blur
offset shadows**, and flat saturated fills with no gradients. Headings at
700–900 weight, 2–3x body size.

- ✅ 2px borders throughout, hard offset shadows on every button, flat fills,
  no gradients. The display face at 73.6px over 33.6px body is ~2.2x.
- ✅ The About CTA's 9px yellow slab is exactly the canonical device.

**One variant we don't use.** The canonical neo-brutalist press is the
*opposite* of ours: on click the button translates by exactly the shadow
offset while the shadow collapses to zero, so it reads as physically pressed
into the page. Ours lifts away instead (`translate(-3px,-3px)` + a longer
shadow) on `.btn-block`, `.form-submit`, `.cv-download-btn` and the About CTA.

Not a defect — lifting is consistent across the whole site, and consistency
beats canon. But a *press on `:active`* would be a nice extra layer and costs
about four lines. Worth trying, not urgent.

## 2. NN/g's rules — two we're arguably breaking

[NN/g, Neobrutalism: Definition and Best Practices]

| Rule | Us |
|---|---|
| Meet text-contrast standards; bold is no excuse | ✅ measured throughout; the About hover defect (2.01:1) is fixed |
| Generous padding around thick borders, ~24–32px | ✅ CTA is 24px 40px |
| Keep interactive elements recognizable | ✅ |
| Reserve expressive type for headings, neutral face for body | ✅ display face for headings/numbers, body face for prose |
| Use size **and** colour intensity for hierarchy | ✅ this is what the last pass fixed |
| Don't let the aesthetic obscure the CTA | ✅ was broken, now fixed |
| **Limit to 2–3 bold high-contrast colours** | ⚠️ we define **four** |
| Don't rely on shadows alone to signal interaction | ⚠️ worth a check |

**The palette one is the real finding.** `styles.css` defines `--accent`
(red), `--yellow`, `--blue`, `--green`. Red and yellow are doing structural
work. Blue and green are decorative — hero shapes and the "open to work" dot.
That may well be fine, since they never carry meaning, but it's worth an
explicit decision rather than drift. If blue and green only ever appear as
confetti, consider whether they earn being in the token set at all.

## 3. Where brutalist sites usually fail

Every critique lists the same failure modes. Checked each:

- Low contrast / tiny text → ✅ we measure
- Hidden navigation → ✅ nav is a plain visible list
- Weak hierarchy for assistive tech → ✅ semantic headings, section landmarks
- Broken keyboard flow, thick borders swallowing focus → ⚠️ **worth an audit
  pass.** We have `:focus-visible` in places, but I haven't tabbed the whole
  page end to end. Specifically: the project filter buttons, the lightbox,
  the language menu, and the About overlay's close.
- Ignoring reduced-motion → ⚠️ **partial.** The About CTA and the photo ring
  respect it. The marquees, the reveal animations, the custom cursor and the
  counters do not, as far as I've checked. This page has a lot of motion.
  A single `@media (prefers-reduced-motion: reduce)` block that pauses the
  marquee and disables reveal transforms would close most of it.

## 4. Portfolio content — the gaps

This is where the research is most actionable, and it's not about styling.

**Recruiters reportedly spend ~2–5 minutes on a portfolio.** Skimmability
beats completeness. Repeated findings:

- **Lead with work, not text.** Several sources say show your best project
  above the fold and avoid long intros. ⚠️ Our fold is name + tagline + a
  marquee; the first project needs a scroll. Worth testing a single featured
  project preview in the hero's right column.
- **Decisions and trade-offs are the most important part of a case study and
  the most often skipped.** Projects carry `role`, `year`, `type` and a
  `desc`. ⚠️ No explicit *problem → what I did → outcome* spine, and no
  stated outcomes. This is the single biggest content gap.
- **A scannable overview box** at the top of each case study — Role, Goal,
  Key Outcomes — with metrics where they exist. ⚠️ We have the sidebar; it
  isn't structured this way.
- **Consistent headings across every case study.** ⚠️ Worth auditing; ours
  vary by project.
- **3–5 strong case studies beats many shallow ones.** ✅ we have 6, which is
  right at the top of the range — an argument for depth over adding more.
- **Order by recency** to signal you're currently active. ⚠️ Ours is
  deliberately interleaved by category so the filter visibly changes. That
  was the right call for the filter, but it does mean newest isn't first.
  Worth revisiting once there are more projects per category.
- **Resume and contact within ~5 seconds / 2 clicks.** ⚠️ Contact is in the
  nav ✅, but the resume lives only inside the About overlay — click ABOUT,
  then scroll, then download. Consider a resume link in the footer at least.
  (Deliberately *not* in the About section: it was competing with the thing
  we want clicked. The footer is a different matter.)
- **Social proof — client names, a testimonial with attribution.** ⚠️ We have
  none. Real names attached to Easter/Riverside and FUSE would be strong,
  though that needs their permission.
- **Don't put important information only in hover states.** ⚠️ Worth checking
  the project tiles on touch.

## 5. Things explicitly worth NOT doing

- Don't use the condensed display face for paragraph text — several sources
  flag this specifically, and it's a real temptation on a site with a strong
  display face. We already don't.
- White text on bright fills often fails contrast; black on yellow usually
  passes. Relevant if a yellow button is ever tried again — it'd need the
  dark ink label, which is what the test build used.
- Don't pair vibrant hues that fight, e.g. yellow against cyan. We have both
  `--yellow` and `--blue` in the token set; they currently never touch.

---

## Suggested order of work

1. Reduced-motion pass — cheap, and this page moves a lot.
2. Keyboard/focus audit end to end.
3. Case study spine: problem → what I did → outcome, consistent across all 6.
4. Resume link in the footer.
5. Decide consciously about blue/green in the palette.
6. The Bradley redesign case study (already flagged — it's on the resume and
   absent from the site).

## Sources

- [NN/g — Neobrutalism: Definition and Best Practices](https://www.nngroup.com/articles/neobrutalism/) — the only usability-research source here
- [UX Design Institute — What hiring managers look for in a UX portfolio](https://www.uxdesigninstitute.com/blog/hiring-managers-ux-portfolio/)
- [myUXacademy — UX Portfolio Guide: Structure & Strategy](https://myuxacademy.com/blog/ux-design-portfolio-guide/)
- [Slickplan — UX Portfolio Examples 2026](https://slickplan.com/blog/how-to-create-a-ux-design-portfolio)
- [UXPin — UX Portfolio Examples](https://www.uxpin.com/studio/blog/ux-portfolio-examples/)
- [Learn UI Design — How to Create a Great UX/UI Portfolio Home Page](https://www.learnui.design/blog/great-ux-ui-portfolio-home-page.html)
- [emergent.sh — Portfolio Website Features That Get You Hired](https://emergent.sh/learn/portfolio-website-features)
- [Framer — Brutalist Web Design: A Complete Guide](https://framerwebsites.com/blog/brutalist-web-design)
- [Today Made — Brutalism in Web Design](https://www.todaymade.com/blog/brutalist-web-design)
- [The Plus Addons — Brutalism Web Design: Examples and the CSS Recipe](https://theplusaddons.com/blog/neo-brutalism-web-design/)
- [cccreative — Brutalism vs Neubrutalism in UI Design](https://www.cccreative.design/blogs/brutalism-vs-neubrutalism-in-ui-design)
