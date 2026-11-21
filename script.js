/* ========================================================================
   script.js - Jack Murray portfolio
   No build step, no framework, no dependencies. Loaded after i18n.js.

   MAP - `grep -n "SECTION " script.js` prints this list with live line
   numbers, which is the cheap way to find anything in here.

     01  BOOT & MOTION PREFERENCE     09  PAGE CHROME
     02  LOADER & SCROLL PROGRESS     10  HERO INTERACTIONS
     03  PROJECT DATA                 11  NAVIGATION
     04  MEDIA, ALT TEXT & <picture>  12  THEME SWITCH
     05  GALLERY & FILTERS            13  MENU SCROLL-DISMISS
     06  PROJECT OVERLAY              14  MARQUEE STRIPS
     07  ROUTING                      15  HERO SHAPE FIELD
     08  ABOUT OVERLAY                16  MAGNETIC HEADLINE
                                      17  CONTACT FORM
                                      18  EASTER EGGS
                                      19  ROUTING BOOT (must stay last)

   THE ONE ORDERING RULE: the routing boot block is SECTION 20 and must
   remain the last thing in this file. Moved higher it throws "Cannot
   access 'dialogStack' before initialization", and the failure is quiet -
   a deep link looks like it works and shares as the home page.

   Design rules and the reasoning behind them live in CLAUDE.md.
   ======================================================================== */

/* ------------------------------------------------------------------------
   SECTION 01 · BOOT & MOTION PREFERENCE
   Scroll restoration, the reduced-motion query, and the i18n shorthand.
   ------------------------------------------------------------------------ */
// respected throughout: users who've asked their OS for less motion get
// a site that still works, just without the perpetual decorative motion
// (floating shapes, magnetic letters, lagged cursor, cycling tagline) —
// CSS handles keyframe/transition-based effects (see styles.css), this
// flag gates the continuous JS rAF loops that CSS alone can't reach
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReducedMotion = reducedMotionQuery.matches;
// Turning the OS setting on mid-visit used to do nothing here until a
// reload, because this was read once into a const. It is a `let` now, so
// every check that runs at CALL time follows the setting live: the counters,
// the shapes loop, the cursor loop, the tagline. The three that run at INIT
// time to decide whether to attach a listener at all - the magnetic text,
// the cursor loop's start, the [data-tilt] handlers - still need a reload,
// which is the usual behaviour and not worth restructuring the file for.
reducedMotionQuery.addEventListener('change', (e) => { prefersReducedMotion = e.matches; });

// i18n bridge. Everything user-facing that this file generates at runtime
// (the tagline rotation, the ticker strips, the magnetic headline, project
// detail copy, button state text) has to come through here rather than
// being hardcoded, or it would stay frozen in English while the rest of
// the page switched. The optional-chaining guards mean the site still
// works if i18n.js fails to load — it just stays English.
const T = {
  t: (k) => (window.I18N ? window.I18N.t(k) : ''),
  tf: (k, vars) => (window.I18N ? window.I18N.tf(k, vars) : ''),
  list: (k) => {
    const v = window.I18N ? window.I18N.t(k) : null;
    return Array.isArray(v) ? v : [];
  },
  onChange: (fn) => { if (window.I18N) window.I18N.onChange(fn); }
};

// Reloads were coming back part-way down the page. The browser restores the
// previous scroll offset by default, and it resolves that offset against a
// document whose height is still moving: the skeleton holds the body at
// overflow hidden while it is up, images below the fold are lazy, and the
// hero's type reflows once the self-hosted fonts land. Restoring "900px down"
// against three different document heights in the first second lands in three
// different places.
//
// Manual, and we put it at the top ourselves. For a page whose first screen is
// the thing it most wants seen, the top is the only correct answer - with one
// exception, a URL carrying a #hash, which is someone asking for a specific
// section and should still get it.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!location.hash) {
  // 'instant' because html has scroll-behavior: smooth, and the default would
  // animate the correction - visible as the page gliding up on every reload
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

/* ------------------------------------------------------------------------
   SECTION 02 · LOADER & SCROLL PROGRESS
   The skeleton it hands over to is mirrored by hand in styles.css.
   ------------------------------------------------------------------------ */
// Loading skeleton. The fake progress bar that used to live here advanced by
// Math.random() every 120ms and reached 100% whenever it felt like it, which
// is a progress indicator unconnected to any progress. The skeleton makes no
// claim about how far along anything is - it just holds the page's shape
// until there is a page - so there is nothing left to drive.
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    loader.classList.add('loaded');
    document.body.classList.remove('is-loading');

    // Re-run the deep link ourselves. The browser jumps to a #hash during
    // load, but the skeleton holds the body at overflow: hidden while it is
    // up, so the jump is swallowed and never retried - every
    // jackmurraydesign.com/#contact opened at the top of the page instead.
    // Now that the lock is off, do it again.
    if (location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      // instant, not smooth: this is where the page should already have been,
      // not a journey the reader asked to watch
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    // after the fade, not during it
    setTimeout(() => loader.remove(), 600);
  };
  // Pin it again here. Between DOMContentLoaded and load the document grows as
  // images arrive, and some browsers take a second run at restoring a position
  // once the height changes; without this a reload could still drift down the
  // page after the skeleton had gone.
  if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // A frame first, so the real content has painted underneath before the
  // skeleton fades and the two cross rather than flashing white between them.
  requestAnimationFrame(dismiss);
  // ...but rAF does not run in a backgrounded tab. A phone that finishes
  // loading the page while the user is in another app would come back to a
  // skeleton that never leaves, with the body still locked at
  // overflow: hidden. The timeout is the floor; whichever fires first wins.
  setTimeout(dismiss, 250);
});

// scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

// project detail data — each project picks a "layout" so the case
// studies don't all look the same: single hero shot, scrollable photo
// gallery, video placeholder, or a hero + smaller detail shots mix.
/* ------------------------------------------------------------------------
   SECTION 03 · PROJECT DATA
   Six projects. Adding one touches FOUR files - see assets/README.md.
   ------------------------------------------------------------------------ */
// TYPE/ROLE are kept honest (school/personal/church/concept work) —
// no fake client names or invented agency-style services.
const projectData = {
  'cat-coaching': {
    bg: '#f2a71b',
    thumb: { src: '/assets/projects/cat-coaching/thumb.jpg', w: 1400, h: 1050, altIndex: 1, small: '/assets/projects/cat-coaching/thumb-800.jpg' },
    category: 'UX/UI',
    title: 'CATERPILLAR UX CHALLENGE',
    desc: "Adaptive coaching interface for heavy equipment operators, designed with Caterpillar.",
    type: 'Bradley University x Caterpillar',
    year: '2025',
    role: 'UX Research & Design',
    layout: 'mixed',
    // photos are supporting evidence here, not the point — the sidebar
    // shell lets the write-up be read while they scroll past
    sidebar: true,
    hero: { src: '/assets/projects/cat-coaching/hero.jpg', w: 1900, h: 1069,
            full: '/assets/projects/cat-coaching/hero-full.jpg' },
    // One supporting photo, not two. The whiteboard shot came out and the
    // team shot takes the full width under the hero - see the :only-child
    // rule in styles.css. Alt strings are resolved BY POSITION and the hero
    // is index 0, so detail images start at alt.2, not alt.1: dropping the
    // whiteboard here meant deleting the old alt.2 and moving the team
    // string from alt.3 to alt.2 in all four languages. The hero's alt.1 is
    // untouched.
    detailImages: [
      { src: '/assets/projects/cat-coaching/03-team.jpg', w: 700, h: 700,
        full: '/assets/projects/cat-coaching/03-team-full.jpg' }
    ]
  },

  'pot-clip': {
    // The photograph's own backdrop, so the card does not flash a colour the
    // image then contradicts while it loads.
    bg: '#dedcd7',
    thumb: { src: '/assets/projects/pot-clip/thumb.jpg', w: 1280, h: 960, small: '/assets/projects/pot-clip/thumb-800.jpg' },
    category: 'PRODUCT',
    title: 'POT CLIP UTENSIL REST',
    desc: "Movable rests that clip to a pot rim in pairs and keep the spoon out of the pot.",
    type: 'Product Design',
    year: '2026',
    role: 'Design & Fabrication',
    // The chip and the title move above the media instead of opening the
    // sidebar. ONLY THIS PROJECT HAS IT while the treatment is being judged
    // on one page - the other five keep the title at the top of the write-up
    // column, exactly as they were. See .project-head in styles.css.
    titleTop: true,
    // MASONRY, NOT MIXED, AND THE REASON IS ARITHMETIC. mixed divides one
    // 956px row between however many tiles it is given: easter-riverside's
    // three come out 383x311 and sandcastles' two 472x380, but fourteen
    // would be unreadable. masonry packs a curated sequence into rows of
    // three columns and gives the write-up a sticky sidebar.
    //
    // THE ORDER IS THE PROCESS, AND IT WAS WRONG ON THE FIRST PASS. The
    // Blender capture sat fourth, between the paper profiles and the spray
    // booth, because that is the order a digital designer's process USUALLY
    // runs. Jack: "I did the 3D model last, but its picture of in Blender is
    // in the middle." He is right and the files say so - the process photos
    // are EXIF-dated 6, 13 and 20 October and every Blender screenshot is
    // 20-21 November. The physical model came first and the digital one was
    // built from it, which is the opposite of the assumption, and the
    // write-up had the same error until this commit.
    //
    // PACKING. The packer walks in order and pairs a landscape with a
    // portrait (L+P = 2+1, three portraits = 1+1+1, a lone landscape = full
    // width). With 5 landscapes and 9 portraits this lays out as
    // feature / L+P / L+P / P+P+P / L+P / P+P+P / feature - seven full rows
    // and no holes. Change one entry's orientation and the whole wall
    // re-packs, so re-check it in the page rather than by eye.
    //
    // ALT TEXT IS POSITIONAL: resolveAlt uses index + 1, so
    // proj.pot-clip.alt.N tracks this array in all four languages. Moving an
    // entry silently moves its description onto a different photograph.
    layout: 'masonry',
    photos: [
      { src: '/assets/projects/pot-clip/01-hero.jpg', w: 1414, h: 795,
        full: '/assets/projects/pot-clip/01-hero-full.jpg' },
      { src: '/assets/projects/pot-clip/02-sketches.jpg', w: 1400, h: 1211,
        full: '/assets/projects/pot-clip/02-sketches-full.jpg' },
      { src: '/assets/projects/pot-clip/03-profiles.jpg', w: 800, h: 1200,
        full: '/assets/projects/pot-clip/03-profiles-full.jpg' },
      // Shot in portrait with the page turned, so it arrived on its side and
      // stayed that way for a release. Rotated 90 degrees anticlockwise and
      // baked to orientation 1 - see the double-rotation gotcha in
      // assets/README.md for why the EXIF tag is not the way to do it.
      { src: '/assets/projects/pot-clip/04-measurements.jpg', w: 1399, h: 779,
        full: '/assets/projects/pot-clip/04-measurements-full.jpg' },
      { src: '/assets/projects/pot-clip/05-foam.jpg', w: 800, h: 1200,
        full: '/assets/projects/pot-clip/05-foam-full.jpg' },
      { src: '/assets/projects/pot-clip/06-finishing.jpg', w: 800, h: 1200,
        full: '/assets/projects/pot-clip/06-finishing-full.jpg' },
      { src: '/assets/projects/pot-clip/07-hand.jpg', w: 800, h: 1200,
        full: '/assets/projects/pot-clip/07-hand-full.jpg' },
      // FIVE POSTERS, NOT ONE. Jack: "I'm a digital creative, so I feel like
      // we need more emphasis on the posters that I created." One was a
      // misread of the project - the posters are the output, not a footnote.
      // Three of them sit together as a run; the other two flank the model.
      { src: '/assets/projects/pot-clip/08-poster-a.jpg', w: 848, h: 1200,
        full: '/assets/projects/pot-clip/08-poster-a-full.jpg' },
      { src: '/assets/projects/pot-clip/09-model.jpg', w: 1400, h: 879,
        full: '/assets/projects/pot-clip/09-model-full.jpg' },
      { src: '/assets/projects/pot-clip/10-poster-b.jpg', w: 848, h: 1200,
        full: '/assets/projects/pot-clip/10-poster-b-full.jpg' },
      { src: '/assets/projects/pot-clip/11-poster-c.jpg', w: 848, h: 1200,
        full: '/assets/projects/pot-clip/11-poster-c-full.jpg' },
      { src: '/assets/projects/pot-clip/12-poster-d.jpg', w: 848, h: 1200,
        full: '/assets/projects/pot-clip/12-poster-d-full.jpg' },
      { src: '/assets/projects/pot-clip/13-poster-e.jpg', w: 848, h: 1200,
        full: '/assets/projects/pot-clip/13-poster-e-full.jpg' },
    ],
    // THE 3D OBJECT IS NOT A TILE IN THE WALL ANY MORE. It was the
    // fourteenth cell, so it wore the masonry grid's 4px border and 6px of
    // black padding like every photograph beside it - a thing you turn,
    // presented as a thing you look at, in a box. Jack: "it shouldn't be in
    // a box. It should be in its own area... put it at like the very top."
    // So it is a band of its own under the title, above the photographs,
    // with no frame at all. Rendered by renderProjectStage into
    // #projectStage, a sibling of .project-media.
    //   The still is the poster AND the no-WebGL fallback, exactly as before,
    // and it keeps alt.14 - it was photo 14 and the other thirteen did not
    // renumber, so no alt text moved.
    model: {
      /* THE ?v IS THE FILE'S OWN CONTENT HASH, AND IT IS NOT DECORATION.
         Repacking the mesh changes the bytes at a URL that vercel.json
         gives an hour of freshness and a WEEK of stale-while-revalidate,
         so every returning visitor keeps the old mesh - and that is not a
         cosmetic staleness: the packer now bakes the glTF node transform
         in and the viewer no longer applies its old ZUP correction, so an
         old mesh through the new viewer renders LYING ON ITS BACK.
         That is exactly what Jack saw - "you didn't change the 3D model...
         it's still the old one" and "it's upside down" were one bug, a
         cached file, reported as two.
         A hash in the query makes the URL change whenever the bytes do, so
         there is nothing to go stale. `model-check.js` fails if the two
         ever disagree, because a hand-maintained hash is a hash that will
         be wrong. */
      src: '/assets/projects/pot-clip/model.jmm?v=1c0b18a9',
      poster: { src: '/assets/projects/pot-clip/14-object.jpg', w: 1400, h: 933 },
      // index into the alt.N series, 0-based — 13 resolves proj.…alt.14
      altIndex: 13,
      /* TEMPORARY, AND THE WHOLE BLOCK COMES OUT AGAIN. A side-by-side
         against Google's <model-viewer> so Jack can see what the
         hand-rolled renderer is and is not giving up. Same mesh, built by
         tools/jmm-to-glb.js, so the only variable is the lighting model.
         It is OFF for visitors - see wantsCompare() - because it costs a
         673KB mesh plus a ~250KB library from a CDN, on a page whose
         first rule is no dependencies. Deleting this key, the
         `.stage-compare` CSS, renderCompareStage() and the .glb removes
         every trace. */
      compare: '/assets/projects/pot-clip/model-compare.glb',
    },
  },
  'easter-riverside': {
    bg: '#8fc0e0',
    // native 4:3 cut from the 1920x1080 master. The old thumb was 1000x562,
    // so the 4:3 card frame cover-cropped a 16:9 image AND had well under
    // 2x the 717px it renders at — it read soft on a retina screen.
    thumb: { src: '/assets/projects/easter-riverside/thumb.jpg', w: 1400, h: 1050, small: '/assets/projects/easter-riverside/thumb-800.jpg' },
    category: 'GRAPHICS',
    title: 'EASTER AT RIVERSIDE',
    desc: "One identity across two services, from invitation cards to a banner on the side of the building.",
    type: 'Event Identity',
    // the artwork itself reads 4.20.25 — this was 2024 before
    year: '2025',
    role: 'Graphic Designer',
    // hero + supporting shots: the design, then the design in the wild
    layout: 'mixed',
    // `full` is the click-to-zoom source; `src` stays the smaller in-page one
    hero: { src: '/assets/projects/easter-riverside/01-hero.jpg', w: 1600, h: 900,
            full: '/assets/projects/easter-riverside/01-hero-full.jpg' },
    detailImages: [
      { src: '/assets/projects/easter-riverside/03-banner.jpg', w: 1200, h: 900,
        full: '/assets/projects/easter-riverside/03-banner-full.jpg' , exif: '26mm · f/1.5 · 1/6400 s · ISO 50' },
      { src: '/assets/projects/easter-riverside/02-photo-wall.jpg', w: 800, h: 1200,
        full: '/assets/projects/easter-riverside/02-photo-wall-full.jpg' , exif: '50mm · f/2.8 · 1/2500 s · ISO 2500' },
      { src: '/assets/projects/easter-riverside/04-invite-cards.jpg', w: 900, h: 1200,
        full: '/assets/projects/easter-riverside/04-invite-cards-full.jpg' , exif: '26mm · f/1.5 · 1/60 s · ISO 400' }
    ]
  },
  'fuse-partners-in-crime': {
    bg: '#1aa64b',
    video: {
      src: '/assets/projects/fuse-partners-in-crime/partners-in-crime.mp4',
      type: 'video/mp4',
      poster: '/assets/projects/fuse-partners-in-crime/video-poster.jpg',
      // The capture is a 3840x1080 split screen showing both players at once,
      // which is the whole premise of the game. Forced into the default 16:9
      // frame it would letterback to a strip, so the frame takes its ratio
      // from here instead.
      ratio: '32 / 9'
    },
    // the team's title banner, composed onto 4:3 over its own sampled purple
    // so the logotype isn't cropped. The gameplay still lives in the video.
    // cropped in ~1.2x on the logo rather than upscaled back to 1400 — the card
    // renders at 717px, so these are the real pixels and nothing is invented
    thumb: { src: '/assets/projects/fuse-partners-in-crime/cover-banner.jpg', w: 1167, h: 875, altIndex: 1, small: '/assets/projects/fuse-partners-in-crime/cover-banner-800.jpg' },
    category: 'UX/UI',
    alsoIn: ['MOTION'],
    title: 'PARTNERS IN CRIME',
    desc: "Asymmetric VR and PC co-op heist, shown at the Peoria Riverfront Museum.",
    type: 'Bradley FUSE - VR Game',
    year: '2025',
    role: 'VR Interface & VFX',
    layout: 'video',
    detailImages: [
      { src: '/assets/projects/fuse-partners-in-crime/02-museum-play.jpg', w: 757, h: 760 },
      { src: '/assets/projects/fuse-partners-in-crime/03-museum-room.jpg', w: 1013, h: 760 },
      // the exhibition standup: title lockup, the full 17-person crew by
      // department, and the in-game scanner art. Unreadable at strip width by
      // definition, so it carries a zoom source.
      { src: '/assets/projects/fuse-partners-in-crime/04-standup-banner.jpg', w: 210, h: 700,
        full: '/assets/projects/fuse-partners-in-crime/04-standup-banner-full.jpg' }
    ]
  },

  'sandcastles': {
    // bg is sampled from the artwork's own paper texture (#4ea7ae), not picked
    bg: '#4ea7ae',
    // 4:3 crop of the 16:9 artwork rather than a cover-crop of it — the script
    // wordmark runs nearly edge to edge, so letting the card frame crop the
    // 16:9 version would cut the ends off the word the project is named after.
    thumb: { src: '/assets/projects/sandcastles/thumb.jpg', w: 1400, h: 1050, small: '/assets/projects/sandcastles/thumb-800.jpg' },
    category: 'GRAPHICS',
    title: 'SANDCASTLES',
    desc: "Sermon series identity applied across stage screens, social, and print.",
    type: 'Sermon Series Identity',
    // the church's livestream of the opening service is dated 06.29.25
    year: '2025',
    role: 'Graphic Designer',
    // same shape as easter-riverside: the design, then the design in use
    layout: 'mixed',
    hero: { src: '/assets/projects/sandcastles/01-hero.jpg', w: 1900, h: 1069,
            full: '/assets/projects/sandcastles/01-hero-full.jpg' },
    // Two applications, both of them the finished thing in use. 02-photoshop.jpg
    // and 04-instagram.jpg are still on disk but unused: the Photoshop shot was
    // a photo of a screen rather than a screenshot, and it showed one near-final
    // state while the copy claims iteration, so it was promising something it
    // didn't deliver.
    detailImages: [
      { src: '/assets/projects/sandcastles/05-reading-plan.jpg', w: 1100, h: 1100,
        full: '/assets/projects/sandcastles/05-reading-plan-full.jpg' },
      { src: '/assets/projects/sandcastles/03-stage.jpg', w: 1200, h: 671,
        full: '/assets/projects/sandcastles/03-stage-full.jpg' }
    ]
  },
  'monmouth-retreat': {
    bg: '#111',
    // Card image is photo 9, the guitarist in the doorway — cropped to 4:3
    // from the 4480x6720 original rather than squeezed from the portrait
    // export, so the card frame fits it exactly and nothing is cover-cropped.
    // altIndex points the alt text at that photo; without it the thumbnail
    // inherits alt.1, which describes a different photograph entirely.
    thumb: { src: '/assets/projects/monmouth-retreat/thumb.jpg', w: 1400, h: 1050, altIndex: 9, small: '/assets/projects/monmouth-retreat/thumb-800.jpg' },
    category: 'PHOTOGRAPHY',
    title: 'MONMOUTH RETREAT',
    desc: "Candid photography from a worship team's retreat in Monmouth.",
    type: 'Photography Collection',
    // every frame is EXIF-dated 2025-02-20; this said 2024
    year: '2025',
    role: 'Photographer',
    layout: 'masonry',
    // Ordered as a narrative — the town, the room, warm-up, rehearsal,
    // individual portraits, then the emotional peak to close — and sequenced
    // so the three people who appear twice are spread apart rather than
    // clustered at the end. The landscape/portrait pattern is load-bearing:
    // the row packer needs portraits at 2, 5, 9, 12 and 16 to fill every row.
    photos: [
      { src: '/assets/projects/monmouth-retreat/01.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/01-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 2500' },
      { src: '/assets/projects/monmouth-retreat/02.jpg', w: 800, h: 1200, full: '/assets/projects/monmouth-retreat/02-full.jpg',
        exif: '85mm · f/13 · 1/160 s · ISO 160' },
      { src: '/assets/projects/monmouth-retreat/03.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/03-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 400' },
      { src: '/assets/projects/monmouth-retreat/04.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/04-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: '/assets/projects/monmouth-retreat/05.jpg', w: 800, h: 1200, full: '/assets/projects/monmouth-retreat/05-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: '/assets/projects/monmouth-retreat/06.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/06-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 500' },
      { src: '/assets/projects/monmouth-retreat/07.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/07-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 1000' },
      { src: '/assets/projects/monmouth-retreat/08.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/08-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 2500' },
      { src: '/assets/projects/monmouth-retreat/09.jpg', w: 800, h: 1200, full: '/assets/projects/monmouth-retreat/09-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 800' },
      { src: '/assets/projects/monmouth-retreat/10.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/10-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: '/assets/projects/monmouth-retreat/11.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/11-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 640' },
      { src: '/assets/projects/monmouth-retreat/12.jpg', w: 843, h: 1200, full: '/assets/projects/monmouth-retreat/12-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 2500' },
      { src: '/assets/projects/monmouth-retreat/13.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/13-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: '/assets/projects/monmouth-retreat/14.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/14-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: '/assets/projects/monmouth-retreat/15.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/15-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 500' },
      { src: '/assets/projects/monmouth-retreat/16.jpg', w: 800, h: 1200, full: '/assets/projects/monmouth-retreat/16-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: '/assets/projects/monmouth-retreat/17.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/17-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 640' },
      { src: '/assets/projects/monmouth-retreat/18.jpg', w: 1200, h: 800, full: '/assets/projects/monmouth-retreat/18-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 500' }
    ]
  },
  /* ----------------------------------------------------------------------
     ADDING A PROJECT
     Copy this shape in above, keyed by a url-safe id. Order in this object is
     the order on the page, and it matters: don't let the first two tiles share
     a category, or switching to that filter changes nothing visible on the
     first row and the filter looks broken.

       'my-project': {
         bg: '#4ea7ae',                       // tile colour behind the card
         thumb: { src: '...', w: 1400, h: 1050 },   // or an inline <svg> string
         category: 'UX/UI',                   // must match a filter button
         title: 'MY PROJECT',                 // not translated
         desc:  "...",                        // fallback; i18n.js wins
         type: 'Case Study', year: '2026', role: 'UX Designer',
         layout: 'mixed',                     // see LAYOUTS below
         hero: { src: '...', w: 1900, h: 1069, full: '...' },
         detailImages: [ { src: '...', w: 1200, h: 671, full: '...' } ]
       }

     LAYOUTS. styles.css carries five: single, mixed, gallery, masonry,
     video. Three are in use - mixed (x4), video (x2), masonry (x1) - and
     single and gallery are supported but currently unused, so they are the
     least-tested paths. The class is built as `layout-${data.layout}`, so
     a typo here produces no class and no error, just an unstyled panel.

     Then add to ALL FOUR language blocks in i18n.js:
       proj.my-project.desc / .type / .role / .body / .alt.1 .alt.2 ...
     alt.N is positional: alt.1 is the hero, alt.2 the first detail image.
     Reordering detailImages means reordering the alt strings to match.

     docs/project-placeholders.js has dummy entries to paste in if you want to
     see the grid at a higher count. Their i18n keys are still in i18n.js.
     ---------------------------------------------------------------------- */
  'oasis-journey': {
    bg: '#0a5cff',
    // The frame at t=8s, pulled at full 1920x1080 with AVAssetImageGenerator
    // (tolerance zero, so it's that exact frame and not the nearest keyframe)
    // via a Swift one-liner — this machine has no ffmpeg. Jack picked the shot:
    // the canyon arch with the ship small against the dune.
    video: {
      src: '/assets/projects/oasis-journey/journey-to-the-oasis.mp4',
      type: 'video/mp4',
      poster: '/assets/projects/oasis-journey/video-poster.jpg'
    },
    detailImages: [
      { src: '/assets/projects/oasis-journey/poster-art.jpg', w: 776, h: 1200,
        full: '/assets/projects/oasis-journey/poster-art-full.jpg' }
    ],
    // 4:3 crop of the poster artwork, taken below the title lockup so the card
    // shows the render rather than a squeezed portrait poster. Cut from the
    // 1375x2125 original PNG — a 1375x1031 window at y=640, resampled to 1400
    // wide. That offset is bounded on both sides: the title's descenders and
    // drop shadow reach down to ~y=620, so anything higher clips "OASIS" into
    // the card, while lower leads with the dark ship hulls instead of the
    // city. altIndex 1 resolves to alt.1, which is its own string
    // rather than the poster's — this crop excludes the ships alt.2 describes.
    thumb: { src: '/assets/projects/oasis-journey/thumb.jpg', w: 1400, h: 1049, altIndex: 1, small: '/assets/projects/oasis-journey/thumb-800.jpg' },
    category: 'MOTION',
    title: 'JOURNEY TO THE OASIS',
    desc: "3D animated short created as an early motion and storytelling project.",
    type: 'School Project',
    // the poster reads "Summer 2022", and every file in the Drive project
    // folder is dated July 2022 (script 14th, renders 26th, final 29th).
    // The 2023 dates belong to later re-uploads of the export.
    year: '2022',
    role: 'Animator / Director',
    layout: 'video',
    videoCaption: 'WATCH THE SHORT FILM',
    videoSvg: `<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="450" fill="#0a5cff"/>
      <rect y="320" width="600" height="130" fill="#ff7a00"/>
      <circle cx="470" cy="110" r="60" fill="#fffb00"/>
      <polygon points="0,320 150,230 300,320" fill="#111"/>
      <text x="40" y="410" font-family="Archivo Black" font-size="30" fill="#fff">JOURNEY TO THE OASIS</text>
    </svg>`
  },
};

/* ==========================================================================
   MEDIA
   Every layout used to consume raw inline <svg> strings. These helpers let
   an entry be EITHER a path to a real asset or raw markup, so the
   placeholder artwork keeps working while real photos land one project at
   a time — no broken intermediate state.

   An image entry can be:
     '/assets/projects/x/01.jpg'                       a path
     { src: '...', alt: '...', w: 1600, h: 1200 }     a path plus metadata
     '<svg ...>'                                       legacy inline artwork
   ========================================================================== */

/* ------------------------------------------------------------------------
   SECTION 04 · MEDIA, ALT TEXT & <picture>
   Every inline jpg needs a webp sibling or <picture> ships a broken image.
   ------------------------------------------------------------------------ */
function isMarkup(v) {
  return typeof v === 'string' && v.trim().charAt(0) === '<';
}

function escapeAttr(v) {
  return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
                  .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Alt text resolution, most specific first:
     1. an explicit `alt` on the entry ('' means decorative, and is honoured)
     2. proj.<id>.alt.<n> from the translation file
     3. a generated "Photo N from <title>" fallback
   (3) is deliberately a fallback rather than the default: it tells a screen
   reader an image is there but nothing about what's in it. See assets/README.md */
function resolveAlt(entry, projectId, index, projectTitle) {
  if (entry && typeof entry === 'object' && typeof entry.alt === 'string') {
    return entry.alt;
  }
  const key = 'proj.' + projectId + '.alt.' + (index + 1);
  const translated = T.t(key);
  if (translated) return translated;
  return T.tf('a11y.photoAlt', { n: index + 1, title: projectTitle || '' });
}

// Returns an <img> for a path, or passes inline markup straight through.
function mediaTag(entry, projectId, index, projectTitle, eager) {
  if (!entry) return '';
  // Inline SVG (the hand-drawn card art) is decorative — the card already
  // carries its title as real text, so a screen reader announcing the graphic
  // as well is noise. Stamped here rather than on each SVG string so new art
  // can't reintroduce the problem by omission.
  if (isMarkup(entry)) {
    return entry.indexOf('aria-hidden') === -1
      ? entry.replace('<svg ', '<svg aria-hidden="true" ')
      : entry;
  }

  const src = typeof entry === 'string' ? entry : entry.src;
  if (!src) return '';
  const alt = resolveAlt(entry, projectId, index, projectTitle);
  const dims = (typeof entry === 'object' && entry.w && entry.h)
    ? ` width="${entry.w}" height="${entry.h}"` : '';
  /* A second, smaller copy for small screens, where the full one is a waste
     of most of its pixels: a card is the full width of a phone, so about
     375 CSS px, which even at 2x device pixels wants 750 - against a 1400px
     file. The set is 2090KB at full size and 703KB at 800, and the 800 is
     still 2x for that card, so nothing visible is lost.
     800 rather than 700 on purpose: the browser picks the first candidate
     that meets the device's requirement, and a 750px requirement would skip
     a 700 and take the 1400 anyway.
     'sizes' describes the CARD grid specifically - full width below 800px
     where .gallery is one column, half above it where it is two - so only
     thumbs carry 'small'. A gallery photo inside a project would need its
     own sizes and does not have one. */
  const srcset = (typeof entry === 'object' && entry.small && entry.w)
    ? ` srcset="${escapeAttr(entry.small)} 800w, ${escapeAttr(src)} ${entry.w}w"`
      + ` sizes="(max-width: 800px) 100vw, 50vw"` : '';
  // An alt that came from the translation file has to be re-resolved when the
  // language changes. Stamping the project id and image index lets that happen
  // in place — re-rendering instead would restart any playing video and drop
  // the tilt listeners bound to the cards at load. A literal `alt` written
  // into projectData is left alone: it isn't translatable by definition.
  const literal = (entry && typeof entry === 'object' && typeof entry.alt === 'string');
  const track = literal ? '' :
    ` data-alt-p="${escapeAttr(projectId || '')}" data-alt-i="${index}"`;
  // a larger source to open in the lightbox; without one the image isn't
  // zoomable, since a "zoom" that shows no more detail is just a bigger blur
  const full = (entry && typeof entry === 'object' && entry.full)
    ? ` data-full="${escapeAttr(entry.full)}"` : '';
  // camera settings, shown as the lightbox caption. Not alt text: alt exists
  // for people who can't see the image, so describing the picture to someone
  // looking at it is redundant — the caption should add what looking can't.
  const exif = (entry && typeof entry === 'object' && entry.exif)
    ? ` data-exif="${escapeAttr(entry.exif)}"` : '';
  // explicit width/height reserve the box so images don't shift the layout
  // as they decode; lazy loading keeps a 20-photo set off the critical path
  /* WEBP FIRST, JPEG AS THE FALLBACK. Same pictures, about half the bytes -
     the 50 images that render inline are 13370KB as JPEG and 6321KB as WebP
     at quality 85, which measures 37-39dB PSNR against the JPEG, i.e. the
     same image.
     The .webp path is the .jpg path with the extension swapped, which only
     works because EVERY inline jpg has a sibling webp - see the note in
     CLAUDE.md and the one-liner that checks it. This matters: a <picture>
     falls back to the <img> when the browser cannot decode a type, NOT when
     the file 404s, so a missing webp is a broken image rather than a
     graceful degradation.
     AVIF was generated and measured too and is not here: it came out 8%
     smaller than WebP on the home page, which does not pay for a second set
     of 50 files and a third source. */
  const webp = src.replace(/\.jpg$/, '.webp');
  const webpSmall = (typeof entry === 'object' && entry.small)
    ? entry.small.replace(/\.jpg$/, '.webp') : null;
  const webpSet = (webpSmall && entry.w)
    ? `${escapeAttr(webpSmall)} 800w, ${escapeAttr(webp)} ${entry.w}w`
    : escapeAttr(webp);
  const webpSizes = (webpSmall && entry.w) ? ` sizes="(max-width: 800px) 100vw, 50vw"` : '';
  /* The first gallery row is above the fold now that .hero is 66vh, and an
     image the visitor can already see has no business being lazy - lazy is
     for what is coming, and the browser's own margin is generous but it is
     still a decision taken after layout. fetchpriority high puts them in
     front of the rest of the gallery rather than behind it. Two, because the
     grid is two columns on a desktop and one on a phone, so two covers the
     first row either way and costs a phone one image it will want next. */
  const loadAttrs = eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
  const img = `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${dims}${srcset}${track}${full}${exif}` +
              `${loadAttrs} decoding="async">`;
  return src.endsWith('.jpg')
    ? `<picture><source type="image/webp" srcset="${webpSet}"${webpSizes}>${img}</picture>`
    : img;
}

/* ==========================================================================
   GALLERY CARDS
   Generated from projectData rather than hand-written in index.html, so a
   project exists in exactly one place. The data-i18n attributes are applied
   by i18n.js on DOMContentLoaded, which runs after this file.
   ========================================================================== */

/* ------------------------------------------------------------------------
   SECTION 05 · GALLERY & FILTERS
   Cards are real <a href="/work/..."> links, not buttons.
   ------------------------------------------------------------------------ */
function renderGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  gallery.innerHTML = Object.entries(projectData).map(([id, p], cardIndex) => {
    // `thumb` is the card image; falls back to whatever hero art the entry
    // already has so existing placeholder projects still render
    const thumb = p.thumb || p.svg || p.heroSvg ||
                  (p.images && p.images[0]) || (p.photos && p.photos[0]) || '';
    return `
    <a class="card reveal" data-tilt data-project="${escapeAttr(id)}"` +
      ` href="/work/${escapeAttr(id)}"` +
      ` data-category="${escapeAttr([p.category].concat(p.alsoIn || []).join(' '))}"` +
      ` style="--bg:${escapeAttr(p.bg || '#111')};"` +
      ` aria-label="${escapeAttr(p.title)}">
      <div class="card-media">${mediaTag(thumb, id,
        (thumb && thumb.altIndex ? thumb.altIndex - 1 : 0), p.title, cardIndex < 2)}</div>
      <div class="card-info">
        <h3>${escapeAttr(p.title)}</h3>
        <p data-i18n="proj.${escapeAttr(id)}.desc">${escapeAttr(p.desc)}</p>
        <div class="card-tags">${[p.category].concat(p.alsoIn || []).map((c) =>
          `<span class="tag" data-i18n="cat.${escapeAttr(c)}">${escapeAttr(c)}</span>`).join('')}</div>
        <!-- The card had no affordance at rest: its only signal that it did
             anything was a hover lift, which does not exist on a touch screen
             and which a reader has to already suspect in order to go looking
             for it. So people clicked the category tags instead - those being
             the only objects on the card shaped like controls. This names the
             action and gives it somewhere to land.
             aria-hidden, because the card is a link carrying an aria-label
             with the project's title; announcing this too would read every
             card out twice. -->
        <div class="card-cta" aria-hidden="true">
          <span data-i18n="card.cta">VIEW CASE STUDY</span>
          <span class="card-cta-arrow">\u2192\ufe0e</span>
        </div>
      </div>
    </a>`;
  }).join('');
}
renderGallery();

/* THE REST OF THE GALLERY IS FETCHED AFTER load, NOT ON SCROLL.
   The first two cards are eager because they are above the fold; the other
   four are lazy, which keeps them out of the critical path - right for first
   paint, and it leaves the browser to decide when. Chrome's own lazy
   distance is generous and usually gets there first, but "usually" is doing
   real work in that sentence: it narrows on a slow connection, which is
   exactly when a blank card is most likely and most annoying.
   Flipping them to eager once load has fired costs the first paint nothing
   - it has already happened - and makes the rest deterministic. The 400ms
   is so this queues behind anything load itself kicked off.
   Verified in the pane that the flip does fetch: all four went from
   complete:false to complete:true with naturalWidth 720. (The pane never
   runs lazy-loading on its own, so that flip is also the only way to see
   these images arrive in it at all - do not read a blank card there as a
   bug in the page.) */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.card img[loading="lazy"]').forEach((img) => {
      img.loading = 'eager';
    });
  }, 400);
});

// portfolio filtering
const filterBtns = document.querySelectorAll('.filter-btn');
// re-queried on each click rather than captured once: the cards are
// generated by renderGallery(), so a static NodeList taken at load would
// go stale the moment the gallery is re-rendered and filtering would
// silently stop matching anything
const galleryCards = () => document.querySelectorAll('.gallery .card');
const filterStatus = document.getElementById('filterStatus');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => {
      b.classList.remove('active');
      // the class is the paint, aria-pressed is the state. Both, every time,
      // or the two drift and the announcement stops matching the screen
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    const filter = btn.dataset.filter;
    let shown = 0;
    galleryCards().forEach((card) => {
      // a space-separated list now, so one project can sit under more than
      // one filter — the VR game is interface work and motion work both
      const match = filter === 'ALL' ||
        card.dataset.category.split(' ').includes(filter);
      card.classList.toggle('hidden-card', !match);
      if (match) shown++;
    });
    announceFilterCount(shown);
  });
});

/* Say how many are left. Filtering is otherwise a silent change: the grid
   goes from six cards to one and a screen-reader user has no way to know
   anything happened, let alone whether the category was empty.
   Singular and plural are separate keys rather than a "1 project(s)" fudge,
   because three of the four languages are not English and two of them do
   not pluralise the way it does. */
function announceFilterCount(n) {
  if (!filterStatus) return;
  filterStatus.textContent = n === 1
    ? T.t('filter.count.one')
    : T.tf('filter.count.many', { n: n });
}


// project detail overlay open/close
/* ------------------------------------------------------------------------
   SECTION 06 · PROJECT OVERLAY
   Pure UI. Knows nothing about history - that is SECTION 07.
   ------------------------------------------------------------------------ */
const projectOverlay = document.getElementById('projectOverlay');
const projectMedia = document.getElementById('projectMedia');
const projectCat = document.getElementById('projectCat');
const projectTitle = document.getElementById('projectTitle');
const projectDesc = document.getElementById('projectDesc');
const projectHead = document.querySelector('.project-head');
const projectType = document.getElementById('projectType');
const projectYear = document.getElementById('projectYear');
const projectRole = document.getElementById('projectRole');
const projectBack = document.getElementById('projectBack');

// simple placeholder colored rectangle — gives the masonry gallery 20
// distinct "photos" without needing real photography assets
function generatePlaceholderSvg(i) {
  const palette = ['#ff3b30', '#0a5cff', '#fffb00', '#111111', '#ff7a00', '#f5f5f0'];
  const bg = palette[i % palette.length];
  const textColor = bg === '#111111' ? '#f5f5f0' : '#111';
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="${bg}"/><text x="14" y="190" font-family="Archivo Black" font-size="14" fill="${textColor}">${String(i + 1).padStart(2, '0')}</text></svg>`;
}

const projectDetailEl = document.querySelector('.project-detail');
const projectStage = document.getElementById('projectStage');

/* The turntable's own band, above the photographs. Separate from
   renderProjectMedia because it is not media: it is one interactive object
   that happens to have a still behind it, and it has to survive every
   layout rather than being a cell in one of them.
   The <img> is the poster AND the fallback - a dead fetch, a lost context
   or no WebGL at all leaves a working photograph rather than a hole. */
/* ---- the <model-viewer> comparison. TEMPORARY; see `compare` in projectData.
   A second stage under the real one, running Google's viewer on the same
   object, so the difference can be looked at rather than argued about.

   IT IS UN-GATED ON PURPOSE, FOR NOW. It sat behind ?compare so a visitor
   never paid for a CDN library and a second copy of the mesh, which was
   the right instinct and the wrong call: Jack asked twice to see the two
   side by side, and a flag he has to remember cost three rounds of "I
   still only see one" - the last of them after the flag turned out not to
   survive a deep link anyway, because the router strips the query before
   the stage renders.
   So this is LIVE WEIGHT until he has looked - about 920KB on a portfolio
   page whose first rule is no dependencies - and it comes out as soon as
   he has. Removing it is this block, the `compare` key in projectData,
   the `.stage-compare` CSS, model-compare.glb and tools/jmm-to-glb.js. */
const COMPARE_LIB = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js';
let compareLibAdded = false;
function wantsCompare() { return true; }
function renderCompareStage(src) {
  if (!compareLibAdded) {
    const s = document.createElement('script');
    s.type = 'module';
    s.src = COMPARE_LIB;
    document.head.appendChild(s);
    compareLibAdded = true;
  }
  /* camera-orbit mirrors our own opening view so the two are showing the
     same thing: theta 115deg is HOME_YAW (2.0 rad), and phi 57deg is
     HOME_PITCH (+0.58 rad) measured from the pole rather than the horizon,
     so 90 - 33. rotation-per-second and the delay mirror IDLE_SPIN and
     IDLE_AFTER. */
  return `
    <div class="stage-compare">
      <p class="stage-label">Google &lt;model-viewer&gt; — library ~250KB + 673KB mesh</p>
      <model-viewer
        src="${escapeAttr(src)}"
        alt="The same pot clip mesh, rendered by Google's model-viewer for comparison"
        loading="eager"
        camera-controls
        auto-rotate
        auto-rotate-delay="6000"
        rotation-per-second="11.5deg"
        camera-orbit="115deg 57deg auto"
        environment-image="neutral"
        shadow-intensity="1"
        exposure="1"
        touch-action="pan-y"></model-viewer>
    </div>`;
}

function renderProjectStage(data) {
  const m = data.model;
  projectDetailEl.classList.toggle('has-stage', !!m);
  if (!m) { projectStage.innerHTML = ''; return; }
  const poster = mediaTag(m.poster, data.id, m.altIndex || 0, data.title, true);
  const compare = (m.compare && wantsCompare()) ? renderCompareStage(m.compare) : '';
  projectDetailEl.classList.toggle('has-compare', !!compare);
  projectStage.innerHTML =
    (compare ? '<p class="stage-label">This site — hand-rolled WebGL, 392KB mesh, no library</p>' : '') +
    `<div class="model-stage" data-model="${escapeAttr(m.src)}">${poster}</div>` +
    compare;
  setupModelStages(projectStage);
}

function renderProjectMedia(data) {
  // anything still spinning belongs to the panel we are replacing
  stopModelStages();
  projectMedia.className = `project-media layout-${data.layout}`;
  // masonry projects get the full-page sticky-scroll treatment: photos
  // flow with the page on the left, info panel pinned on the right
  projectDetailEl.classList.toggle('is-masonry', data.layout === 'masonry');
  // the sticky two-column shell: every masonry project, plus anything that
  // opts in with `sidebar: true` so its write-up reads alongside its images
  projectDetailEl.classList.toggle('has-sidebar',
    data.layout === 'masonry' || data.sidebar === true);
  projectDetailEl.classList.toggle('is-video', data.layout === 'video');
  // the chip and the <h2> sit above the media rather than opening the
  // write-up column. Per project (`titleTop`) while it is tried on one.
  projectDetailEl.classList.toggle('is-title-top', data.titleTop === true);
  // The poster-beside-the-text treatment only works for a single still. With
  // more than one the strip needs full width, so those projects stack instead.
  projectDetailEl.classList.toggle('is-video-aside',
    data.layout === 'video' && (data.detailImages || []).length === 1);

  if (data.layout === 'masonry') {
    const sizeCycle = ['large', 'small', 'medium', 'small', 'medium', 'large', 'small', 'small', 'medium', 'large', 'small', 'medium', 'small', 'large', 'small', 'medium', 'small', 'small', 'large', 'medium'];
    // real photos once `photos` exists; generated placeholders until then
    const items = data.photos && data.photos.length
      ? data.photos
      : Array.from({ length: data.masonryCount || 0 }, (_, i) => generatePlaceholderSvg(i));
    // Pack the wall into rows that each sum to exactly 3 columns, walking the
    // photos IN ORDER so the curated sequence survives. Assigning sizes by
    // orientation alone left 15% of the wall empty: with 13 landscapes and
    // only 5 portraits, ten 2-column landscapes were competing for five
    // 1-column partners and the leftovers each stranded a hole.
    //   landscape + portrait -> 2 + 1
    //   three portraits      -> 1 + 1 + 1
    //   landscape alone      -> full width
    const isLandscape = (e) => !!(e && typeof e === 'object' && e.w && e.h && e.w >= e.h);
    const hasDims = (e) => !!(e && typeof e === 'object' && e.w && e.h);
    const sizes = new Array(items.length);
    let i = 0;
    // the opening frame carries the gallery, so it gets the full width even
    // though the packer would otherwise pair it with the portrait after it.
    // Costs nothing: the row count comes out the same either way.
    if (isLandscape(items[0])) { sizes[0] = 'feature'; i = 1; }
    while (i < items.length) {
      if (!hasDims(items[i])) {                       // placeholder art
        sizes[i] = sizeCycle[i % sizeCycle.length];
        i += 1;
      } else if (isLandscape(items[i]) && items[i + 1] && !isLandscape(items[i + 1])) {
        sizes[i] = 'wide'; sizes[i + 1] = 'tall'; i += 2;
      } else if (!isLandscape(items[i]) && items[i + 1] && isLandscape(items[i + 1])) {
        sizes[i] = 'tall'; sizes[i + 1] = 'wide'; i += 2;
      } else if (!isLandscape(items[i]) && items[i + 1] && items[i + 2] &&
                 !isLandscape(items[i + 1]) && !isLandscape(items[i + 2])) {
        sizes[i] = sizes[i + 1] = sizes[i + 2] = 'tall'; i += 3;
      } else if (isLandscape(items[i])) {
        sizes[i] = 'feature'; i += 1;
      } else {
        // a portrait with nothing to pair with — rare, and one narrow cell
        // reads better than stretching it across the full width
        sizes[i] = 'tall'; i += 1;
      }
    }
    // An entry carrying `model` keeps its <img> and gets a stage around it:
    // the still render IS the poster and the no-WebGL fallback, so nothing
    // has to be duplicated and nothing disappears if the canvas never starts.
    projectMedia.innerHTML = items.map((entry, i2) => {
      const media = mediaTag(entry, data.id, i2, data.title);
      const inner = (entry && entry.model)
        ? `<div class="model-stage" data-model="${escapeAttr(entry.model)}">${media}</div>`
        : media;
      return `<div class="masonry-item size-${sizes[i2]}">${inner}</div>`;
    }).join('');
    setupModelStages(projectMedia);
    return;
  }

  if (data.layout === 'gallery') {
    projectMedia.innerHTML = (data.images || [])
      .map((entry, i) => `<div class="project-gallery-item">${mediaTag(entry, data.id, i, data.title)}</div>`)
      .join('');
    return;
  }

  if (data.layout === 'video') {
    // Supporting stills (poster art, frames). They have to sit outside the
    // 16:9 player box, which is overflow:hidden — anything appended inside it
    // is simply clipped.
    const details = (data.detailImages && data.detailImages.length)
      ? `<div class="project-video-details">${data.detailImages.map((entry, i) =>
          `<div>${mediaTag(entry, data.id, i + 1, data.title)}</div>`).join('')}</div>`
      : '';
    // A real file plays for real. The branch below it is the original
    // placeholder — an SVG with a play button that only toggles a caption —
    // kept so the project still renders until the film is dropped in.
    if (data.video && data.video.src) {
      const v = data.video;
      // Idle state shows the poster frame under a play button and no control
      // bar — the native bar over a still is visual noise before anyone has
      // pressed anything. Controls are switched on at first play, from which
      // point the browser's own UI takes over for good.
      projectMedia.innerHTML = `
        <div class="project-video-frame is-idle"${v.ratio ? ` style="--video-ratio: ${escapeAttr(v.ratio)}"` : ''}><video class="project-video" preload="metadata"
               ${v.poster ? `poster="${escapeAttr(v.poster)}"` : ''}
               data-i18n-aria="a11y.videoLabel"
               aria-label="${escapeAttr(T.t('a11y.videoLabel'))}">
          <source src="${escapeAttr(v.src)}" type="${escapeAttr(v.type || 'video/mp4')}">
          ${v.captions ? `<track kind="captions" src="${escapeAttr(v.captions)}"
               srclang="${escapeAttr(window.I18N ? window.I18N.lang : 'en')}"
               label="Captions" default>` : ''}
        </video><button class="video-play" type="button"
               data-i18n-aria="a11y.playFilm"
               aria-label="${escapeAttr(T.t('a11y.playFilm'))}">
          <span class="play-btn"><svg viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="5,3 21,12 5,21"></polygon></svg></span>
        </button></div>` + details;
      const frameEl = projectMedia.querySelector('.project-video-frame');
      const videoEl = projectMedia.querySelector('video.project-video');
      const start = () => {
        frameEl.classList.remove('is-idle');
        videoEl.controls = true;
        videoEl.play();
      };
      projectMedia.querySelector('.video-play').addEventListener('click', start);
      // covers play started any other way (keyboard on the video, autoplay
      // policies, a second click landing on the element itself)
      videoEl.addEventListener('play', () => {
        frameEl.classList.remove('is-idle');
        videoEl.controls = true;
      });
      return;
    }
    projectMedia.innerHTML = `
      <div class="project-video-frame">
      ${data.videoSvg.replace('<svg ', '<svg class="video-bg" ')}
      <div class="project-video-overlay">
        <button class="play-btn" id="projectPlayBtn" aria-label="Play case study film">
          <svg viewBox="0 0 24 24"><polygon points="5,3 21,12 5,21"></polygon></svg>
        </button>
        <span class="video-caption">${data.videoCaption}</span>
      </div></div>` + details;
    const playBtn = projectMedia.querySelector('#projectPlayBtn');
    playBtn.addEventListener('click', () => {
      projectMedia.classList.toggle('playing');
      const playing = projectMedia.classList.contains('playing');
      playBtn.querySelector('svg').innerHTML = playing
        ? '<rect x="5" y="3" width="5" height="18"></rect><rect x="14" y="3" width="5" height="18"></rect>'
        : '<polygon points="5,3 21,12 5,21"></polygon>';
      projectMedia.querySelector('.video-caption').textContent = playing
        ? 'PLAYING — A LOOK BEHIND THE PROJECT'
        : data.videoCaption;
    });
    return;
  }

  if (data.layout === 'mixed') {
    projectMedia.innerHTML = `
      <div class="project-mixed-hero">${mediaTag(data.hero || data.heroSvg, data.id, 0, data.title)}</div>
      <div class="project-mixed-details">
        ${(data.detailImages || []).map((entry, i) => {
          // Width comes from the photo's own orientation. In equal square
          // boxes a portrait shot loses far more to the cover crop than a
          // landscape one, so give portraits a narrower box and landscapes
          // a wider one — each ends up nearer its native ratio.
          const o = (entry && typeof entry === 'object' && entry.w && entry.h)
            ? (entry.w >= entry.h ? 'is-landscape' : 'is-portrait')
            : '';
          return `<div class="${o}">${mediaTag(entry, data.id, i + 1, data.title)}</div>`;
        }).join('')}
      </div>`;
    return;
  }

  // single (default) — `image` is the real-asset field, `svg` the legacy one
  projectMedia.innerHTML = mediaTag(data.image || data.svg, data.id, 0, data.title);
}

// both full-screen overlays (project detail + the about page) share one
// "return to where you were" scroll position, since only one can
// realistically be open at a time

// remembered so a language switch while the overlay is open re-renders it
// in place instead of leaving stale copy behind the new UI language
let openProjectId = null;

function fillProjectDetail(id) {
  const data = projectData[id];
  if (!data) return;
  // translated strings win where they exist; the English objectData values
  // remain the fallback so a missing key degrades to English rather than
  // blanking the field. The TITLE is never translated — these are the
  // names of actual works, not descriptions of them.
  projectCat.textContent = T.t('cat.' + data.category) || data.category;
  projectTitle.textContent = data.title;

  // WHERE THE TITLE SITS IS PER PROJECT, for now. Its home is the top of
  // .project-body - the write-up column - which is where all six have always
  // had it. A project carrying `titleTop: true` gets the chip and the heading
  // moved into .project-head instead, above the media, where they take the
  // full 956px measure rather than a ~360px sidebar's.
  //   Moving the nodes rather than duplicating them: the <h2> is the
  // overlay's aria-labelledby target, so there can only ever be one of it.
  //   Both branches run on every open, not just the opt-in one. The overlay
  // is a single reused panel, so whatever the last project did to the DOM is
  // the state the next one inherits - without the else the first titleTop
  // project would leave the heading up top for everything opened after it.
  if (data.titleTop) {
    projectHead.append(projectCat, projectTitle);
  } else {
    projectDesc.before(projectCat, projectTitle);
  }
  projectDesc.textContent = T.t('proj.' + id + '.desc') || data.desc;
  projectType.textContent = T.t('proj.' + id + '.type') || data.type;
  projectYear.textContent = data.year;
  projectRole.textContent = T.t('proj.' + id + '.role') || data.role;

  // long-form write-up is optional: split into paragraphs on blank lines,
  // and the whole block is hidden when the project has no body text so a
  // short entry doesn't leave an empty gap under the description
  const bodyEl = document.getElementById('projectBody');
  if (bodyEl) {
    const body = T.t('proj.' + id + '.body');
    bodyEl.textContent = '';
    if (body) {
      body.split(/\n{2,}/).forEach((para) => {
        const el = document.createElement('p');
        el.textContent = para.trim();
        bodyEl.appendChild(el);
      });
    }
    bodyEl.hidden = !body;
  }
}

function openProject(id) {
  const data = projectData[id];
  if (!data) return;
  // stamped on so the media helpers can build proj.<id>.alt.<n> keys
  data.id = id;
  renderProjectMedia(data);
  // after the media, never before: renderProjectMedia opens with
  // stopModelStages(), which would tear down a stage set up ahead of it
  renderProjectStage(data);
  // renderProjectMedia returns early per layout, so the zoom affordances are
  // applied here — its single call site — rather than before each return
  markZoomableImages();
  openProjectId = id;
  fillProjectDetail(id);
  projectOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset the PANEL's own scroll, not the window's. Scrolling the window to 0
  // here was visible for the whole 0.55s slide-up — the page behind the panel
  // visibly jumped to the top. The panel is position:fixed and covers the
  // viewport, so the window's scroll position doesn't matter while it's open,
  // and body overflow:hidden already holds the page still.
  projectOverlay.scrollTop = 0;
  activateDialog(projectOverlay);
}

function closeProject() {
  openProjectId = null;
  // a requestAnimationFrame left running behind a closed overlay is a phone
  // battery spent on something nobody is looking at
  stopModelStages();
  projectOverlay.classList.remove('open');
  document.body.style.overflow = '';
  deactivateDialog(projectOverlay);
}

/* ==========================================================================
   ROUTING

   The case studies and the about page are overlays, and for a while that
   meant the site had exactly one URL. For a portfolio that is a real cost:
   nobody can send a colleague "look at the Caterpillar one", a case study
   cannot be linked from an application or a LinkedIn post, Google has one
   page to index instead of seven, and the browser's Back button left the
   site instead of closing the panel.

   So the overlays get URLs - /work/<id> and /about - without becoming
   separate documents. vercel.json rewrites those paths to index.html; this
   reads the path back and opens the right panel.

   The shape is deliberately one-way: openProject/closeProject stay pure UI
   and know nothing about history. Everything a visitor can click goes
   through navigate(), popstate goes through syncToRoute(), and both end at
   the same place. Nothing calls the UI functions and the history API in the
   same breath, which is how these end up out of step.
   ========================================================================== */

/* ------------------------------------------------------------------------
   SECTION 07 · ROUTING
   navigate() in, popstate out. Never call a UI fn and history in one breath.
   ------------------------------------------------------------------------ */
/* The address bar is only half of a shareable URL - the other half is what
   the link looks like when it is pasted somewhere. Without this every case
   study would share as "Jack Murray · UX Designer" with the home page's
   canonical, which tells Google the six project URLs are duplicates of "/"
   and collapses them straight back into one page.
   Re-run on language change too (see T.onChange), or a visitor who switches
   language with a panel open keeps the previous language's title. */
function applyRouteMeta(r) {
  const base = T.t('html.title') || 'Jack Murray';
  const title = r.kind === 'project' && projectData[r.id]
    ? projectData[r.id].title + ' · ' + base
    : r.kind === 'about'
      ? T.t('aboutpage.heading').replace(/[.!]$/, '') + ' · ' + base
      : base;
  document.title = title;
  const url = 'https://jackmurraydesign.com' + pathForRoute(r);
  const canonical = document.querySelector('link[rel=canonical]');
  if (canonical) canonical.href = url;
  const og = document.querySelector('meta[property="og:url"]');
  if (og) og.content = url;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = title;
  const desc = r.kind === 'project' && projectData[r.id]
    ? T.t('proj.' + r.id + '.desc') || projectData[r.id].desc
    : T.t('html.description');
  for (const sel of ['meta[name=description]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    const el = document.querySelector(sel);
    if (el && desc) el.content = desc;
  }
}

function routeFromPath(path) {
  const m = path.match(/^\/work\/([\w-]+)\/?$/);
  if (m && projectData[m[1]]) return { kind: 'project', id: m[1] };
  if (/^\/about\/?$/.test(path)) return { kind: 'about' };
  return { kind: 'home' };
}
function pathForRoute(r) {
  if (r.kind === 'project') return '/work/' + r.id;
  if (r.kind === 'about') return '/about';
  return '/';
}

/* Make the UI match a route. Close first, so switching straight from one
   panel to another (the about page links into a case study) never has both
   open at once. */
function syncToRoute(r) {
  if (r.kind !== 'project' && projectOverlay.classList.contains('open')) closeProject();
  if (r.kind !== 'about' && aboutOverlay.classList.contains('open')) closeAboutPage();
  if (r.kind === 'project' && openProjectId !== r.id) openProject(r.id);
  if (r.kind === 'about' && !aboutOverlay.classList.contains('open')) openAboutPage();
  applyRouteMeta(r);
}

function navigate(r) {
  if (pathForRoute(r) !== location.pathname) {
    history.pushState({ kind: r.kind, id: r.id || null }, '', pathForRoute(r));
  }
  syncToRoute(r);
}

/* Closing goes BACK rather than pushing "/", so opening and closing a panel
   does not leave a trail of entries to walk out through.
   That is only safe because of the replaceState in the boot block below:
   a visitor who lands directly on /work/<id> gets a synthetic "/" entry
   underneath, so there is always somewhere of ours to go back to and Back
   can never step off the site. */
function leaveOverlay() {
  if (history.state && history.state.kind && history.state.kind !== 'home') history.back();
  else navigate({ kind: 'home' });
}

window.addEventListener('popstate', () => syncToRoute(routeFromPath(location.pathname)));

/* Cards are real links now, so a plain click is the only one to intercept.
   Cmd/ctrl/shift/middle-click and "open in new tab" have to keep working -
   that is most of the point of making them links rather than buttons, and
   calling preventDefault on them would quietly take it away again. */
function isPlainClick(e) {
  return !e.defaultPrevented && e.button === 0
    && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
document.addEventListener('click', (e) => {
  const card = e.target.closest?.('.card[href]');
  if (!card || !isPlainClick(e)) return;
  e.preventDefault();
  navigate({ kind: 'project', id: card.dataset.project });
});
/* HOME LINKS - the JM logo and BACK TO TOP. Both were href="#top", which
   works but leaves "/#top" in the address bar, and Jack's point about that
   is a sharing point rather than a tidiness one: "when I reload the site
   with jackmurraydesign.com, it goes to the top... if someone copies the
   link for the page and they're at the very top, then that might be good."
   A URL with a stale anchor on it is a worse thing to paste than the bare
   domain, and the anchor buys nothing, because landing on "/" already puts
   you at the top.
   Routed rather than special-cased: they are href="/" links, so they are
   copyable and crawlable like the cards, and a plain click goes through
   navigate() exactly as CLAUDE.md requires - nothing here calls a UI
   function and the history API in the same breath. Modified clicks fall
   through to the browser, so cmd-click still opens a new tab. */
document.addEventListener('click', (e) => {
  const home = e.target.closest?.('.nav-logo, .back-top');
  if (!home || !isPlainClick(e)) return;
  e.preventDefault();
  navigate({ kind: 'home' });
  /* navigate() only pushes when the PATHNAME differs, and a hash is not
     part of the pathname - so arriving from an old /#top link and clicking
     home would otherwise leave the hash sitting there. */
  if (location.hash) history.replaceState(history.state, '', pathForRoute({ kind: 'home' }));
  const hero = document.getElementById('top');
  // focus first, scroll second: focus() would do its own instant jump
  hero?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

projectBack.addEventListener('click', leaveOverlay);

// full about page overlay — opened from the nav link, the about section
// title, or the explicit "read more" button
/* ------------------------------------------------------------------------
   SECTION 08 · ABOUT OVERLAY
   Its photos are held back on data-src until opened - 1.6MB off the home page.
   ------------------------------------------------------------------------ */
const aboutOverlay = document.getElementById('aboutOverlay');
const aboutBack = document.getElementById('aboutBack');
/* The panel's photos carry data-src rather than src (see index.html), so
   they cost nothing until someone opens it. Runs before the class is added,
   so the request is in flight as the slide starts rather than after it, and
   it is a no-op on every open after the first. content-visibility: hidden
   was tried for this first and does not work: it computes, but the engine
   leaves contain: none and the subtree stays laid out, so the images fetch
   anyway. Holding the URL back is the only version that is actually true. */
function loadAboutPhotos() {
  // the <source> first: a <picture> picks its candidate when the img gets
  // its src, so a source still holding data-srcset at that moment is simply
  // not in the running and the browser takes the jpeg
  aboutOverlay.querySelectorAll('source[data-srcset]').forEach((s) => {
    s.srcset = s.dataset.srcset;
    s.removeAttribute('data-srcset');
  });
  aboutOverlay.querySelectorAll('img[data-src]').forEach((img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}
function openAboutPage(e) {
  e?.preventDefault();
  loadAboutPhotos();
  aboutOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset the PANEL's own scroll, not the window's. Scrolling the window to 0
  // here was visible for the whole 0.55s slide-up — the page behind the panel
  // visibly jumped to the top. The panel is position:fixed and covers the
  // viewport, so the window's scroll position doesn't matter while it's open,
  // and body overflow:hidden already holds the page still.
  aboutOverlay.scrollTop = 0;
  activateDialog(aboutOverlay);
}
function closeAboutPage() {
  aboutOverlay.classList.remove('open');
  document.body.style.overflow = '';
  deactivateDialog(aboutOverlay);
}
/* goAbout, not openAboutPage: the panel has a URL now and every way in has
   to agree about that, or Back and the address bar disagree with the page. */
function goAbout(e) { e?.preventDefault(); navigate({ kind: 'about' }); }
document.getElementById('navAboutLink')?.addEventListener('click', goAbout);
document.getElementById('aboutTitle')?.addEventListener('click', goAbout);
document.getElementById('aboutTitle')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') goAbout(e);
});
document.getElementById('aboutReadMore')?.addEventListener('click', goAbout);
// the portrait is a second door to the same page, not decoration
document.querySelectorAll('.about-panel .about-portrait')
  .forEach((el) => el.addEventListener('click', goAbout));
aboutBack?.addEventListener('click', leaveOverlay);

// A link in the about copy can hand off to a project. Delegated on document
// rather than bound to the anchor: apply() rewrites that paragraph's
// innerHTML on every language switch, so a listener attached to the link
// itself would be thrown away the first time someone changed language.
//
// Close the about page BEFORE opening the project. Only one overlay is meant
// to be open at a time, and closing first means deactivateDialog restores
// focus to the control that opened the about page, which openProject then
// records as the project's own return target - so the project's back button
// lands you on the page behind, not on a link inside an overlay that is no
// longer open. The href is a real fallback: without JS, or on a
// middle-click, it goes to the work section.
document.addEventListener('click', (e) => {
  const link = e.target.closest?.('[data-open-project]');
  if (!link) return;
  const id = link.dataset.openProject;
  if (!projectData[id]) return;
  e.preventDefault();
  navigate({ kind: 'project', id });
});

// Escape closes whichever overlay is currently open, restoring the
// exact scroll position the user was at before it opened
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  // innermost first, or Escape would close the project overlay out from
  // under an open lightbox
  if (lightbox && lightbox.classList.contains('open')) closeLightbox();
  // through the router, so Escape and the Back button land in the same place
  else if (projectOverlay.classList.contains('open')) leaveOverlay();
  else if (aboutOverlay.classList.contains('open')) leaveOverlay();
});

// live clock — small brutalist data readout in the footer
/* ------------------------------------------------------------------------
   SECTION 09 · PAGE CHROME
   Clock, cursor dot, scroll reveal, and the about counters.
   ------------------------------------------------------------------------ */
const liveClock = document.getElementById('liveClock');
function updateClock() {
  if (!liveClock) return;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  liveClock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
updateClock();
setInterval(updateClock, 1000);

// custom cursor follower
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // reduced motion: skip the lagged follow loop below and just snap
    // the dot straight to the pointer, no continuous rAF needed
    if (prefersReducedMotion) {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.2;
    curY += (mouseY - curY) * 0.2;
    cursorDot.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  if (!prefersReducedMotion) animateCursor();

  // Delegated rather than bound per element: the project overlay, its play
  // button and its zoomable images are built when a project opens, long after
  // a one-time querySelectorAll has run — those never grew the cursor before.
  // mouseenter/mouseleave don't bubble, so delegation uses mouseover/mouseout
  // and ignores moves that stay inside the same target (entering a child fires
  // mouseout on the parent, which would otherwise flicker the dot).
  const CURSOR_TARGETS = '.card, .btn-block, a, .skills span, .filter-btn, .project-back, .theme-switch, .form-submit, #aboutTitle, .about-back, .about-readmore-btn, .about-portrait, .play-btn, .video-play, #projectMedia img[data-full], .sticker, .placed-sticker, .cv-btn, .copy-email-btn, .egg-menu button, #chaosPlayBtn, #pongClose, #chaosStopBtn, .lang-toggle, .lang-option, .lightbox-close';
  const cursorEdge = (e, add) => {
    const hit = e.target.closest && e.target.closest(CURSOR_TARGETS);
    if (!hit) return;
    if (e.relatedTarget && hit.contains(e.relatedTarget)) return;
    cursorDot.classList.toggle('big', add);
  };
  document.addEventListener('mouseover', (e) => cursorEdge(e, true));
  document.addEventListener('mouseout', (e) => cursorEdge(e, false));
}

/* SCROLL REVEAL, AND WHY WHAT IS ALREADY ON SCREEN DOES NOT GO THROUGH THE
   OBSERVER AT ALL.
   A .reveal element starts at opacity 0 AND 40px down, and the observer said
   "show it once 15% of it is on screen". That is a fraction of the ELEMENT,
   so what it means in pixels depends entirely on how tall the element is:
   15% of a 32px heading is 5px, and 15% of a 714px project card is 107px.
   Once .hero came up to 66vh so the cards would break the fold, the first
   row peeked 63.5px over it at 1440x900 - ratio 0.089, under the bar - so
   the cards sat at opacity 0 and the thing the shorter hero exists to show
   was invisible until you scrolled. Jack: "they're not loading
   automatically... you can't see them unless you scroll down."
   RAISING THE THRESHOLD IS NOT ENOUGH, and the phone is what proves it. The
   40px offset is part of the resting state, so an unrevealed card sits 40px
   lower than where it will end up: at 390x844 the settled card clears the
   fold by 24.5px while the unrevealed one is 15.5px BELOW it. Observing it
   at any threshold cannot work, because the element is only on screen once
   it has been revealed and it is only revealed once it is on screen.
   So the load case does not use an observer. It takes the element's own
   transform back out of its rect to find where it will SETTLE, and reveals
   it outright if that lands in the viewport. Everything below the fold keeps
   the 15% rule, which is where it has always been right.
   The class goes on in a rAF so the browser paints the resting state first
   and the transition actually runs - set it synchronously and the element
   snaps in. The setTimeout behind it is not belt and braces for its own
   sake: a rAF never fires in a background tab, and an element that is
   invisible until a frame is painted is one bad assumption away from
   content that never appears. Both paths are idempotent. */
const revealEls = document.querySelectorAll('.reveal');
function showReveal(el) {
  if (el.classList.contains('in-view')) return;
  requestAnimationFrame(() => el.classList.add('in-view'));
  setTimeout(() => el.classList.add('in-view'), 300);
}
/* THE TRIGGER IS A DISTANCE, NOT A FRACTION, and that is the whole point.
   It was "once 15% of the element is on screen", which is a share of the
   ELEMENT - so the taller a block is, the longer it waits. Measured at
   1440x900 that is how far you had to scroll PAST a block's top edge before
   it would even begin to appear:
     .about-panel 747px tall -> 112px      .section-head 154 ->  23px
     .card        714px tall -> 107px      .filters       90 ->  14px
     .contact-form 526       ->  79px      .contact-bottom 23 ->   3px
   Exactly backwards. The big photo-carrying blocks - the ones that are
   obviously there and obviously blank - waited longest, while a 23px strip
   appeared instantly. Then the 40px offset and the 0.8s fade ran on top, so
   a card was blank for 107px of scroll and still arriving for most of a
   second after that. Jack: "the user, I feel like, should always know that
   there's something under."
   A margin on the root fixes the kind, not just the degree: 20% of the
   viewport (180px at 900) means every block starts its fade while it is
   still below the fold, whatever size it is, and is already part-way
   through by the time any of it is visible. At a normal 600px/s that is
   300ms of head start on a 0.8s fade.
   No threshold, so "intersecting" means intersecting the EXPANDED root -
   one rule, size-independent. */
const onScrollObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '0px 0px 20% 0px' }
);
function routeReveal(el) {
  if (el.classList.contains('in-view')) return;
  const r = el.getBoundingClientRect();
  // where it will be once .in-view takes the offset off, read from the
  // element's own computed transform rather than hardcoding the 40
  const shift = new DOMMatrixReadOnly(getComputedStyle(el).transform).m42;
  if (r.top - shift < window.innerHeight && r.bottom - shift > 0) showReveal(el);
  else onScrollObserver.observe(el);
}
revealEls.forEach(routeReveal);
/* AND AGAIN ON load, because the routing above reads a rect from a layout
   that is not final yet: this file runs at the end of body, before webfonts
   have swapped. An element that was 10px below the fold at parse time and
   10px above it once Archivo Black arrives would have gone to the scroll
   observer and sat there. Re-routing is free - anything already revealed is
   skipped, and re-observing with the same observer is a no-op. */
window.addEventListener('load', () => {
  revealEls.forEach((el) => {
    if (!el.classList.contains('in-view')) routeReveal(el);
  });
});

// animated stat counters
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  // Numbers ticking up is motion, and the global CSS block in styles.css
  // cannot reach it - this is a rAF loop writing textContent, not an
  // animation or a transition. Show the figure and skip the count.
  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1400;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
/* Zero them here, not in the markup. The HTML carries the real figures (see
   the comment on .about-stats in index.html) so that anything reading the
   page without running the count - a crawler, an AI summarising the site, a
   browser with JS off - gets 4, 18+ and 35 rather than three zeroes. The
   count-up then needs a zero to start from, and it has to be written before
   the first paint, or the row flashes its final value and snaps back to 0 the
   moment it scrolls into view. This loop runs at parse time, which is before
   paint; reduced-motion users keep the figure, since there is no count for
   them to start. */
document.querySelectorAll('.stat-num[data-count]').forEach((el) => {
  if (!prefersReducedMotion) el.textContent = '0';
  counterObserver.observe(el);
});

// hero name entrance
document.querySelectorAll('.hero-name .line').forEach((line, i) => {
  line.style.opacity = 0;
  line.style.transform = 'translateY(60px)';
  line.style.transition = 'opacity .9s ease, transform .9s cubic-bezier(.2,.8,.2,1)';
  setTimeout(() => {
    line.style.opacity = 1;
    line.style.transform = 'translateY(0)';
  }, 150 + i * 140);
});

// The hero's role line is a standing headline now, so the typewriter that
// used to cycle hero.taglines here is gone - along with the ResizeObserver
// that reserved the tallest line's height, which only existed because the
// text kept changing length. See the note in index.html.

/* ------------------------------------------------------------------------
   SECTION 10 · HERO INTERACTIONS
   The name tilt. The shape field is SECTION 15.
   ------------------------------------------------------------------------ */
const heroEl = document.querySelector('.hero');
const heroNameEl = document.querySelector('.hero-name');

// random hero heading glitch flicker
if (heroNameEl && !prefersReducedMotion) {
  function scheduleGlitch() {
    const delay = 4000 + Math.random() * 5000; // every ~4-9s
    setTimeout(() => {
      heroNameEl.classList.add('glitch');
      setTimeout(() => heroNameEl.classList.remove('glitch'), 240);
      scheduleGlitch();
    }, delay);
  }
  scheduleGlitch();
}

// mobile nav toggle
/* ------------------------------------------------------------------------
   SECTION 11 · NAVIGATION
   Mobile drawer + the scrolled state.
   ------------------------------------------------------------------------ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMobileNav() {
  // the open/closed state was carried entirely by a class, so the control
  // announced itself as the same thing whether the drawer was open or shut
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.classList.add('open');
  navLinks.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  syncNavDrawerInert();
  const first = navLinks.querySelector('a');
  if (first) first.focus();
}
function closeMobileNav() {
  const hadFocusInside = navLinks.contains(document.activeElement);
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
  syncNavDrawerInert();
  // inert on the drawer would otherwise drop focus to <body>, stranding
  // the keyboard user at the top of the document
  if (hadFocusInside) navToggle.focus();
}
navToggle?.addEventListener('click', () => {
  navToggle.classList.contains('open') ? closeMobileNav() : openMobileNav();
});
navOverlay?.addEventListener('click', closeMobileNav);
navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));

// nav background on scroll past hero
const nav = document.getElementById('nav');
function updateNavState() {
  const heroBottom = heroEl.getBoundingClientRect().bottom;
  nav.classList.toggle('scrolled', heroBottom <= 80);
}
window.addEventListener('scroll', updateNavState);
updateNavState();

// dark / light mode toggle
/* ------------------------------------------------------------------------
   SECTION 12 · THEME SWITCH
   applyTheme on load, switchTheme on press. Two paths - read the comments.
   ------------------------------------------------------------------------ */
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // The control is a switch now: both icons are drawn in the markup and the
  // knob slides, so there is no glyph left to rewrite. What a switch does
  // owe a screen reader is its state, which is aria-checked - "on" means
  // dark. Set here rather than at the click handler so the attribute is
  // already right on first paint, including when the OS preference or a
  // saved choice opened the page in dark.
  themeToggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
  localStorage.setItem('jm-theme', theme);
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/* Switching, as opposed to applying. The difference is the class: for the
   length of the change it puts every element on one transition clock (see
   the .theme-switching block in styles.css), so the page changes colour as
   a single surface instead of component by component.
   It belongs here and not in applyTheme because applyTheme also runs on
   load, and a page that cross-fades out of the wrong colour every time it
   opens is worse than one that snapped.
   The timeout reads the duration from the token rather than restating it -
   a 450 written here would quietly stop matching the CSS the first time
   the token is tuned - and the class is cleared on a timer rather than on
   transitionend, which fires once per property per element and never at
   all for whatever happened not to change. */
/* Switching, as opposed to applying, in two paths.

   The good one is a circular wipe out of the switch itself, using the View
   Transitions API: the browser snapshots the page before and after, and the
   new snapshot is revealed by a clip-path circle growing from the control
   the visitor just pressed. It reads as one gesture with a cause - you
   flipped the switch and the new mode flooded out of it - rather than as the
   page changing colour on its own. The knob does not slide during this; it
   is already in its new position when the circle uncovers it, which at the
   exact origin of the wipe is the right story anyway.

   The fallback is what the site did before, and it stays for two cases:
   a browser without startViewTransition, and anyone who has asked for
   reduced motion, for whom a 600ms wipe across the whole viewport is
   exactly the thing they turned off. They get the coordinated cross-fade
   instead - every element on one clock, which is still a long way from the
   component-by-component mess this started as. */
let themeSwitchTimer = 0;
function coordinatedSwitch(theme) {
  const root = document.documentElement;
  const secs = parseFloat(getComputedStyle(root).getPropertyValue('--theme-dur')) || 0.45;
  root.classList.add('theme-switching');
  applyTheme(theme);
  clearTimeout(themeSwitchTimer);
  themeSwitchTimer = setTimeout(() => {
    root.classList.remove('theme-switching');
  }, secs * 1000 + 60);
}
function switchTheme(theme) {
  if (prefersReducedMotion || typeof document.startViewTransition !== 'function') {
    coordinatedSwitch(theme);
    return;
  }

  // Origin: the middle of the switch. Radius: the furthest corner from it,
  // so the circle always finishes off-screen rather than stopping short and
  // leaving a visible edge. getBoundingClientRect is viewport-relative,
  // which is what clip-path on the snapshot wants - the snapshot is the
  // viewport, not the document.
  const r = themeToggle.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const end = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  /* .theme-instant for the length of the snapshot, and this one is not
     optional. The new snapshot is captured the moment the callback returns -
     and 51 elements on this page carry their own colour transitions (the
     badge is .25s on background and color, the cards, the chips, the nav,
     the form fields). Those transitions START at the callback, so at capture
     time every one of them still computes its OLD colour, and the snapshot
     freezes it that way for the whole wipe: inside the circle you get a new
     page with an old badge drawn on it. Worse for the badge specifically,
     whose border-color is NOT in its transition list - the border arrives
     instantly and the fill lags, so it reads as two different boxes stacked
     on each other. That is the artifact Jack reported.
     Killing transitions makes every element final before the capture, so
     the snapshot is simply the new theme. Nothing animates when the class
     comes off again, because everything is already where it belongs.
     No .theme-switching here either: under the wipe the live page is hidden
     behind a static snapshot, so cross-fading it as well buys nothing. */
  const root = document.documentElement;
  root.classList.add('theme-instant');
  const transition = document.startViewTransition(() => applyTheme(theme));
  // ready settles once the snapshots exist and the pseudo tree is built, so
  // it is the earliest safe point to let transitions back in. finally, not
  // then: a skipped transition rejects, and the class still has to come off.
  // .catch after the .finally, not instead of it: finally passes a rejection
  // straight through, so this chain is its own promise and an aborted
  // transition - hit the switch twice quickly and the first one is skipped -
  // became an unhandled InvalidStateError in the console. The class still has
  // to come off either way, which is what finally is for.
  transition.ready
    .finally(() => root.classList.remove('theme-instant'))
    .catch(() => {});
  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${end}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          /* ease-out, NOT the page's own cubic-bezier(.32,.72,0,1). That
             curve is "fast out, long settle", which is right for a colour
             change and wrong for a wipe: measured, it put the circle 78% of
             the way across at a quarter of the duration and 95% at half, so
             all the travel happened in the first ~100ms and the rest was an
             invisible crawl in the far corner. At 450ms that read as no
             animation at all, which is exactly what Jack reported.
             ease-out spreads it - 38% / 68% / 91% at the quarters - so the
             edge is visibly moving for the whole duration. The wipe's
             subject is the travel; the settle it was borrowing belongs to
             something that is changing in place. */
          easing: 'cubic-bezier(0, 0, .58, 1)',
          // 450, down from 620. This is a control people press repeatedly to
          // compare the two modes, not a one-off reveal, and a transition you
          // sit through twice in five seconds should be short. 450 still
          // reads as a travelling edge; below ~350 it starts to look like a
          // flash rather than a wipe.
          // The same curve the rest of the page eases on - fast out of the
          // switch, long settle, so the wipe arrives rather than sweeps
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    // ready rejects when a transition is skipped, which is what happens if
    // the switch is hit twice before the first finishes. The theme has still
    // been applied by then, so there is nothing to recover - just don't
    // throw an unhandled rejection over it.
    .catch(() => {});
}
// The inline script in <head> already set data-theme before the first paint
// (see the note there). Read that back rather than deriving the answer a
// second time, so the two can never drift apart; the localStorage and OS
// checks stay only as a fallback for the case where that script threw.
// This call is still what wires up aria-checked and the themechange event.
const savedTheme = document.documentElement.getAttribute('data-theme')
  || localStorage.getItem('jm-theme')
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  switchTheme(current === 'dark' ? 'light' : 'dark');
});

/* ------------------------------------------------------------------------
   SECTION 13 · MENU SCROLL-DISMISS
   Shared by the language menu and the egg menu.
   ------------------------------------------------------------------------ */
// A menu whose trigger the reader has scrolled past is orphaned. The egg menu
// is the case that matters: it is position: fixed at the bottom-left while its
// trigger sits in the footer, so opening it and scrolling up left a floating
// panel attached to nothing on screen. (The language dropdown rides along with
// the fixed nav, so its trigger is never off screen and it has no need of
// this.)
//
// A distance threshold rather than any scroll at all: opening a menu can
// itself shift the page by a pixel or two, and a menu that closes during the
// gesture that opened it is more annoying than one that stays.
const MENU_SCROLL_DISMISS = 40;
let menuScrollAnchor = null;
// Reads the menu's own class rather than trusting the caller's open/closed
// flag. Taking the flag looked right and was not: a trigger's click bubbles to
// document, where some other dropdown's outside-click handler runs and re-arms
// this watcher - so opening a menu could disarm the watcher just armed for it,
// and it then survived any amount of scrolling. The state that matters is on
// the element.
function armMenuScrollDismiss() {
  menuScrollAnchor = eggMenu?.classList.contains('open') ? window.scrollY : null;
}
window.addEventListener('scroll', () => {
  if (menuScrollAnchor === null) return;
  if (Math.abs(window.scrollY - menuScrollAnchor) < MENU_SCROLL_DISMISS) return;
  menuScrollAnchor = null;
  setEggMenu(false);
}, { passive: true });



/* ------------------------------------------------------------------------
   SECTION 15 · HERO SHAPE FIELD
   Eleven per theme, AUTHORED positions and AUTHORED paths. Four forms only.
   ------------------------------------------------------------------------ */
// floating geometric shapes — drift + rotate slowly and ease away from the
// cursor.
// Light mode: smooth circles/squares/triangles. Dark mode: sharp jagged
// stars/spikes, rebuilt whenever the theme flips.
// chaos mode (defined further below) cranks this up temporarily so the
// shapes spin and lunge harder without the animation loop needing to
// know anything about chaos mode itself
window.chaosBoost = 1;

const heroShapesContainer = document.getElementById('heroShapes');
if (heroShapesContainer) {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  let shapes = [];

  function starPoints(spikes, outerR, innerR, cx, cy) {
    const pts = [];
    const step = Math.PI / spikes;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = i * step - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(' ');
  }

  function createSvgShape(def, points) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.width = def.size + 'px';
    svg.style.height = def.size + 'px';
    svg.classList.add('shape', `shape-${def.type}`);
    if (def.vivid) svg.classList.add('is-vivid');
    svg.style.color = def.color;
    const poly = document.createElementNS(SVG_NS, 'polygon');
    poly.setAttribute('points', points);
    poly.style.fill = def.filled ? 'currentColor' : 'none';
    poly.style.stroke = 'currentColor';
    /* viewBox units, so this IS a percentage of the rendered size and
       scales for free. 3 everywhere, matching the divs - see the outline
       note in createShapeEl. It was 5 on triangles and 3 on stars, the
       star exception being that a sharp star's inner radius is 14 against
       an outer 48 and a 5-unit stroke closes the notches into a blob. The
       whole field is on one number, so the exception is gone and there is
       one outline weight on the page. */
    poly.style.strokeWidth = '2.6';
    svg.appendChild(poly);
    return svg;
  }

  /* Four forms, and that is the whole vocabulary: circle, square and
     triangle in light, jagged star in dark. An arc, a flat bar and a cross
     were added on 2026-11-10 to give the field more to look at and were
     cut the same day - "they dont fit". They were not wrong in isolation;
     they were wrong HERE. This page already carries a lot of distinct
     geometry - the hard rules, the cards, the chips, the
     name itself - and the field's job is to be the quiet layer behind all
     of it. Six kinds of thing drifting is a second subject. Variety in this
     field has to come from SIZE and FILL, not from new forms. */
  function createShapeEl(def) {
    if (def.type === 'triangle') {
      return createSvgShape(def, '50,6 94,94 6,94');
    }
    if (def.type === 'star') {
      const spikes = def.spikes || 6;
      return createSvgShape(def, starPoints(spikes, 48, def.sharp ? 14 : 22, 50, 50));
    }
    const el = document.createElement('div');
    el.className = `shape shape-${def.type} ${def.filled ? 'filled' : 'outline'}`
      + (def.vivid ? ' is-vivid' : '');
    el.style.width = def.size + 'px';
    el.style.height = def.size + 'px';
    el.style.color = def.color;
    /* OUTLINE WEIGHT SCALES WITH THE SHAPE, and that is a fix rather than a
       preference. The SVG shapes have always been proportional - stroke-width
       is in viewBox units, so a triangle's outline is 5% of its size whatever
       that size is - while circles and squares took a flat 3px from CSS. So
       the same field held outlines at 2.3% of diameter on the 132 circle and
       6.7% on a 45 square: the big shapes read as weedy wireframes next to
       the small ones, and nothing said why.
       2.6% governs every outline in the field, drawn or SVG, so there is
       ONE outline weight on the page: 191 -> 5px, 137 -> 4, and everything
       from 84 down lands on the 2px floor.
       It was 3% with a 3px floor for one release, and both came down again
       on Jack naming the two shapes at either end of the range: the 191
       circle "should probably be a little thinner as well" and the 36 amber
       circle "even thinner". The floor is what the 36 was hitting, so the
       percentage alone could not have moved it; 2px at .34 alpha is still a
       line on a retina screen, which is the thing the floor exists to
       guarantee.
       It was 5% for a release and that was too heavy. Jack, on the big
       circle: "make it less thick. Go back to things not being as thick. I
       think that's probably better, actually." At 5% that circle carried a
       10px line, which on an outline that large stops being a drawn edge
       and becomes a band - and since the field had just grown its largest
       shape from 132 to 191, the rule got louder without anyone changing
       it. At 3% only the two biggest shapes carry any extra weight at all,
       which is the entire reason the proportional rule exists; the rest
       read exactly as they did under the old flat 3px.
       The floor is there because 3% of the smallest shape is barely 1px,
       which at .34 alpha on a phone is not a line, it is a rumour. */
    if (!def.filled) {
      el.style.borderWidth = Math.max(2, Math.round(def.size * 0.026)) + 'px';
    }
    return el;
  }

  /* ELEVEN, and it has been twelve before - the history matters, because the
     first twelve were not twelve things you could see: three of them were
     var(--highlight), which light mode resolves to stone at 1.43:1 on the
     ground, and at .38 alpha that is a shape you cannot find. So it was
     really nine objects and three ghosts, and it was cut to nine. It came
     back to twelve on 2026-11-10 by adding three more shapes that actually
     read, not by reinstating the ghosts. **Do not colour a light-mode shape
     --highlight.**
     AMBER IS DOWN TO ONE SHAPE, and it has been a pair and a trio on the
     way here - both of those moves were forced by the hue arithmetic
     rather than chosen. It grew to three when the square over JACK went
     coral (four corals over three bands forces a repeat by pigeonhole, so
     the 61px triangle took the amber), and fell back to one when the small
     circle went blue, which took amber's only member left of centre and
     left it failing the both-sides rule.
     On stage the counts are 3 blue, 3 coral, 2 plum, 1 amber, 1 black, so
     every band gets one of each three-count hue and the rule is a
     guarantee. With the offstage sweeper counted blue is 4, which is what
     the offstage flag is for - see tools/field-check.js.

     vivid: true on TWO of the eleven in light, and they are the two SMALLEST
     shapes, which is what vivid is for - the third was the filled blue
     square at dead centre, cut on 2026-11-11 as the loudest object in the
     field.
     At a flat .38 (the base alpha then; .34 now) the field read as pale,
     which is correct for texture
     and wrong as the only register the field has - "the contrast between
     restrained typography and occasional bright geometry could be really
     effective" was the note, and occasional is the operative word. The vivid
     ones are the small ones, so what reads brighter is a punctuation mark
     rather than a bigger wash. The 104px and 132px shapes stay pale on
     purpose: a large shape at .72 stops being background. See
     .shape.is-vivid in styles.css for the alphas and what text crossing one
     measures. */
  /* SLOTS. `at` is the shape's resting centre as a fraction of the field
     box - which is the hero plus the 306px it overhangs into #work, not the
     hero alone, so a y of .86 is down in the band under SELECTED PROJECTS.

     These used to be Math.random() per shape per build, and that was the
     whole of what made the field look unconsidered. Random eleven-point
     scatter clumps: on any given load two or three shapes would overlap
     into one blob and a quadrant would be empty, and because it re-rolled
     on every load and every theme switch there was no arrangement to
     judge, let alone tune. Authored, the composition is a thing with
     intent that can be argued with - and it is the same one every time.

     The arrangement is THREE BANDS - four, four and three at full budget -
     and each band runs left to right across the field:
         TOP   y .25 .25 .26 .28   x .22 .42 .65 .90
         MID   y .47 .46 .50 .54   x .10 .30 .50 .88
         SEAM  y .80 .76 .72       x .18 .72 .92
     Measured against the real hero at 1440x900, where the field box is
     1440x1026 and every .reveal has settled: the nav ends at y .0916, the
     name occupies .2025-.5168, the side column .2491-.5168, the hero's 6px
     seam lands at .6007-.6065, the hero itself ends at .7018, SELECTED
     PROJECTS runs .7018-.8752 with its ink at .7641-.8421, the filter row
     .8752-.963, and the first card starts at .9615. So band one sits
     across the top of the name, band two across its foot and the margins
     either side, band three down past the seam.
     Those are 18px lower than they used to be, which is the marquee coming
     out on 2026-11-18: the hero centres its whole group inside 80vh, so
     losing a 38px strip from the bottom of that group moved everything in
     it down by half of what went.
     Band two sits at .44-.56 rather than .57-.66 and the ORIGINAL reason is
     gone with the strip - a near-black circle at .34 resting on a near-black
     slab was a smudge rather than a shape. It stays where it is because the
     second reason still holds: the band was moved down to .44-.56 to close
     a dead slice at .55-.60, and a band that rests low keeps something
     living in the space the seam used to occupy.
     That is the same "thin out across strip, heading and tags" the field
     was extended 306px for - it only actually happens if shapes LIVE down
     there rather than wandering down by luck, which is what eleven random
     y values gave: usually six in the hero and three nowhere useful.

     Two more things the slots are doing:
     - The two largest forms are a diagonal: the 191 outline circle at
       .65/.26 and the 137 at .18/.80. The name is heavy left and the
       column light right, and the field's largest SOLID sits bottom-right
       at .92/.72, in the same corner as the seam ring in styles.css.
     - No resting position is in the nav band or under the full stop after
       MURRAY, and both are about the SWING, not the resting point. Every
       shape travels +/- its amplitude, and the amplitudes are no longer
       uniform: the 36px amber circle swings +/-94px vertically, so a rest
       at .17 would have put it in the nav on half of every cycle, and the
       53px black circle swings +/-197px horizontally, so a rest near
       .55/.52 would park it on the full stop - which an earlier
       arrangement did, and it looked like a smudge on the page's one
       piece of punctuation-as-graphic. tools/field-check.js does this
       arithmetic per shape, at DARK's larger sizes, and it is not
       eyeballable - see the path note further down.
     This is NOT a keep-out. Nothing clamps anything at runtime, and a shape
     is free to drift over the name, the column, the nav and the seam -
     the build that fenced them out of measured boxes was tried and rejected
     and must not come back, see CLAUDE.md. This sets where a shape lives,
     not where it is allowed to go. */
  const smoothDefs = [
    { type: 'circle',   size: 137, color: 'var(--blue)',        filled: false, keep: 1,  at: [0.18, 0.80], aspect: 0.5,  ratio: 0.62, reach: 1.6 },
    /* AMBER, not coral, and that is arithmetic rather than taste. Making the
       square below red takes coral to four shapes, and four of one hue over
       three bands forces a repeat by pigeonhole - the exact "it looks almost
       like color coding" failure. Recolouring this one keeps coral at three.
       It is also the field's ONLY amber now: when the small circle went
       blue, amber lost its left-hand member and had to drop to a single
       shape to clear the both-sides rule. */
    /* THE TOP-RIGHT SWOOPER, and it is the bottom-right circle's path
       flipped. Jack: "we should have a small shape going near the... kind
       of opposite to the circle at the bottom right... it should kind of
       swoop around and should kind of get near the language button and the
       dark and light mode button."
       This slot was already the small shape in that corner, so it is tuned
       rather than joined by a twelfth: the field had just been asked to get
       LESS dense in dark, and a fourth amber would also break the hue
       arithmetic. aspect 1.3 / reach 1.6 takes it up to y .017 - which is
       inside the nav, where the language and theme controls sit at
       .025-.064 - and out past the right edge at 1.050, so it rises into
       the controls and leaves sideways. The two controls gained an opaque
       background in the same change; see the note on .theme-switch. */
    { type: 'triangle', size: 61,  color: 'var(--accent-warm)', filled: false, keep: 2,  at: [0.90, 0.28], aspect: 1.3,  ratio: 1.35, reach: 1.6, overNav: true },
    /* CORAL ON THE LEFT, which the field did not have: every red sat right
       of .87 and Jack called it - "make sure there's also red on the left
       side". The smallest solid coral, so it still reads as the one
       deliberate mark rather than drift. It was a squircle until the
       rounded corners were cut - see the vocabulary note in CLAUDE.md. */
    { type: 'square',   size: 47,  color: 'var(--accent)',      filled: true,  vivid: true, keep: 3,  at: [0.10, 0.55], aspect: 2.6,  ratio: 0.55, reach: 1.15 },
    /* THE BIG CIRCLE TRAVELS SIDEWAYS, and the direction is forced rather
       than chosen. Jack wanted "a little bit more of a trajectory... but I
       like that it's slow and that it is large", and vertical is simply not
       available to it: it rests at y .26 with the nav at .092 above and the
       full stop after MURRAY at y .42 just under its reach, which leaves
       about 39px of headroom up and 30 down before the envelope breaks a
       landmark. Sideways there is nothing in the way.
       aspect .45 with reach 1.6 gives it 284px of horizontal travel against
       80 before. It stays slow for free: it is the largest shape, so t is 0
       and its speed sits at the bottom of the range - 20px/s at peak, which
       is a slow sweep across a fifth of the screen rather than a faster
       shape or a bigger one. */
    { type: 'circle',   size: 191, color: 'var(--blue)',        filled: false, keep: 4,  at: [0.65, 0.26], aspect: 0.45, ratio: 0.75, reach: 1.6 },
    /* the field's largest SOLID, half off the right edge where the seam
       ring in styles.css also lives - and with reach 1.5 it now goes all the
       way off and comes back */
    { type: 'circle',   size: 113, color: 'var(--accent)',      filled: true,  keep: 5,  at: [0.92, 0.72], aspect: 0.6,  ratio: 0.78, reach: 1.5 },
    { type: 'circle',   size: 53,  color: 'var(--black)',       filled: true,  jitter: true, keep: 6,  at: [0.88, 0.54], aspect: 0.7,  ratio: 1.5,  reach: 1.0 },
    /* THE LIGHT RED SQUARE BY THE K, and getting here took a wrong turn
       worth recording. Jack asked for "the gray hollow box around JACK" to
       become a light red hard square; I changed the 84 at x .22, which is
       over the JA, and he was looking at THIS one - "it's right around the
       K most of the time", x .42. The lesson is that a shape in this field
       is identified by where it DRIFTS, not by where its def says it rests,
       and "around JACK" covers 300px of travel.
       So the two squares trade identities and keep their slots: this one is
       --accent, hollow, hard-cornered, and the 84 takes the plum and the
       rounded corners. "Red, hard square, and a very light red... and then
       the red box next to it, maybe that could be gray or another color."
       Plum at .34 on the ground is what he has been calling the grey one. */
    { type: 'square',   size: 96,  color: 'var(--accent)',      filled: true,  keep: 7,  at: [0.42, 0.25], aspect: 1.6,  ratio: 1.0,  reach: 1.5, tilt: -1.5708, pace: 0.38, overNav: true },
    /* dropped from y .46 to .54 - "the yellow circle that's around Murray,
       the hollow one... it should just maybe move down more". Still inside
       the MID band (.44-.56). It also had to clear the marquee strip, which
       began at .579; that constraint went when the strip did, and the
       position stays because the band does. */
    /* BLUE, and it reaches SELECTED PROJECTS. "For the little yellow hollow
       circle, change that to blue. And have it - I like its trajectory, but
       it should go all the way down to selected works. I think that
       movement of down helps."
       The trajectory is kept rather than redesigned: aspect and ratio are
       untouched, so the SHAPE of the path is the one he likes; reach goes
       1.0 -> 2.4 and aspect 0.8 -> 0.9, which is the same curve scaled up
       and pulled 12% off its horizontal bias. It swings y .237-.845, and
       the SELECTED PROJECTS heading measures .803-.881 in the live page -
       so the circle now passes BEHIND the heading at the bottom of every
       cycle, which is what "all the way down to selected works" asks for.
       Measure that one rather than trusting the .702 this file used to
       quote for the section: .702 is the top of the section HEAD including
       its padding, and the h2 ink starts 80px further down. Reach 2.0 put
       the circle 47px short of it and looked right on paper.
       pace .45 is what stops this being a different request: scaling the
       reach on the SMALLEST shape, which is also the fastest, would have
       put it at 137px/s. At this pace it is 63, on a 40-second cycle. */
    { type: 'circle',   size: 36,  color: 'var(--blue)',        filled: false, vivid: true, keep: 8,  at: [0.30, 0.54], aspect: 0.9,  ratio: 1.45, reach: 2.4, pace: 0.45 },
    /* PLUM, not amber, and this one is a CONSEQUENCE rather than a choice.
       The 36 was amber's only member left of centre; turning it blue left
       amber with two shapes both at x > .7, which fails the rule that a hue
       with two or more has to appear on both sides. Amber had to drop to a
       single shape, and of the two candidates this is the one that can move
       hue - the 61 is the top-right swooper and reads as the warm accent up
       there. Plum is the only hue that fits: black would put two on the
       right, and coral and blue are already in this band. */
    /* NUDGED TWICE on 2026-11-18, .76 -> .79 -> .82, and the checker picked
       the number both times. It is one of the three vertical sweepers
       (aspect 2.0 / reach 1.25, so it swings about .31 either way), which
       makes it the first thing to break when anything in the hero moves.
       First the full stop came down into its swing when .hero-grid's 86px
       bottom padding went with the 6px rule; then .hero went 80vh -> 66vh so
       the project cards would show above the fold, which shrank the field
       box from 1026 to 900 and made every shape 12% bigger as a FRACTION of
       it without changing a single px.
       Two other slots moved for the same reason and only then - the square
       over JACK .25 -> .28 and the far-left sweeper .47 -> .55, both of
       which had started reaching into the nav band (which is a fixed 94px,
       so it grew from .092 to .1044 of the shorter box).
       Moving the REST rather than cutting the reach is deliberate: it keeps
       the sweep Jack asked for ("they need to also make sure that they're
       going to the bottoms and the tops") and only shifts where it happens.
       All three are mirrored in jaggedDefs - the checker asserts slots match
       across themes, because a slot that changes position as well as
       silhouette is a shape that jumps mid-wipe. */
    { type: 'triangle', size: 68,  color: 'var(--accent-plum)', filled: false, jitter: true, keep: 9,  at: [0.72, 0.82], aspect: 2.0,  ratio: 0.7,  reach: 1.25 },
    /* PLUM, outlined - the half of the trade described above. It keeps the field's fifth hue and its second softened square
       alive, now over the JA instead of the K. It was --black until the
       square by the K needed a colour to swap with, and --black is what
       Jack reads as grey, so the field looks the way it did before except
       that the red and the grey have changed places. */
    /* THE LONG SWEEPER, and it is the one shape that lives OFF the page.
       Jack asked for the blue square back "but instead make it so that you
       don't see it for a little bit, but at certain times it'll move from
       kind of the left to the right. It'll come from out of frame into
       frame. Slowly, and then back... it kind of helps take up that
       negative space that we see from kind of the marquee above and below
       it."
       So its RESTING centre is x -0.55 - a third of a screen off the left
       edge - and it reaches x .608 at the far end of a 1575px swing. Run
       the arithmetic on the sine and it is on screen for 34% of its cycle:
       it drifts in from the left, gets about three-fifths of the way
       across, and retreats the way it came. pace 0.14 makes that cycle 159
       seconds, so it is a slow visitor rather than a shuttle - 62px/s at
       its quickest, the slowest thing in the field.
       It rests at y .52, which is MID, and swings to .321-.719. The quote
       names the marquee because the strip was still there when he asked;
       what he was describing is the white band at .58-.70, which is now
       open page with the hero's 6px seam running through it. The sweep is
       the same and it matters slightly more, since that band lost the one
       object that used to fill it.
       NOT VIVID, where the square it replaces was. That shape was cut one
       commit ago for being the loudest object in the field, and vivid on
       something 81px across is the thing that made it so; filled at the
       base alpha it is a soft mass instead, measuring 23 against the 45 at
       the top of the profile.
       keep 10, so it is a DESKTOP shape: a 1575px sweep means nothing in a
       375px box, and the thinned sets never see it. Dark's budget stops at
       9, so dark does not show it either - deliberate, since a neon star
       sweeping the page is a louder event than a coral square, and dark
       had just been thinned. Moving it into dark is one number
       (DARK_FEWER). */
    { type: 'square',   size: 81,  color: 'var(--blue)',        filled: true,  keep: 10, at: [-0.55, 0.535], aspect: 0.30, ratio: 1.6,  reach: 4.0, pace: 0.14, offstage: true },
    { type: 'square',   size: 84,  color: 'var(--accent-plum)', filled: false, keep: 11, at: [0.22, 0.28], aspect: 0.9,  ratio: 0.5,  reach: 1.0 },
  ];

  /* Two fewer in dark at every width - see shapeBudget - and the neons stay
     neon: this half of
     the site is the experimental one and was not the thing being toned down.
     Two vivid here rather than four, and NOT the amber: off-white text
     crossing an amber star measures 3.22:1 at the base .62 already, and
     brightening it is the one move in this field that would take a pair
     below 3:1. The pink and the electric blue have the headroom.
     Four went and one arrived. The two --black stars first, because an
     --black star in dark mode is an off-white star - the page's text colour
     drifting along behind the page's text; then the 28px lime, which at that
     size was a speck. The --green star became the amber one: green still has
     a job on this page as the availability dot, and reading it as decoration
     anywhere else blunts that. */
  /* The same eleven slots. Dark stays ALL STARS and keeps its neons - Jack:
     "I like how it looks in dark mode. I like all the neons, the yellows
     and the blues and the reds work well." Dark is the experimental half
     and its vocabulary is sharp - it never carried the rounded corners
     that light wore briefly, and light does not either now.
     The one import is the fifth hue, as a neon violet rather than a muted
     plum, because it has to sit beside hot pink, electric blue and lime. */
  /* The same eleven slots. Dark stays ALL STARS and keeps its neons - Jack:
     "I like how it looks in dark mode. I like all the neons, the yellows
     and the blues and the reds work well." Dark is the experimental half
     and its vocabulary is sharp - it never carried the rounded corners
     that light wore briefly, and light does not either now.
     The one import is the fifth hue, as a neon violet rather than a muted
     plum, because it has to sit beside hot pink, electric blue and lime.
     Dark's sizes run larger than light's and are what the envelopes are
     checked against. */
  const jaggedDefs = [
    { type: 'star', size: 145, color: 'var(--blue)',        filled: false, spikes: 7, sharp: true, keep: 1,  at: [0.18, 0.80], aspect: 0.5,  ratio: 0.62, reach: 1.6 },
    { type: 'star', size: 65,  color: 'var(--accent)',      filled: true,  spikes: 6, sharp: true, keep: 2,  at: [0.90, 0.28], aspect: 1.3,  ratio: 1.35, reach: 1.6, overNav: true },
    { type: 'star', size: 50,  color: 'var(--accent)',      filled: true,  spikes: 5, sharp: true, vivid: true, keep: 3,  at: [0.10, 0.55], aspect: 2.6,  ratio: 0.55, reach: 1.15 },
    { type: 'star', size: 203, color: 'var(--blue)',        filled: false, spikes: 6, sharp: true, keep: 4,  at: [0.65, 0.26], aspect: 0.45, ratio: 0.75, reach: 1.6 },
    { type: 'star', size: 120, color: 'var(--accent)',      filled: true,  spikes: 7, sharp: true, keep: 5,  at: [0.92, 0.72], aspect: 0.6,  ratio: 0.78, reach: 1.5 },
    /* HOLLOW, and this one is measured rather than chosen. --highlight in
       dark is #DDFF67, the brightest token on the page; filled at .62 it
       composites to a near-lime ground, and the off-white type measures
       2.48:1 over it where large text owes 3:1. This star's x envelope
       reaches .713-1.047 and its y .424-.656, which overlaps the foot of
       .hero-role in the side column - so the pairing is reachable, not
       theoretical. As an outline it barely tints what is behind it.
       It has been filled since the dark field was written and the resting
       DOM walk never caught it, because a walk of resting elements cannot
       see what a moving element will be behind. tools/field-check.js now
       does this arithmetic for every filled shape. */
    { type: 'star', size: 56,  color: 'var(--highlight)',   filled: false, spikes: 5, sharp: true, jitter: true, keep: 6,  at: [0.88, 0.54], aspect: 0.7,  ratio: 1.5,  reach: 1.0 },
    { type: 'star', size: 101, color: 'var(--accent-plum)', filled: true,  spikes: 8, sharp: true, keep: 7,  at: [0.42, 0.25], aspect: 1.6,  ratio: 1.0,  reach: 1.5, tilt: -1.5708, pace: 0.38, overNav: true },
    { type: 'star', size: 38,  color: 'var(--accent-warm)', filled: false, spikes: 6, sharp: true, vivid: true, keep: 8,  at: [0.30, 0.54], aspect: 0.9,  ratio: 1.45, reach: 2.4, pace: 0.45 },
    { type: 'star', size: 72,  color: 'var(--accent-warm)', filled: false, spikes: 6, sharp: true, jitter: true, keep: 9,  at: [0.72, 0.82], aspect: 2.0,  ratio: 0.7,  reach: 1.25 },
    { type: 'star', size: 86,  color: 'var(--blue)',        filled: true,  spikes: 5, sharp: true, keep: 10, at: [-0.55, 0.535], aspect: 0.30, ratio: 1.6,  reach: 4.0, pace: 0.14, offstage: true },
    { type: 'star', size: 89,  color: 'var(--highlight)',   filled: false, spikes: 8, sharp: true, keep: 11, at: [0.22, 0.28], aspect: 0.9,  ratio: 0.5,  reach: 1.0 },
  ];

  /* Where a shape sits at a given moment, with no cursor and no chaos in it.
     Pulled out of the animation loop so the loop and the initial placement
     below cannot drift apart - this formula is the look of the whole field
     and it should exist once.
     Two sine terms per axis, not one. A single sine traces a clean ellipse
     and eleven ellipses read as clockwork; the faster, smaller wobble on top
     breaks the period so each path wanders instead. */
  function driftAt(s, time, rect) {
    return {
      x: s.baseX * rect.width
        + Math.sin(time * s.speed + s.phase) * s.ampX
        + Math.sin(time * s.wobbleSpeed + s.phase * 1.7) * s.wobbleAmp,
      y: s.baseY * rect.height
        /* s.tilt shifts the y term against the x one, which is what decides
           WHICH CORNER a shape heads for. Both terms share theta when yRate
           is 1, and sin/cos are 90 degrees apart, so by default a shape
           traces an ellipse and its top coincides with its mid-x. At
           tilt = -PI/2 the y term becomes sin(theta) as well, so x and y
           reach their minima together and the path is a diagonal: up AND
           left, down AND right. Jack, on the red square: "make it when it
           goes to the top, make it move a little bit more to the left."
           Default 0, so every other shape is untouched. */
        + Math.cos(time * s.speed * s.yRate + s.phase + s.tilt) * s.ampY
        + Math.cos(time * s.wobbleSpeed * 0.83 + s.phase) * s.wobbleAmp,
    };
  }

  /* Put every shape where it belongs the instant it is built, instead of
     leaving it at translate(0,0) until the next animation frame.
     That gap is normally one frame and invisible. It stops being invisible
     under a view transition: the theme switch rebuilds the field inside the
     transition callback, and the new snapshot is taken BEFORE the next frame
     runs - so without this the wipe would reveal eleven shapes piled in the
     top-left corner and hold them there for the length of the animation. */
  function placeShapes() {
    const rect = heroShapesContainer.getBoundingClientRect();
    const time = performance.now() / 1000;
    shapes.forEach((s) => {
      const d = driftAt(s, time, rect);
      s.el.style.transform =
        `translate(${d.x - s.size / 2}px, ${d.y - s.size / 2}px) rotate(${s.rotation}deg)`;
    });
  }

  /* How many of the eleven survive at this width. Thinning, not dimming -
     and that reverses what the ≤760px opacity rule says it does ("dialled
     back rather than thinned out, so the phone keeps the same look with less
     of it"). That was the wrong read: at 375 the field box is 375px wide
     against 1440's, so eleven objects are nearly four times as dense per
     unit of area, and no alpha fixes density. Jack on a real phone:
     "there's too many shapes".
     The opacity dial-back STAYS. These are two different problems - alpha
     stops a shape fighting the type it crosses, count stops the field
     reading as busy - and the phone had both. */
  /* Driven by matchMedia, not by innerWidth, and the queries are written to
     be the SAME two breakpoints the opacity rule in styles.css uses. Two
     things fall out of that which a width check does not give:
     the thresholds cannot drift apart from the CSS, because there is one
     number per breakpoint and it is spelled the same way in both files; and
     the listener fires only when a boundary is actually crossed, where a
     resize listener fires continuously - on a phone the address bar sliding
     away during a normal scroll fires resize dozens of times, and a rebuild
     throws the whole field away and starts it over. */
  const mqNarrow = window.matchMedia('(max-width: 600px)');
  const mqMobile = window.matchMedia('(max-width: 760px)');
  /* DARK CARRIES TWO FEWER AT EVERY WIDTH. Jack: "in the dark mode, I would
     say maybe take one or two out, that kind of looks like a lot right
     now." It does, and the reason is not the count: a neon star at .62 on
     near-black with a drop-shadow glow is a brighter object than a coral
     outline at .34 on sand, so the same eleven read as more.
     Done as an offset on the budget rather than a shorter dark array, so
     the two themes still share SLOTS - the theme switch reveals the same
     composition minus its two least load-bearing shapes, instead of a
     different arrangement. The keep order already guarantees every subset
     is a composition: 9 is 3/3/3 across the bands, 7 is 3/2/2 and 5 is
     2/1/2, with the hue rule holding at each. */
  const DARK_FEWER = 2;
  function shapeBudget(isDark) {
    const base = mqNarrow.matches ? 7 : mqMobile.matches ? 9 : 11;
    return base - (isDark ? DARK_FEWER : 0);
  }
  const isDarkNow = () => document.documentElement.getAttribute('data-theme') === 'dark';
  let activeBudget = shapeBudget(isDarkNow());

  function buildShapes() {
    const isDark = isDarkNow();
    const all = isDark ? jaggedDefs : smoothDefs;
    activeBudget = shapeBudget(isDark);
    const defs = all.filter((d) => d.keep <= activeBudget);
    /* The size range comes from the set itself rather than from a pair of
       literals. It used to be a hardcoded (110 - size) / 76, which silently
       stopped meaning anything the moment a shape went outside 34-110 - the
       132px circle makes t negative, and a negative t runs every motion
       number backwards off the end of its intended range. Derived, the
       largest shape in whichever theme is loaded is always t=0 and the
       smallest always t=1, so the parallax holds whatever sizes get set.
       Off `all`, NOT off the filtered list: a shape's speed and travel are
       part of its character, and they should not change because a different
       shape was dropped at a breakpoint. Taking the range from the full set
       keeps every survivor moving exactly as it does on a desktop. */
    const sizes = all.map((d) => d.size);
    const maxSize = Math.max(...sizes);
    const sizeSpan = maxSize - Math.min(...sizes) || 1;

    /* SHAPES SCALE WITH THE FIELD, and this only became visible when the
       shapes got big. The sizes in the arrays are absolute px tuned against
       the 1440px-wide field box at 1440, but the box is 375px wide at 375 -
       so a shape that is 9% of the field on a desktop is 39% of it on a
       phone, and the same number means two completely different things.
       It was survivable at 132. At 191 it is not: the largest shape covered
       56% of a phone's field width and sat across the headline, which is a
       worse version of the "too many shapes" complaint that started all of
       this - one shape can crowd a screen on its own.
       It COMPRESSES THE RANGE rather than scaling everything by one
       factor, and the difference is not subtle. A uniform .45 tamed the
       191 to 86 and took the 36 down to 16, which is a speck - the field
       went from "one shape crowding the screen" straight to "nothing
       there". What a narrow screen cannot carry is the SPREAD: a 5.3x size
       range is drama on a desktop and noise in a 375px box. So the largest
       shape loses the most and the smallest barely moves, which pulls the
       set toward its middle instead of toward zero.
       Measured in the page, the set at 1440 comes out 116/94/81/71/53/
       48/42/38/30 at 700 and 86/76/68/61/43/38/34 at 375 - nine and seven
       of them, the rest having been thinned away. Desktop is untouched:
       both ends of the ramp are 1 at and above 1392, which is the ramp's
       saturation point rather than a measured width. */
    const fieldBox = heroShapesContainer.getBoundingClientRect();
    const rectW = fieldBox.width || 1440;
    const rectH = fieldBox.height || 1026;
    const fieldW = rectW;
    const narrow = 1 - Math.max(0, Math.min(1, (fieldW - 420) / (1392 - 420)));
    const scaleFor = (size) => {
      const tt = (maxSize - size) / sizeSpan;            // 1 smallest, 0 largest
      const big = 1 - 0.55 * narrow;                     // largest  -> .45 at 375
      const small = 1 - 0.25 * narrow;                   // smallest -> .75 at 375
      return big + (small - big) * tt;
    };

    /* TRAVEL SCALES WITH THE FIELD TOO, for the same reason the sizes do:
       an amplitude is absolute px and the box it swings inside is not. The
       widest shapes now travel 250px, which is 18% of the field at 1440 and
       74% of it at 375 - so a drift that reads as a shape wandering in and
       out on a desktop takes the same shape off a phone for a large part of
       every cycle, and the phone is the width that was just short of shapes.
       Measured, with no scaling the three widest-travelling shapes sit on
       screen 58-63% of the time at 375; at this floor it is 67-79%, so a
       seven-shape budget stays close to seven shapes rather than averaging
       five and a half.
       DESKTOP IS UNTOUCHED - narrow is 0 at and above 1392, so this is
       exactly 1 there, which is also what keeps tools/field-check.js
       meaningful: it reasons at 1440 geometry, and 1440 is the widest any
       shape ever swings. */
    const travelScale = 0.5 + 0.5 * (1 - narrow);

    heroShapesContainer.innerHTML = '';
    shapes = defs.map((def, i) => {
      /* scaled for rendering; the RAW size still drives t below, since
         scaling every shape by the same factor leaves their ratios - and
         so the parallax - exactly where they were */
      const renderSize = Math.max(14, Math.round(def.size * scaleFor(def.size)));
      const el = createShapeEl({ ...def, size: renderSize });
      // opacity lives in CSS (.hero-shapes .shape) so the two themes can
      // differ - a neon on near-black carries at a lower alpha than a muted
      // coral on sand does - and so it is not buried in a JS string
      heroShapesContainer.appendChild(el);
      /* 1 for the smallest shape in the set, 0 for the largest. Every
         motion number below is derived from it, and that is the second
         half of making this field look considered rather than generated.
         It used to be Math.random() on all six, which gave the right
         SPREAD - shapes overtaking each other is what stops eleven objects
         reading as one slow field - but attached that spread to nothing,
         so a 110px form could end up the fastest, widest-travelling thing
         on screen while a 34px speck sat nearly still. That is the exact
         inverse of how distance reads.
         Tying it to size instead keeps the full range and makes it mean
         something: big forms barely move and act as structure, small ones
         travel far and read as the live layer in front. Same idea as
         parallax, done with amplitude rather than depth. */
      const t = (maxSize - def.size) / sizeSpan;
      /* EACH SHAPE GETS ITS OWN PATH, and this is the fix for a real
         complaint rather than a flourish. Jack: "the ones under Jack Murray,
         they look like they are on the same trajectory. There is like three
         shapes that are all lined up on like the same trajectory."
         He was describing something structural. Amplitude used to be
         ampX = 40 + 110t and ampY = 32 + 86t, which puts ampY/ampX at .80
         for the largest shape and .79 for the smallest - so EVERY shape in
         the field travelled along the same 4:5 diagonal, and the y term ran
         at a hardcoded .8 of the x frequency for all of them too. Scale and
         phase were the only things that differed, which means eleven shapes
         were tracing eleven copies of one Lissajous figure. Three of them
         sitting at a similar y then read as three things on one rail,
         because they were.
         Three keys per shape, and all three are authored like the positions:
           aspect - splits the amplitude between the axes. 0.5 is a flat
                    sideways slide, 2.2 is a tall rise and fall. The set now
                    spans ampY/ampX from .20 to 3.8 against .79 for all.
           ratio  - the y frequency as a multiple of the x frequency, which
                    is what decides the SHAPE of the curve rather than its
                    size. 1.0 is an ellipse, 0.5 a two-lobed figure-eight,
                    1.45 a tall pretzel. Was .8 everywhere.
           reach  - scales both axes, for the few shapes meant to leave the
                    frame and come back. Jack again: "the shapes need to be
                    going off the screen, maybe a little bit. Some of them,
                    can like come into the screen... that was a good thing
                    about the randomness." Four do now - the 137 circle
                    exits left, the 61 triangle, the 113 solid and the 53
                    circle exit right - and the page carries overflow-x:
                    clip, so leaving is free.
         REACH IS SPENT ON X, NOT Y, and that is forced rather than chosen:
         the nav sits at y < .092 and a shape that swings up into it is a
         bug, so the vertical travellers are the ones resting low and the
         shapes that go off-frame go sideways. */
      const aspect = def.aspect || 1;
      const reach = def.reach || 1;
      // 40-150 across the set before aspect and reach, big ones at the bottom
      const ampX = (40 + 110 * t) * reach / aspect * travelScale;
      const ampY = (32 + 86 * t) * reach * aspect * travelScale;
      // and a second, faster wobble so the path is not a clean ellipse
      const wobbleAmp = (6 + 10 * t) * travelScale;

      /* JITTER: two shapes get a fresh resting position on every load.
         Jack asked for "a couple shapes that are fully random... a little
         bit of randomness", and he is reaching for something the authored
         field genuinely lost. Random placement was dropped because nine
         random points clump; this is the part of it worth keeping, applied
         to two shapes out of eleven so the composition it sits inside is
         still the designed one.
         Bounded, not free. +/-.07 in x and +/-.035 in y is enough to be a
         different picture each visit and small enough that the shape stays
         in its band and on its side of the field - so the band balance and
         the hue spread, which are what the whole arrangement is checked
         for, hold whatever the dice do.
         CLAMPED AGAINST THE SAME THREE LANDMARKS the authored positions
         are checked against, and it falls back to the authored spot rather
         than shipping a bad roll. The checker can only vouch for what is
         in the arrays; anything generated at runtime has to carry its own
         guarantee, or the rules stop meaning anything the moment the page
         loads. */
      let [bx, by] = def.at;
      if (def.jitter) {
        const jx = bx + (Math.random() - 0.5) * 0.14;
        const jy = by + (Math.random() - 0.5) * 0.07;
        const halfW = renderSize / 2 / rectW, halfH = renderSize / 2 / rectH;
        /* the rolled position has to clear the SAME landmarks field-check.js
           holds the authored ones to, using this shape's own amplitudes - so
           a wide reach cannot buy itself a violation. There were three while
           the marquee existed; the third was "do not rest on the strip",
           which went with it. */
        const swingX = (ampX + wobbleAmp) / rectW + halfW;
        const swingY = (ampY + wobbleAmp) / rectH + halfH;
        const hitsNav = jy - swingY < 0.092;
        const hitsStop = Math.abs(jx - 0.6555) < swingX && Math.abs(jy - 0.42) < swingY;
        if (!hitsNav && !hitsStop && jx > halfW && jx < 1 - halfW * 0.2) {
          bx = jx; by = jy;
        }
      }
      return {
        el,
        size: renderSize,
        baseColor: def.color,
        baseX: bx,
        baseY: by,
        ampX,
        ampY,
        /* A FIFTH SLOWER than it was, which was 0.14 + 0.30t. "Make some
           of the trajectories a little bit slower. They're going pretty
           fast right now." Done to the whole range rather than to the
           shapes that looked fastest, because the range IS the parallax:
           the ratio between the slowest and fastest shape is what makes
           the big ones read as structure and the small ones as the live
           layer in front, and picking off the fast ones by hand would have
           flattened exactly that. Both ends move by the same fifth, so
           every shape is slower and none of them has changed places. */
        /* def.pace is a multiplier on the whole path's rate, not on one
           axis. It exists because tilt costs a shape its slow axis: tying x
           and y together means they share a frequency, so a shape that was
           crossing slowly in y and quickly in x ends up at one speed. pace
           puts the slowness back without untying them. It is also what lets
           a shape with a very long reach stay slow - see the 81. */
        speed: (0.112 + 0.24 * t) * (def.pace || 1),
        // the y frequency as a multiple of the x one - see the path note above
        yRate: def.ratio || 0.8,
        tilt: def.tilt || 0,
        /* the golden angle, which is the most irrational turn there is:
           stepping phase by it spreads eleven shapes as evenly round the
           cycle as eleven shapes can be spread, so no two are ever swinging
           together. Random phases bunch - that is what random does - and a
           bunched pair looks like the two shapes are linked. */
        phase: i * 2.39996,
        wobbleAmp,
        wobbleSpeed: 0.75 + 0.5 * ((i * 0.37) % 1),
        /* alternating, not signed at random: a field where the spin
           directions happen to agree reads as a single rotating system.
           Small spins faster, same reasoning as the travel. */
        rotSpeed: (i % 2 ? 1 : -1) * (5 + 20 * t) * (isDark ? 1.7 : 1),
        // spread round the circle, deterministic, so squares and triangles
        // each present a different edge - a repeatable 47 degrees apart
        rotation: (i * 47) % 360,
        offsetX: 0,
        offsetY: 0,
      };
    });
    placeShapes();
  }
  buildShapes();
  document.addEventListener('themechange', buildShapes);

  /* A rebuild discards the field and makes a new one, so every shape jumps
     back to its resting position. That is fine when the viewport crosses
     600 or 760 - someone rotating a phone or dragging a window - because
     the layout is already reflowing anyway. What is NOT acceptable is a
     375px screen still showing eleven shapes because the page was opened
     wide and then narrowed.
     Guarded on the budget, so it is a no-op unless the count would really
     change. That is what makes it safe to listen to resize as well as to
     the media queries: on a phone the address bar sliding away during a
     normal scroll fires resize continuously, and all those get is one
     integer comparison.
     BOTH kinds of listener on purpose. The media queries are the correct
     signal and cannot drift from the CSS breakpoints, but they are a single
     point of failure - the in-app browser pane, for one, matches the query
     and applies the stylesheet while never delivering the change event, so
     a field wired only to matchMedia silently never thins there. resize is
     the coarse backstop. Belt and braces costs one comparison. */
  function rebuildIfBudgetChanged() {
    if (shapeBudget(isDarkNow()) !== activeBudget) buildShapes();
  }
  mqNarrow.addEventListener('change', rebuildIfBudgetChanged);
  mqMobile.addEventListener('change', rebuildIfBudgetChanged);
  window.addEventListener('resize', rebuildIfBudgetChanged);

  let heroMouseX = -9999;
  let heroMouseY = -9999;
  let heroHasPointer = window.matchMedia('(pointer: fine)').matches;

  if (heroHasPointer) {
    window.addEventListener('mousemove', (e) => {
      const rect = heroShapesContainer.getBoundingClientRect();
      heroMouseX = e.clientX - rect.left;
      heroMouseY = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
      heroMouseX = -9999;
      heroMouseY = -9999;
    });
  }

  const REPEL_RADIUS = 150;
  const REPEL_STRENGTH = 70;
  let lastT = 0;

  function animateShapes(t) {
    const rect = heroShapesContainer.getBoundingClientRect();
    const time = t / 1000;
    const dt = lastT ? (t - lastT) / 1000 : 0;
    lastT = t;

    shapes.forEach((s) => {
      const { x: driftX, y: driftY } = driftAt(s, time, rect);

      const dx = driftX - heroMouseX;
      const dy = driftY - heroMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let pushX = 0, pushY = 0;
      const isNear = dist < REPEL_RADIUS && dist > 0.01;
      if (isNear) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH * window.chaosBoost;
        pushX = (dx / dist) * force;
        pushY = (dy / dist) * force;
      }
      // ease toward the target push so it never snaps
      s.offsetX += (pushX - s.offsetX) * 0.08;
      s.offsetY += (pushY - s.offsetY) * 0.08;

      // A shape being pushed used to turn var(--green) and turn back. It was
      // cut on Jack's note, and the reasoning holds up: green belongs to the
      // availability dot, eleven shapes that each briefly become a twelfth colour
      // is a colour system with a hole in it, and the push is already legible
      // from the movement and the spin-up below. Nothing replaced it - the
      // field reacts to the cursor by MOVING, which is the whole idea.
      // spin slowly, a bit faster while being pushed (much faster in chaos mode)
      const spinMultiplier = (isNear ? 2.4 : 1) * window.chaosBoost;
      s.rotation += s.rotSpeed * spinMultiplier * dt;

      // chaos mode: shapes fly around at random regardless of the
      // cursor, instead of only reacting when pushed — true haywire
      let chaosX = 0, chaosY = 0;
      if (window.chaosBoost > 1) {
        chaosX = (Math.random() - 0.5) * 50;
        chaosY = (Math.random() - 0.5) * 50;
      }

      const finalX = driftX + s.offsetX + chaosX - s.size / 2;
      const finalY = driftY + s.offsetY + chaosY - s.size / 2;
      s.el.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${s.rotation}deg)`;
    });
    requestAnimationFrame(animateShapes);
  }
  if (prefersReducedMotion) {
    // place shapes at their base positions once, no drift/repel/spin loop
    const rect = heroShapesContainer.getBoundingClientRect();
    shapes.forEach((s) => {
      const x = s.baseX * rect.width - s.size / 2;
      const y = s.baseY * rect.height - s.size / 2;
      s.el.style.transform = `translate(${x}px, ${y}px)`;
    });
  } else {
    requestAnimationFrame(animateShapes);
  }
}

// magnetic typography — each letter explodes away from the cursor then
// snaps back with springy, slightly-overshooting physics
/* ------------------------------------------------------------------------
   SECTION 16 · MAGNETIC HEADLINE
   LET'S MAKE / SOMETHING. Colour lives in the glow, never in the type.
   ------------------------------------------------------------------------ */
const magneticTextEl = document.getElementById('magneticText');

// Shared with the physics loop below. It has to be a mutable outer binding
// rather than a const captured at init: rebuilding the headline for a new
// language replaces every letter node, and a loop still holding the old
// array would animate detached elements while the visible ones sat frozen.
let magneticLetterStates = [];

function buildMagneticText() {
  if (!magneticTextEl) return;
  // structure is always built (otherwise reduced-motion users would see
  // an empty section) — only the physics/mousemove loop below is gated
  const rows = T.list('magnetic.rows');
  magneticTextEl.textContent = '';
  magneticLetterStates = [];

  rows.forEach((row) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'magnetic-row';
    // Japanese has no inter-word spaces, so split(' ') yields the whole
    // row as one "word" — which is the correct grouping for it anyway
    row.split(' ').forEach((word) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'magnetic-word';
      // Array.from, not split(''), so multi-byte characters aren't
      // torn in half into broken surrogate halves
      Array.from(word).forEach((ch) => {
        const letterEl = document.createElement('span');
        letterEl.className = 'magnetic-letter';
        letterEl.textContent = ch;
        wordEl.appendChild(letterEl);
        magneticLetterStates.push({ el: letterEl, dx: 0, dy: 0, vx: 0, vy: 0 });
      });
      rowEl.appendChild(wordEl);
    });
    magneticTextEl.appendChild(rowEl);
  });
}
buildMagneticText();
// The (pointer: fine) gate that used to be here meant the headline was inert
// on a phone: the one element on the page that invites being played with did
// nothing at all when played with. Touch now drives the same physics, and the
// loop idles itself (see the bottom of animateMagnetic) so running it on a
// battery-powered device costs nothing while nobody is touching it.
if (magneticTextEl && !prefersReducedMotion) {
  let magMouseX = -9999;
  let magMouseY = -9999;
  let magRaf = null;
  let magTouchMode = false;

  window.addEventListener('mousemove', (e) => {
    magTouchMode = false;
    magMouseX = e.clientX;
    magMouseY = e.clientY;
    startMagnetic();
  });
  window.addEventListener('mouseleave', () => {
    magMouseX = -9999;
    magMouseY = -9999;
    startMagnetic();
  });

  // A tap is a pulse, not a drag. Tracking the finger meant the letters stayed
  // blown apart for as long as it was down and followed it around the
  // headline, which reads as the text coming apart rather than reacting to
  // being touched. Touching now sets the point once and lets go of it a moment
  // later, so the letters push away from where you touched and spring back on
  // their own. touchmove is deliberately not handled - dragging does nothing.
  //
  // Passive, and bound to the headline rather than the window, so the page
  // still scrolls normally; preventDefault here would trap the scroll on the
  // one section people are most likely to swipe across.
  let magRelease = null;
  magneticTextEl.addEventListener('touchstart', (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    magTouchMode = true;
    magMouseX = t.clientX;
    magMouseY = t.clientY;
    startMagnetic();
    clearTimeout(magRelease);
    magRelease = setTimeout(() => {
      magMouseX = -9999;
      magMouseY = -9999;
      startMagnetic();
    }, TOUCH_PULSE_MS);
  }, { passive: true });

  // bigger radius + much stronger push so letters fly further, and a
  // lower damping ratio so the snap-back overshoots more visibly
  const MAG_RADIUS = 220;
  const MAG_FORCE = 220;
  const STIFFNESS = 230;
  const DAMPING = 11;

  // Touch gets a gentler version of the same physics. A cursor hovers - it
  // arrives slowly and you watch the letters give way. A finger lands all at
  // once, so the desktop numbers fire the whole headline apart in one frame
  // and it reads as broken rather than playful. A third of the push over a
  // smaller radius, and roughly double the damping so it settles instead of
  // ringing.
  const TOUCH_RADIUS = 150;
  const TOUCH_FORCE = 72;
  const TOUCH_DAMPING = 21;
  // how long the tap keeps pushing before the letters are released
  const TOUCH_PULSE_MS = 160;
  let magLastT = 0;

  function animateMagnetic(t) {
    const dt = magLastT ? Math.min((t - magLastT) / 1000, 0.05) : 0;
    magLastT = t;
    let moving = false;

    magneticLetterStates.forEach((s) => {
      const rect = s.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - magMouseX;
      const dy = cy - magMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const radius = magTouchMode ? TOUCH_RADIUS : MAG_RADIUS;
      const push = magTouchMode ? TOUCH_FORCE : MAG_FORCE;

      let targetX = 0, targetY = 0;
      if (dist < radius && dist > 0.01) {
        const force = (1 - dist / radius) * push;
        targetX = (dx / dist) * force;
        targetY = (dy / dist) * force;
      }

      // spring-damper physics: underdamped for a dramatic bounce on
      // both the explosion outward and the snap back into place
      const damp = magTouchMode ? TOUCH_DAMPING : DAMPING;
      const ax = (targetX - s.dx) * STIFFNESS - s.vx * damp;
      const ay = (targetY - s.dy) * STIFFNESS - s.vy * damp;
      s.vx += ax * dt;
      s.vy += ay * dt;
      s.dx += s.vx * dt;
      s.dy += s.vy * dt;

      // chaos mode: scatter letters with extra random jitter on top of
      // the spring physics, instead of letting them sit calm
      let scatterX = 0, scatterY = 0;
      if (window.chaosBoost > 1) {
        scatterX = (Math.random() - 0.5) * 16;
        scatterY = (Math.random() - 0.5) * 16;
      }

      s.el.style.transform = `translate(${s.dx + scatterX}px, ${s.dy + scatterY}px) rotate(${(s.dx + scatterX) * 0.2}deg)`;

      // still worth another frame?
      if (Math.abs(s.dx) > 0.08 || Math.abs(s.dy) > 0.08 ||
          Math.abs(s.vx) > 0.08 || Math.abs(s.vy) > 0.08) moving = true;
    });

    // Idle out rather than looping forever. Each frame reads a bounding rect
    // per letter, which forces layout - cheap enough on a desktop nobody
    // notices, but a constant drain on a phone for an effect that is not
    // currently being touched. Any pointer or touch calls startMagnetic()
    // again. Chaos mode is excluded because its jitter is reapplied every
    // frame, so settling is not something it ever does.
    const pointerAway = magMouseX < -9000;
    if (pointerAway && !moving && !(window.chaosBoost > 1)) {
      magneticLetterStates.forEach((st) => {
        st.dx = 0; st.dy = 0; st.vx = 0; st.vy = 0;
        st.el.style.transform = '';
      });
      magRaf = null;
      return;
    }
    magRaf = requestAnimationFrame(animateMagnetic);
  }

  function startMagnetic() {
    if (magRaf !== null) return;
    // reset the clock, or the first frame after an idle gets a dt of however
    // long the page sat untouched and launches every letter off screen
    magLastT = 0;
    magRaf = requestAnimationFrame(animateMagnetic);
  }
  startMagnetic();
}

/* ------------------------------------------------------------------------
   SECTION 17 · CONTACT FORM
   Honeypot + validation. Sender is still the Resend sandbox - see OPEN ITEMS.
   ------------------------------------------------------------------------ */
// Contact form. Posts to /api/contact, a function in this repository - see
// api/contact.js for what it does with the fields. Anywhere that endpoint does
// not exist (localhost, or a static host with no functions) the catch below
// falls back to a pre-filled mailto, so the form degrades instead of failing.
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const formSubmit = document.getElementById('formSubmit');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  // honeypot tripped — a bot filled a field real users never see.
  // Pretend success and silently drop the submission.
  const honeypot = contactForm.querySelector('#cf-honeypot');
  if (honeypot && honeypot.value) {
    formStatus.textContent = T.t('form.status.thanks');
    contactForm.reset();
    return;
  }

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name || !email || !message) return;

  // Done with fetch rather than a normal submit so the inline status line and
  // the chosen language survive, instead of the visitor being thrown to a
  // generic success page and losing the language they picked. Anywhere the
  // endpoint doesn't exist (localhost, or a static host with no functions)
  // the catch falls back to the old mailto.
  const body = new URLSearchParams(new FormData(contactForm)).toString();
  formStatus.textContent = T.t('form.status.sending');
  formSubmit.disabled = true;

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  })
    .then((res) => {
      if (!res.ok) throw new Error('form endpoint returned ' + res.status);
      formStatus.textContent = T.t('form.status.thanks');
      contactForm.reset();
    })
    .catch(() => {
      const subject = encodeURIComponent(`New project inquiry from ${name}`);
      const mail = encodeURIComponent(`${message}\n\nFrom ${name} (${email})`);
      window.location.href = `mailto:23jmurr@gmail.com?subject=${subject}&body=${mail}`;
      formStatus.textContent = T.t('form.status.mailto');
    })
    .finally(() => { formSubmit.disabled = false; });
});

// copy email to clipboard
const copyEmailBtn = document.getElementById('copyEmailBtn');
const contactEmailText = document.getElementById('contactEmailText');
copyEmailBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(contactEmailText.textContent.trim());
  } catch (err) {
    // clipboard API unavailable — fail silently, button just won't confirm
  }
  copyEmailBtn.textContent = T.t('contact.copied');
  copyEmailBtn.classList.add('copied');
  setTimeout(() => {
    // re-read rather than restoring a captured string: the visitor may
    // have switched language during the 1.8s confirmation window
    copyEmailBtn.textContent = T.t('contact.copy');
    copyEmailBtn.classList.remove('copied');
  }, 1800);
});

// Gallery cards used to be <article role="button"> and needed tabindex, a
// keydown handler and an aria-label to behave like controls. They are
// <a href="/work/..."> now, so the browser supplies focus, Enter, the
// context menu and open-in-new-tab, and all of that went away. The handler
// this replaced also swallowed the space bar, which on a link should scroll.

// hidden easter egg menu — pick stickers or chaos mode
//
/* ------------------------------------------------------------------------
   SECTION 18 · EASTER EGGS
   Pong, chaos mode, stickers. Deliberately hidden; not a headline feature.
   ------------------------------------------------------------------------ */
// EASTER EGGS, and the word is doing real work. Everything from here to the
// end of the file - this menu, the stickers, chaos mode, Pong - is hidden
// behind a trigger most visitors never press, and none of it is what the
// portfolio is for. It is in the file because a UX portfolio that is no fun
// to use argues against itself, not because it is a feature.
// Worth knowing if you are reading this file to describe the site: automated
// summaries have led with the Pong game more than once, which gets the site
// exactly backwards. The case studies are the content; see /llms.txt, which
// says so in Jack's own words.
const eggTrigger = document.getElementById('eggTrigger');
const eggMenu = document.getElementById('eggMenu');
const stickerTray = document.getElementById('stickerTray');
const stickerTrayClose = document.getElementById('stickerTrayClose');
const stickerTrash = document.getElementById('stickerTrash');

function setEggMenu(open) {
  eggMenu?.classList.toggle('open', open);
  setInert(eggMenu, !open);
  eggTrigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
  armMenuScrollDismiss();
}
eggTrigger?.addEventListener('click', () => setEggMenu(!eggMenu.classList.contains('open')));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && eggMenu?.classList.contains('open')) {
    setEggMenu(false);
    eggTrigger.focus();
  }
});
// the third dropdown in the same cluster; without this it stayed open until
// you picked one of its options, while the other two closed on an outside click
document.addEventListener('click', (e) => {
  if (eggMenu && !eggMenu.contains(e.target) && !eggTrigger.contains(e.target)) {
    setEggMenu(false);
  }
});
document.getElementById('eggMenuStickers')?.addEventListener('click', () => {
  setEggMenu(false);
  stickerTray.classList.add('open');
  setInert(stickerTray, false);
});
document.getElementById('eggMenuChaos')?.addEventListener('click', () => {
  setEggMenu(false);
  startChaosMode();
});
stickerTrayClose?.addEventListener('click', () => {
  stickerTray.classList.remove('open');
  setInert(stickerTray, true);
});

// sparkle particles when hovering the trigger
eggTrigger?.addEventListener('mouseenter', () => {
  const burst = setInterval(() => {
    const particle = document.createElement('span');
    particle.className = 'egg-particle';
    particle.textContent = ['✦', '✧', '★'][Math.floor(Math.random() * 3)];
    const rect = eggTrigger.getBoundingClientRect();
    particle.style.left = (rect.left + rect.width / 2) + 'px';
    particle.style.top = (rect.top + rect.height / 2) + 'px';
    const angle = Math.random() * Math.PI * 2;
    const dist = 24 + Math.random() * 28;
    particle.style.setProperty('--px', `${Math.cos(angle) * dist}px`);
    particle.style.setProperty('--py', `${Math.sin(angle) * dist}px`);
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 720);
  }, 110);
  eggTrigger.addEventListener('mouseleave', () => clearInterval(burst), { once: true });
});

// a point is "over" a delete zone if it falls inside the tray (when open)
// or the trash icon's bounding box
function isOverDeleteZone(x, y) {
  if (stickerTray.classList.contains('open')) {
    const r = stickerTray.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
  }
  const tr = stickerTrash.getBoundingClientRect();
  return x >= tr.left && x <= tr.right && y >= tr.top && y <= tr.bottom;
}

function setDropZonesArmed(armed) {
  stickerTray.classList.toggle('drop-armed', armed);
  stickerTrash.classList.toggle('armed', armed);
}

function makeStickerDraggable(el) {
  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    el.classList.add('dragging');
    stickerTrash.classList.add('visible');

    function move(ev) {
      el.style.left = (ev.clientX - offsetX) + 'px';
      el.style.top = (ev.clientY - offsetY) + 'px';
      setDropZonesArmed(isOverDeleteZone(ev.clientX, ev.clientY));
    }
    function up(ev) {
      el.classList.remove('dragging');
      stickerTrash.classList.remove('visible');
      setDropZonesArmed(false);
      if (isOverDeleteZone(ev.clientX, ev.clientY)) {
        el.classList.add('deleting');
        setTimeout(() => el.remove(), 250);
      }
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });
}

document.querySelectorAll('.sticker').forEach((stickerEl) => {
  stickerEl.style.touchAction = 'none';
  stickerEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const size = 56;
    const placed = document.createElement('div');
    placed.className = 'placed-sticker dragging';
    placed.textContent = stickerEl.textContent;
    const rot = (Math.random() * 30 - 15).toFixed(1);
    placed.style.left = (e.clientX - size / 2) + 'px';
    placed.style.top = (e.clientY - size / 2) + 'px';
    placed.style.transform = `rotate(${rot}deg)`;
    document.body.appendChild(placed);
    placed.setPointerCapture(e.pointerId);
    stickerTrash.classList.add('visible');

    function move(ev) {
      placed.style.left = (ev.clientX - size / 2) + 'px';
      placed.style.top = (ev.clientY - size / 2) + 'px';
      setDropZonesArmed(isOverDeleteZone(ev.clientX, ev.clientY));
    }
    function up(ev) {
      placed.classList.remove('dragging');
      stickerTrash.classList.remove('visible');
      setDropZonesArmed(false);
      if (isOverDeleteZone(ev.clientX, ev.clientY)) {
        placed.classList.add('deleting');
        setTimeout(() => placed.remove(), 250);
      } else {
        makeStickerDraggable(placed);
      }
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });
});

// CHAOS MODE — an easter egg (see the note above the egg menu). 30 seconds
// of "corrupted TV signal" hitting every part
// of the page (hero shakes/glitches violently via CSS, shapes fly
// around at random, the badge flickers, the marquee rips past at
// several times its normal speed — all CSS-driven off body.chaos-mode),
// plus JS-driven text scramble / position jitter / static bursts / a
// haywire clock. Ends naturally after 30s or early via the STOP button,
// both routed through the same cleanup so there's only one code path.
let chaosTimeoutId = null;
let chaosCountdownId = null;
let chaosScrambleId = null;
let chaosJitterId = null;
let chaosStaticId = null;
let chaosClockId = null;
let chaosScrambleTargets = [];
let chaosScrambleOriginals = [];
let chaosJitterTargets = [];
const chaosStopBtn = document.getElementById('chaosStopBtn');
const chaosWorkCover = document.getElementById('chaosWorkCover');
const chaosCountdownEl = document.getElementById('chaosCountdown');
const CHAOS_DURATION = 30; // seconds

function endChaosMode() {
  /* back out of the page for anything reading it - see the EASTER EGGS
     banner in index.html. CSS alone hides these from a person; it does not
     stop a crawler or a screen reader finding a PLAY PONG button sitting
     between the hero and SELECTED PROJECTS, which is exactly what was
     being reported back. */
  setInert(chaosWorkCover, true);
  setInert(chaosStopBtn, true);
  clearTimeout(chaosTimeoutId);
  clearInterval(chaosCountdownId);
  clearInterval(chaosScrambleId);
  clearInterval(chaosJitterId);
  clearInterval(chaosStaticId);
  clearInterval(chaosClockId);
  chaosScrambleTargets.forEach((el, i) => { el.textContent = chaosScrambleOriginals[i]; });
  chaosJitterTargets.forEach((el) => { el.style.transform = ''; });
  document.querySelector('.noise')?.classList.remove('static-flicker');
  updateClock(); // restore the real time immediately rather than waiting for the next tick
  document.body.classList.remove('chaos-mode');
  window.chaosBoost = 1;
}

function startChaosMode() {
  if (document.body.classList.contains('chaos-mode')) return; // already running
  document.body.classList.add('chaos-mode');
  setInert(chaosWorkCover, false);
  setInert(chaosStopBtn, false);
  window.chaosBoost = 6; // also amplifies hero shapes + magnetic letter scatter

  // text scramble on the section headings and the magnetic typography
  // letters (the magnetic letters' own rAF loop only touches transform,
  // so scrambling textContent here doesn't fight that animation)
  const glitchChars = '!<>-_\\/[]{}=+*^?#%&';
  chaosScrambleTargets = Array.from(document.querySelectorAll('.section-head h2, .magnetic-letter'));
  chaosScrambleOriginals = chaosScrambleTargets.map((el) => el.textContent);
  chaosScrambleId = setInterval(() => {
    chaosScrambleTargets.forEach((el, i) => {
      const orig = chaosScrambleOriginals[i];
      el.textContent = orig
        .split('')
        .map((ch) => (ch === ' ' || Math.random() > 0.45 ? ch : glitchChars[Math.floor(Math.random() * glitchChars.length)]))
        .join('');
    });
  }, 90);

  // small random position stutter across the whole page — nav, contact
  // copy, the footer — not just one section, so it reads as "the whole
  // page is corrupted" rather than one quarantined glitchy widget
  chaosJitterTargets = Array.from(document.querySelectorAll(
    '.nav-logo, .nav-links a, .contact-statement, .contact-email-text, .social-link-text, .contact-loc, .footer span, .footer a'
  ));
  chaosJitterId = setInterval(() => {
    chaosJitterTargets.forEach((el) => {
      const jx = (Math.random() - 0.5) * 6;
      const jy = (Math.random() - 0.5) * 6;
      el.style.transform = `translate(${jx}px, ${jy}px)`;
    });
  }, 150);

  // footer clock goes haywire — garbled digits instead of the real time
  chaosClockId = setInterval(() => {
    if (!liveClock) return;
    const garbled = Array.from({ length: 8 }, () => {
      const r = Math.random();
      if (r < 0.15) return ':';
      return glitchChars[Math.floor(Math.random() * glitchChars.length)] || String(Math.floor(Math.random() * 10));
    }).join('').slice(0, 8);
    liveClock.textContent = garbled.length === 8 ? garbled : '88:88:88';
  }, 120);

  // occasional brief static bursts instead of a continuous flash
  const noiseEl = document.querySelector('.noise');
  chaosStaticId = setInterval(() => {
    if (Math.random() < 0.35) {
      noiseEl.classList.add('static-flicker');
      setTimeout(() => noiseEl.classList.remove('static-flicker'), 90 + Math.random() * 80);
    }
  }, 450);

  // visible countdown on the STOP button
  let secondsLeft = CHAOS_DURATION;
  if (chaosCountdownEl) chaosCountdownEl.textContent = String(secondsLeft);
  clearInterval(chaosCountdownId);
  chaosCountdownId = setInterval(() => {
    secondsLeft -= 1;
    if (chaosCountdownEl) chaosCountdownEl.textContent = String(Math.max(secondsLeft, 0));
  }, 1000);

  clearTimeout(chaosTimeoutId);
  chaosTimeoutId = setTimeout(endChaosMode, CHAOS_DURATION * 1000);
}

chaosStopBtn?.addEventListener('click', endChaosMode);

// mini Pong, opened via the glitchy PLAY button that appears in chaos mode
const chaosPlayBtn = document.getElementById('chaosPlayBtn');
const pongWindow = document.getElementById('pongWindow');
const pongClose = document.getElementById('pongClose');
const pongCanvas = document.getElementById('pongCanvas');
const pongEnd = document.getElementById('pongEnd');
const pongEndMsg = document.getElementById('pongEndMsg');
const pongRematch = document.getElementById('pongRematch');
if (pongCanvas) {
  const pctx = pongCanvas.getContext('2d');
  const W = pongCanvas.width, H = pongCanvas.height;
  // Both paddles are the same size now: the player's used to be 78 against
  // the CPU's 60, which is a standard "easy mode" trick but reads as unfair
  // once you notice it. The player keeps a forgiveness edge, just an
  // invisible one - the catch buffers further down are 16px against 8px.
  const PADDLE_H = 69, PADDLE_W = 10;
  const PLAYER_PADDLE_H = PADDLE_H;
  let p1Y = H / 2 - PLAYER_PADDLE_H / 2;
  let p2Y = H / 2 - PADDLE_H / 2;
  let aiTargetY = H / 2, aiLookTimer = 0;
  // still ramps up, but starts slower and caps out lower than before so
  // long rallies don't accelerate the ball past reactable speed. Now a cap
  // on TOTAL speed rather than on the horizontal component, because the
  // bounce below splits one speed between the two axes.
  const BALL_MAX_SPEED = 6;
  // angle off the horizontal at the very tip of a paddle, ~54 degrees
  const MAX_BOUNCE_RAD = 0.95;
  let ballX = W / 2, ballY = H / 2, ballVX = 2.1, ballVY = 1.4;
  let score1 = 0, score2 = 0;
  let pongRunning = false;
  const keys = {};
  window.addEventListener('keydown', (e) => { keys[e.key] = true; });
  window.addEventListener('keyup', (e) => { keys[e.key] = false; });

  function resetBall(dir) {
    ballX = W / 2; ballY = H / 2;
    ballVX = (dir || (Math.random() < 0.5 ? -1 : 1)) * 2.1;
    ballVY = (Math.random() < 0.5 ? -1 : 1) * 1.4;
  }

  // Where on the paddle you hit decides the angle, which is the part of real
  // Pong that was missing: the old code only ever flipped and scaled ballVX
  // and left ballVY alone, so the ball kept whatever vertical angle it was
  // served with for the whole point. Neither side could aim, so rallies
  // settled into one groove the CPU could sit in forever - the "stalls out
  // and goes on for ever" problem was this, not only the CPU's speed.
  // Centre of the paddle returns it flat; the tips return it at up to
  // MAX_BOUNCE_RAD. Speed is shared between the axes so a steep return is
  // not also a faster one.
  function paddleBounce(paddleY, paddleH, dir) {
    let rel = (ballY - (paddleY + paddleH / 2)) / (paddleH / 2);
    rel = Math.max(-1, Math.min(1, rel));
    const angle = rel * MAX_BOUNCE_RAD;
    const speed = Math.min(Math.hypot(ballVX, ballVY) * 1.03, BALL_MAX_SPEED);
    ballVX = dir * speed * Math.cos(angle);
    ballVY = speed * Math.sin(angle);
  }

  function drawPong() {
    pctx.fillStyle = '#000';
    pctx.fillRect(0, 0, W, H);
    // faint scanlines for the glitch aesthetic
    pctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let y = 0; y < H; y += 4) pctx.fillRect(0, y, W, 1);
    // center dashed line, deliberately slightly off-center for the
    // "intentionally broken" brutalist feel
    pctx.strokeStyle = 'rgba(255,255,255,0.25)';
    pctx.setLineDash([6, 7]);
    pctx.beginPath();
    pctx.moveTo(W / 2 + 2, 0);
    pctx.lineTo(W / 2 + 2, H);
    pctx.stroke();
    pctx.fillStyle = '#8190FF';
    pctx.fillRect(14, p1Y, PADDLE_W, PLAYER_PADDLE_H);
    pctx.fillStyle = '#ff2d55';
    pctx.fillRect(W - 14 - PADDLE_W, p2Y, PADDLE_W, PADDLE_H);
    pctx.fillStyle = '#DDFF67';
    pctx.fillRect(ballX - 5, ballY - 5, 10, 10);
    pctx.fillStyle = '#fff';
    pctx.font = '22px "Courier New", monospace';
    pctx.fillText(String(score1), W / 2 - 40, 30);
    pctx.fillText(String(score2), W / 2 + 26, 30);
  }

  function pongLoop() {
    if (!pongRunning) return;
    // player paddle moves a bit faster than before (was 5) so quick
    // returns feel responsive instead of always trailing the ball.
    // A drag sets p1Y directly (see the pointer handlers below), so these
    // two only ever fight each other if someone holds a key while dragging,
    // and the key wins for that frame - which is what a person doing both
    // at once would expect.
    if (keys['ArrowUp'] || keys['w'] || keys['W']) p1Y -= 6.5;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) p1Y += 6.5;
    p1Y = Math.max(0, Math.min(H - PLAYER_PADDLE_H, p1Y));
    // simple AI: the old version re-read the ball's exact position every
    // single frame, so it tracked near-perfectly almost by construction —
    // the ball's vertical speed is slow and constant, trivial to glue to
    // continuously regardless of speed caps or lerp tuning. A beatable
    // paddle AI needs a real reaction window: only start tracking once
    // the ball is actually headed its way (like a person who isn't
    // staring at the correct spot until the ball crosses over), and
    // drift back to center otherwise — so a quick return right off the
    // player's paddle gives it very little time to get in position.
    if (ballVX > 0) {
      aiLookTimer--;
      if (aiLookTimer <= 0) {
        // Re-aims every 20 frames at a point up to ~33px either side of the
        // ball. Both numbers went up (16 / 46): with two paddles that both
        // return everything, a rally only ends when someone is genuinely out
        // of position, and speed alone never produced that - the CPU simply
        // arrived early every time. The misjudgement is what makes it
        // beatable, and it is also what a person actually does.
        aiLookTimer = 20;
        aiTargetY = ballY + (Math.random() - 0.5) * 66;
      }
    } else {
      aiTargetY = H / 2;
      aiLookTimer = 0;
    }
    // Capped well below the player's 6.5, so a paddle that has to travel far
    // (e.g. a return angled to the opposite side of where it just was) can
    // genuinely fail to arrive in time. Dropped from 3.3: with the bounce
    // angle above now letting a player aim at the far corner, 3.3 was still
    // fast enough to cover almost any return.
    const CPU_MAX_SPEED = 2.55;
    let p2Delta = (aiTargetY - PADDLE_H / 2 - p2Y) * 0.18;
    p2Delta = Math.max(-CPU_MAX_SPEED, Math.min(CPU_MAX_SPEED, p2Delta));
    p2Y += p2Delta;
    p2Y = Math.max(0, Math.min(H - PADDLE_H, p2Y));

    ballX += ballVX;
    ballY += ballVY;
    // clamped as well as flipped: at the steeper angles the bounce can now
    // produce, a ball that overshoots the wall in one frame would otherwise
    // flip again next frame and buzz along the edge
    if (ballY <= 0) { ballY = 0; ballVY = Math.abs(ballVY); }
    if (ballY >= H - 8) { ballY = H - 8; ballVY = -Math.abs(ballVY); }
    // The direction guard is new. Without it a ball that arrived steeply
    // enough to still be inside the paddle's x-band next frame got hit a
    // second time and flew back out the way it came.
    // Player's catch buffer stays more forgiving than the CPU's (16 vs 8) —
    // a slightly-late human return shouldn't feel as punishing.
    if (ballVX < 0 && ballX <= 24 && ballY > p1Y - 16 && ballY < p1Y + PLAYER_PADDLE_H + 16) {
      paddleBounce(p1Y, PLAYER_PADDLE_H, 1); ballX = 24;
    }
    if (ballVX > 0 && ballX >= W - 24 && ballY > p2Y - 8 && ballY < p2Y + PADDLE_H + 8) {
      paddleBounce(p2Y, PADDLE_H, -1); ballX = W - 24;
    }
    if (ballX < 0) { score2++; resetBall(1); }
    if (ballX > W) { score1++; resetBall(-1); }

    drawPong();

    if (score1 >= 5 || score2 >= 5) {
      pongRunning = false;
      showPongEnd(score1 >= 5 ? T.t('pong.win') : T.t('pong.lose'));
      return;
    }
    requestAnimationFrame(pongLoop);
  }

  function showPongEnd(msg) {
    pongEndMsg.textContent = msg;
    pongEnd.classList.add('open');
  }
  function hidePongEnd() {
    pongEnd.classList.remove('open');
  }

  function startPongGame() {
    hidePongEnd();
    score1 = 0; score2 = 0;
    resetBall();
    pongRunning = true;
    requestAnimationFrame(pongLoop);
  }

  function openPong() {
    pongWindow.classList.add('open');
    setInert(pongWindow, false);
    startPongGame();
    // belt-and-suspenders: the window is fixed-position so it's already
    // always in the viewport, but scroll it into view explicitly in
    // case that ever changes, so the player never misses the start
    // 'smooth' is a JS scroll, so the stylesheet's scroll-behavior: auto
    // override under prefers-reduced-motion does not apply to it.
    pongWindow.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center'
    });
  }
  function closePong() {
    pongWindow.classList.remove('open');
    setInert(pongWindow, true);
    pongRunning = false;
  }
  /* DRAG TO PLAY. This was keyboard-only, which on a phone meant the egg
     menu handed you a game with no way to play it - the window opened, the
     CPU scored five times, and that was the whole experience. Removing it
     below some width was the other option and it is the worse one: a
     portfolio that drops a feature on mobile rather than adapting it is
     making an argument its own case studies disagree with.
     The paddle centres on the pointer rather than stepping like the keys do,
     because a finger is an absolute position and a key is a direction. Drag
     anywhere on the canvas, not just on the paddle - at 375 the board scales
     to about 337px and the paddle displays ~7px wide, which is nothing to
     aim at, and you are watching the ball anyway.
     Pointer events rather than touch events so one path covers finger, pen
     and mouse; dragging with a mouse now works too, which it never did.
     setPointerCapture keeps a drag alive when it slides off the canvas -
     easy to do when the board is 90vw. The canvas also carries
     touch-action: none (styles.css), or a vertical drag scrolls the page
     out from under the game instead of moving the paddle. */
  let pongPointerId = null;
  function pongPointerY(e) {
    const rect = pongCanvas.getBoundingClientRect();
    // the canvas is 480x320 internally and displayed at whatever max-width
    // leaves it, so a client coordinate scales by the DISPLAYED height
    return (e.clientY - rect.top) * (H / rect.height);
  }
  function movePaddleTo(y) {
    p1Y = Math.max(0, Math.min(H - PLAYER_PADDLE_H, y - PLAYER_PADDLE_H / 2));
  }
  pongCanvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pongPointerId = e.pointerId;
    pongCanvas.setPointerCapture(e.pointerId);
    movePaddleTo(pongPointerY(e));
  });
  pongCanvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pongPointerId) return;
    movePaddleTo(pongPointerY(e));
  });
  function endPongDrag(e) { if (e.pointerId === pongPointerId) pongPointerId = null; }
  pongCanvas.addEventListener('pointerup', endPongDrag);
  pongCanvas.addEventListener('pointercancel', endPongDrag);

  /* The footer names the controls, so on a touch device it has to name the
     one that exists. Swapping the data-i18n attribute rather than the text
     means i18n.apply() keeps resolving it on every language change, with no
     listener to remember - it reads the attribute live. The textContent is
     set here as well because i18n.js already ran its first apply() by the
     time this file executes. */
  const pongFooter = document.querySelector('.pong-footer');
  if (pongFooter && window.matchMedia('(pointer: coarse)').matches) {
    pongFooter.setAttribute('data-i18n', 'pong.controlsTouch');
    pongFooter.textContent = T.t('pong.controlsTouch');
  }

  chaosPlayBtn?.addEventListener('click', openPong);
  pongClose?.addEventListener('click', closePong);
  pongRematch?.addEventListener('click', startPongGame);
}

// Cursor-following 3D tilt. The project cards use it, and so does the about
// photo - it is the thing that makes them feel like the same object, and a
// fixed CSS rotation is not a substitute: it does not track the pointer.
// Note this sets an inline transform, which beats any :hover transform in the
// stylesheet - so a tilted element's hover styling has to live in the parts
// this does not touch (box-shadow on the cards, the ring on the photo).
/* The AREA is what the pointer is tracked against, and it is the element
   itself unless an ancestor claims it with data-tilt-area. A card is its own
   area. The about photo is not: it shrinks 28px on hover to give the
   rotation somewhere to go, so the pointer spends most of its time over
   panel rather than over photo - bound to the photo, crossing into that gap
   fires mouseleave and flattens the tilt mid-hover. Measuring from the area
   too, not just listening on it, keeps the full panel mapped to the same
   +-6deg instead of the shrunken photo's box. */
if (!prefersReducedMotion) document.querySelectorAll('[data-tilt]').forEach((card) => {
  const area = card.closest('[data-tilt-area]') || card;
  area.addEventListener('mousemove', (e) => {
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  });
  area.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ==========================================================================
   LANGUAGE CHANGE — rebuild everything this file generates at runtime.
   i18n.js handles the static [data-i18n] elements on its own; these are the
   pieces it can't reach because they're constructed in JS.
   The typewriter registers its own listener next to its state variables.
   ========================================================================== */
// Alt text is content, so it has to follow the language — but it lives in an
// attribute that was written when the <img> was built. Re-resolve in place.
function refreshAltText() {
  document.querySelectorAll('img[data-alt-p]').forEach((img) => {
    const pid = img.dataset.altP;
    const idx = parseInt(img.dataset.altI, 10) || 0;
    const project = projectData[pid];
    img.alt = resolveAlt(null, pid, idx, project && project.title);
  });
}

T.onChange(() => {
  buildMagneticText();
  refreshAltText();
  // only if the visitor switched language with a project overlay open
  if (openProjectId) fillProjectDetail(openProjectId);
  // the tab title, the canonical and the share text are all translated
  applyRouteMeta(routeFromPath(location.pathname));
});



/* ==========================================================================
   ACCESSIBILITY — keyboard reachability of hidden panels, and dialog focus

   The overlays, the mobile drawer and the sticker tray are all hidden with
   `transform`, which moves them off-screen but leaves every control inside
   them in the tab order. Before this, six tab stops on a closed page led
   into content nobody could see. `inert` removes them from focus AND from
   the accessibility tree, which also stops their headings from showing up
   in a screen reader's heading list while closed.

   (The Pong window and chaos-stop button already used display:none, which
   removes focusability on its own — they need nothing here.)
   ========================================================================== */

/* inert AND aria-hidden together, so one call states the whole fact. inert
   already implies aria-hidden in a current browser, but the explicit
   attribute is what a crawler, a parser or an older AT actually reads - and
   the easter eggs lean on exactly that: they are in the DOM from the start
   and must not be reported as part of the page until someone opens them. */
function setInert(el, on) {
  if (!el) return;
  if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
  else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
}

// visible + focusable descendants, in DOM order
function focusablesIn(el) {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]),' +
              ' textarea:not([disabled]), select:not([disabled]),' +
              ' [tabindex]:not([tabindex="-1"])';
  return Array.from(el.querySelectorAll(sel))
    .filter((n) => n.offsetWidth > 0 || n.offsetHeight > 0);
}

// A STACK, not a single reference: the lightbox opens on top of the project
// overlay, which is itself a trapped dialog. With one variable, closing the
// lightbox would clear the trap and leave the project overlay untrapped.
const dialogStack = [];

function activateDialog(overlay, initialFocus) {
  if (!overlay) return;
  dialogStack.push({ overlay: overlay, returnFocus: document.activeElement });
  setInert(overlay, false);
  // Focus HAS to move into the dialog: without it a screen-reader user gets
  // no signal anything opened, and the next Tab lands on the element after
  // the trigger — behind the overlay.
  //
  // Done synchronously and NOT inside requestAnimationFrame: rAF never
  // fires while the tab is hidden or backgrounded, which would silently
  // skip the focus move in exactly the cases it matters. The panel is
  // still transitioning in visually, but a transform doesn't affect
  // focusability, so there's nothing to wait for.
  /* FOCUS THE DIALOG REGION, NOT ITS FIRST CONTROL, where the overlay can
     take focus itself. Putting it on BACK TO WORK meant that reloading a
     project page drew a focus ring round that button: a reload is a
     KEYBOARD action, so the browser's :focus-visible heuristic decides the
     visitor is navigating by keyboard and shows the ring for the
     programmatic focus that follows. Jack reported it as the button looking
     bugged after a refresh, and it does - the 3px coral ring at 3px offset
     sits inside the button's own 4px hard coral shadow, so the control
     wears two coral rectangles at two different offsets with page ground
     showing between them.
     A ring is right when a visitor operated a control to get here and wrong
     when the page merely loaded, and the element itself cannot tell the
     difference. Focusing the region sidesteps it: there is no control to
     ring, a screen reader still announces the project name and "dialog"
     (better than "BACK TO WORK, button"), and the first Tab still lands on
     the back button. Same pattern and same reasoning as .hero carrying
     tabindex="-1" with no focus outline - it is a region, not a control.
     The lightbox deliberately keeps its close button: it is only ever
     opened by operating a control, so the ring there is earned. */
  const target = (initialFocus && focusablesIn(overlay).includes(initialFocus))
    ? initialFocus
    : (overlay.hasAttribute('tabindex') ? overlay : focusablesIn(overlay)[0]);
  // preventScroll: the panel is still transformed offscreen at this point, and
  // focusing something inside it would otherwise let the browser scroll an
  // ancestor to bring it into view — another source of the jump behind it.
  if (target) target.focus({ preventScroll: true });
}

function deactivateDialog(overlay) {
  const i = dialogStack.map((d) => d.overlay).lastIndexOf(overlay);
  const entry = i >= 0 ? dialogStack.splice(i, 1)[0] : null;
  setInert(overlay, true);
  // restore focus to whatever opened THIS dialog, so closing a lightbox
  // returns you to the thumbnail you clicked, not to the page behind
  if (entry && entry.returnFocus && document.contains(entry.returnFocus)) {
    entry.returnFocus.focus();
  }
}

// Tab cycles within the open dialog instead of escaping to the page behind
// it. aria-modal on the overlay covers the screen-reader virtual cursor;
// this covers sighted keyboard users.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !dialogStack.length) return;
  const trappedDialog = dialogStack[dialogStack.length - 1].overlay;
  const f = focusablesIn(trappedDialog);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (!trappedDialog.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
  } else if (document.activeElement === trappedDialog) {
    /* focus is on the dialog REGION itself, which is where opening one now
       puts it. contains() counts an element as containing itself, so this
       is inside the trap - but it is neither first nor last, so without
       this branch a Shift+Tab would fall through to the default and walk
       backwards out of the dialog onto the page behind it. */
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  } else if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

// The drawer shares #navLinks with the desktop nav, so it can only be inert
// at the breakpoint where it's actually an off-canvas panel — inerting it on
// desktop would kill the main navigation.
const mobileNavMQ = window.matchMedia('(max-width: 760px)');
function syncNavDrawerInert() {
  if (!navLinks) return;
  setInert(navLinks, mobileNavMQ.matches && !navLinks.classList.contains('open'));
}
mobileNavMQ.addEventListener('change', syncNavDrawerInert);
// belt and braces: a missed change event would leave the DESKTOP nav inert,
// i.e. no keyboard navigation at all. Cheap to re-check on resize too.
window.addEventListener('resize', syncNavDrawerInert);

// starting state: every closed panel out of the tab order
setInert(projectOverlay, true);
setInert(aboutOverlay, true);
setInert(stickerTray, true);
syncNavDrawerInert();

/* ==========================================================================
   LIGHTBOX — click-to-zoom for project media

   The in-page media is deliberately modest (the detail tiles are 311px
   squares at 1440px wide); this is where the work actually gets looked at.
   Only images carrying data-full are zoomable — opening the same resolution
   at a larger size would just be a bigger blur.
   ========================================================================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(img) {
  if (!lightbox || !img) return;
  const full = img.dataset.full || img.currentSrc || img.src;
  lightboxImg.src = full;
  // the thumbnail's alt already describes the image; reusing it keeps the
  // two in sync automatically when the language changes
  lightboxImg.alt = img.alt || '';
  // position in the set plus the camera settings — facts you can't get by
  // looking. The description stays in alt, where it's read to the people who
  // actually need it rather than printed under a picture you can already see.
  const siblings = [...projectMedia.querySelectorAll('img[data-full]')];
  const at = siblings.indexOf(img);
  const pad = (n) => String(n).padStart(2, '0');
  const counter = at >= 0 && siblings.length > 1
    ? `${pad(at + 1)} / ${pad(siblings.length)}` : '';
  lightboxCaption.textContent = [counter, img.dataset.exif].filter(Boolean).join('   ·   ');
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  activateDialog(lightbox, lightboxClose);
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  // the project overlay underneath still wants the scroll locked; only
  // release it if nothing else is open
  if (!projectOverlay.classList.contains('open') && !aboutOverlay.classList.contains('open')) {
    document.body.style.overflow = '';
  }
  deactivateDialog(lightbox);
  // drop the (large) source so it isn't held in memory between openings
  lightboxImg.removeAttribute('src');
}

// delegated: project media is re-rendered on every open and on language
// change, so binding per-image would go stale
projectMedia?.addEventListener('click', (e) => {
  const img = e.target.closest('img[data-full]');
  if (img) openLightbox(img);
});
projectMedia?.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const img = e.target.closest('img[data-full]');
  if (img) { e.preventDefault(); openLightbox(img); }
});

lightboxClose?.addEventListener('click', closeLightbox);
// clicking the backdrop closes; clicking the image itself does not
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// zoomable images need to be reachable and operable by keyboard, and they're
// generated markup, so this runs whenever the media is (re)built
function markZoomableImages() {
  document.querySelectorAll('#projectMedia img[data-full]').forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.style.cursor = 'zoom-in';
    img.title = T.t('a11y.zoomHint');
  });
}
setInert(lightbox, true);

/* ==========================================================================
   MARQUEE DWELL-PAUSE
   The strip stops so it can be read (WCAG 2.2.2), but pausing on the first
   pixel of contact made a mouse travelling across the page jerk it to a
   halt. Waiting for the pointer to stay put reads as intent instead of as
   a glitch. Leaving triggers immediately - resuming late feels broken.
   ========================================================================== */
/* ==========================================================================
   SECTION 19 · THE 3D VIEWER — 37k triangles of hand-rolled WebGL

   Jack modelled the pot clip in Blender and wanted it rotatable on the page.
   The obvious answer is <model-viewer> or three.js, and both are ruled out by
   the first line of CLAUDE.md: no dependencies. That rule is not decoration
   here - the site is a work sample, and "I wrote the renderer" is a better
   sample than "I imported one".

   IT IS ALSO THE SMALLER ANSWER, which is the part worth knowing. The GLB is
   18.3MB: 684,604 triangles, no textures at all, one metallic grey material.
   model-viewer would have added ~250KB of library ON TOP of shipping that.
   What goes to the browser instead is 385KB of mesh and about 180 lines of
   code, because the geometry was the problem and a library does not fix
   geometry.

   WHAT WAS THROWN AWAY, AND WHY IT COSTS NOTHING. tools/pack-model.js
   clusters vertices onto a grid and averages each cell, taking 684,604
   triangles to 37,724 - roughly 5%. Clustering rather than quadric
   edge-collapse because this form has no sharp creases to protect: every
   feature is a smooth fillet, which is exactly where a grid average is
   indistinguishable from the expensive algorithm. Positions then quantise to
   int16 across the bounding box (a ~15 micron step on a 100mm object, far
   finer than a 600px viewport resolves) and normals to int8. The container
   carries its own index offset in the header so the parser cannot drift from
   the packer - the first version computed padding from the normals block
   alone, which is 2 mod 4 for an odd vertex count.

   THE MATERIAL IS THREE PASSES OF ONE LESSON: contrast, not gradient. A
   smooth sky-to-floor ramp rendered as matte grey plastic twice, because a
   polished surface is almost entirely a mirror and a mirror of nothing
   featureless is featureless. What reads as metal is a hard cyc edge, three
   distinct sources, and a thin horizon streak - the streak is most of the
   sense of motion, since it is the highlight that sweeps as the form turns.
   The result is satin rather than chrome, which is correct: the physical
   piece is sprayed silver, and Blender's own material is roughness 0.48.

   Blender is Z-up and WebGL is Y-up. Without the ZUP rotation below the clip
   stands on its dome, which is how the first render came out.
   ========================================================================== */

/* A 4x4 just big enough for one object on a turntable. No general-purpose
   matrix library, because this needs exactly a perspective, two rotations
   and a translate, and a general one is most of a dependency. */
const M4 = {
  ident: () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]),
  persp(fov, aspect, near, far) {
    const t = 1 / Math.tan(fov / 2);
    return new Float32Array([t/aspect,0,0,0, 0,t,0,0, 0,0,(far+near)/(near-far),-1, 0,0,2*far*near/(near-far),0]);
  },
  mul(a, b) {
    const o = new Float32Array(16);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      let v = 0; for (let k = 0; k < 4; k++) v += a[k*4+j] * b[i*4+k];
      o[i*4+j] = v;
    }
    return o;
  },
  trans(x, y, z) { const m = M4.ident(); m[12]=x; m[13]=y; m[14]=z; return m; },
  rotX(r) { const c=Math.cos(r), s=Math.sin(r), m=M4.ident(); m[5]=c; m[6]=s; m[9]=-s; m[10]=c; return m; },
  rotY(r) { const c=Math.cos(r), s=Math.sin(r), m=M4.ident(); m[0]=c; m[2]=-s; m[8]=s; m[10]=c; return m; },
};

const MODEL_VS = `
attribute vec3 aPos; attribute vec3 aNor;
uniform mat4 uProj, uView, uModel; uniform mat3 uNormal;
varying vec3 vN, vW;
void main(){
  vec4 w = uModel * vec4(aPos, 1.0);
  vW = w.xyz; vN = normalize(uNormal * aNor);
  gl_Position = uProj * uView * w;
}`;

const MODEL_FS = `
precision highp float;
varying vec3 vN, vW;
uniform vec3 uEye, uBase, uTop, uHorizon, uBottom;
uniform float uRough, uExposure;

/* A RECTANGULAR SOFTBOX, which is the thing the old environment was missing.
   It lit with three pow(dot(d,L), n) lobes, and a lobe is a POINT source with
   soft edges - a mirror reflecting one shows a small round blob that barely
   changes as the form turns. A real studio (and the HDRI Google's viewer
   lights with) is made of PANELS, and what reads as polished metal is the
   straight edge of a panel travelling across a curved surface.
   Projects d into a basis around c and tests it against a rectangle, so the
   reflection has corners and edges. soft opens with roughness. */
float panel(vec3 d, vec3 c, vec2 halfSize, float soft){
  float fwd = dot(d, c);
  if (fwd <= 0.001) return 0.0;
  vec3 up = abs(c.y) > 0.95 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  vec3 tx = normalize(cross(up, c));
  vec3 ty = cross(c, tx);
  vec2 uv = abs(vec2(dot(d, tx), dot(d, ty))) / fwd;
  vec2 e = smoothstep(halfSize + soft, halfSize - soft, uv);
  return e.x * e.y;
}

vec3 env(vec3 d, float blur){
  float y = clamp(d.y, -1.0, 1.0);
  /* floor -> horizon -> zenith. The cyc is darker below and brightest
     overhead, like a room with a lit ceiling and an unlit floor. */
  vec3 c = mix(uBottom, uHorizon, smoothstep(-0.42, -0.02, y));
  c = mix(c, uTop, smoothstep(0.0, 0.80, y));
  /* THE HORIZON IS THE MOST IMPORTANT FEATURE IN HERE. It is the hard edge
     where the lit cyc meets the floor, and on a convex form it reads as the
     bright line that sweeps round as the object turns - most of the sense of
     motion, and most of what says "metal" rather than "grey plastic". */
  float hw = mix(0.012, 0.30, blur);
  c += uHorizon * 1.20 * exp(-(y * y) / (hw * hw));
  float s = mix(0.015, 0.55, blur);
  /* key: a tall softbox high and to the left, the main shape on the form */
  c += vec3(1.00, 1.00, 1.00) * 2.40 * panel(d, normalize(vec3(-0.40, 0.76, 0.51)), vec2(0.30, 0.17), s);
  /* fill: a wide low panel on the right, so the shadow side is not dead */
  c += vec3(0.93, 0.96, 1.00) * 1.60 * panel(d, normalize(vec3( 0.80, 0.16, 0.58)), vec2(0.20, 0.44), s);
  /* rim: behind and slightly under, which separates the silhouette */
  c += vec3(1.00, 0.95, 0.88) * 1.18 * panel(d, normalize(vec3( 0.05,-0.30,-0.95)), vec2(0.46, 0.26), s);
  /* a narrow overhead strip - the ceiling light, catching the top edges */
  c += vec3(1.00, 1.00, 1.00) * 1.05 * panel(d, normalize(vec3(0.10, 0.97, -0.10)), vec2(0.5, 0.07), s);
  return c;
}

/* ACES rather than col/(col+0.9). The Reinhard it replaces desaturates as it
   rolls off, so every highlight turned the same pale grey and the whole
   object trended to one value - which is exactly the "flat" look. */
vec3 aces(vec3 x){
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main(){
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uEye - vW);
  vec3 R = reflect(-V, N);
  float NoV = clamp(dot(N, V), 0.0, 1.0);
  /* two samples standing in for a roughness mip chain: a sharp reflection
     along R and a wide one along N, mixed by roughness */
  vec3 refl = mix(env(R, uRough), env(N, 1.0), uRough * 0.30);
  vec3 F = uBase + (1.0 - uBase) * pow(1.0 - NoV, 5.0);
  vec3 col = refl * F * uExposure;
  gl_FragColor = vec4(pow(aces(col), vec3(1.0/2.2)), 1.0);
}`;

/* THE SHADOW IS RENDERED, NOT DRAWN IN CSS, and the first attempt deserved
   what it got. It was a `radial-gradient` ellipse parked under the canvas,
   and Jack: "that doesn't look like it was coded in. That looks really bad
   because when you rotate it, it stays the same... it's just an ellipses."
   Correct on both counts - a shadow that ignores the shape casting it is a
   decal, and the object is a saddle with two legs, so its real shadow is a
   blob with a notch bitten out of it that swings as the form turns.

   It is a two-pass planar shadow and the whole thing is about 50 lines.
   PASS 1 renders the mesh into a 256x256 texture through an orthographic
   camera looking straight down the floor's normal - no depth buffer and no
   shading, every covered fragment just writes 1, so this is a coverage
   map, not a depth map. PASS 2 draws a quad on the floor plane sampling
   that map through a 16-tap disc blur, as black with the blur for alpha.

   THE ONE PIECE OF GEOMETRY THAT IS EASY TO GET WRONG: the viewer rotates
   the OBJECT and leaves the camera still, so a floor plane in that space
   is exactly edge-on to the viewer and renders as a line. The floor has to
   take the pitch and NOT the yaw - rotX(pitch) only - which is the same
   scene as a camera pitching over a fixed floor, and is why the shadow
   foreshortens correctly as the eye rises. The coverage pass takes the yaw
   and NOT the pitch, for the matching reason: it is looking down the
   floor's own normal.
   The ortho extent is 1.35x the bounding radius so the blur has margin to
   spread into and never samples the clamped edge of the texture. */
const SHADOW_RES = 256;
const SHADOW_STRENGTH = 0.46;   // peak alpha under the object
/* The key panel sits at normalize(-0.40, 0.76, 0.51) - above, to the left
   and slightly toward the viewer - so its shadow falls right and away.
   The exact projection would be (0.40, -0.51) / 0.76, which is (0.53,
   -0.67); this is about 60% of that, because the honest number throws the
   shadow most of its own width off the object and reads as a second
   object rather than as a shadow. The extent the coverage pass renders at
   (1.35x the radius) has room for the offset: the silhouette reaches
   about 1.0 and the lean adds at most 0.4. */
const SHADOW_SKEW = new Float32Array([0.32, -0.40]);

const SHADOW_COV_VS = `
attribute vec3 aPos;
uniform mat4 uSpin;        // yaw only: the floor does not spin with the object
uniform float uExtent;
uniform vec2 uSkew;        // where the light is, as a lean per unit of height
void main(){
  vec3 p = (uSpin * vec4(aPos, 1.0)).xyz;
  /* A SHEAR, WHICH IS WHAT AN ANGLED LIGHT IS. Straight down the normal
     gives a shadow sitting symmetrically under the object, and Jack asked
     to see it raked. Offsetting each vertex by its own HEIGHT times the
     light's lean is exactly the projection of a directional source onto
     the floor - the top of the object throws further than the feet, which
     is the part that reads as a direction rather than a nudge. */
  vec2 q = p.xz + uSkew * p.y;
  gl_Position = vec4(q.x / uExtent, q.y / uExtent, 0.0, 1.0);
}`;
const SHADOW_COV_FS = `
precision mediump float;
void main(){ gl_FragColor = vec4(1.0); }`;

const SHADOW_QUAD_VS = `
attribute vec2 aCorner;
uniform mat4 uProj, uView, uTip;   // uTip is pitch only
uniform float uExtent, uFloor;
varying vec2 vUv;
void main(){
  vec3 p = vec3(aCorner.x * uExtent, uFloor, aCorner.y * uExtent);
  vUv = aCorner * 0.5 + 0.5;
  gl_Position = uProj * uView * uTip * vec4(p, 1.0);
}`;
const SHADOW_QUAD_FS = `
precision mediump float;
uniform sampler2D uCov;
uniform float uStrength;
varying vec2 vUv;
/* 16 taps on two rings plus the centre. A box blur banded visibly on a
   shape with a notch in it; two rings at different radii cost the same
   and read as a penumbra. */
const int N = 8;
void main(){
  float a = texture2D(uCov, vUv).r;
  for (int i = 0; i < N; i++) {
    float t = (float(i) / float(N)) * 6.2831853;
    vec2 d = vec2(cos(t), sin(t));
    a += texture2D(uCov, vUv + d * 0.030).r;
    a += texture2D(uCov, vUv + d * 0.065).r;
  }
  a /= float(N * 2 + 1);
  /* darkest where the object actually sits, falling away fast - a contact
     shadow is not a uniform puddle */
  a = pow(a, 1.35) * uStrength;
  /* and the quad's own edge must not show, so fade the corners out */
  float edge = 1.0 - smoothstep(0.55, 0.92, length(vUv - 0.5) * 2.0);
  gl_FragColor = vec4(0.0, 0.0, 0.0, a * edge);
}`;

function parseMesh(buf) {
  const dv = new DataView(buf);
  const tag = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (tag !== 'JMM1') throw new Error('not a JMM1 mesh');
  const nv = dv.getUint32(4, true), nt = dv.getUint32(8, true);
  const idxOff = dv.getUint32(28, true);
  return {
    nv, nt,
    pos: new Int16Array(buf, 32, nv * 3),
    nor: new Int8Array(buf, 32 + nv * 6, nv * 3),
    idx: new Uint16Array(buf, idxOff, nt * 3),
  };
}

/* Light and dark get different studios. The page ground is warm ivory and
   the dark ground is near-black, and a metal object reflects the room it is
   in - leaving one environment for both would put a bright studio behind an
   object sitting on a black page. */
/* RE-TUNED FOR ACES. The old values were set against a Reinhard curve
   (col/(col+0.9)), which rolls off so gently that a top of 2.30 still read
   as mid grey. Dropped into ACES the same numbers clip: the first build of
   this shader rendered a near-white object with no form in it at all.
   Picked by porting the fragment shader to Node (it is thirty lines of
   vector maths) and rendering the real mesh at a dozen settings, rather
   than guessing one value per browser reload. */
/* BRIGHTER AGAIN, toward what the IBL viewer gives for free. Jack, with
   both on screen: "the other one's lighting is a little bit better."
   A real environment map carries far more light than four analytic panels
   do, so the honest half of that gap is simply level - the cyc is lifted,
   the overhead strip is up by half, and the floor comes up a little so the
   underside is modelled instead of black. Roughness 0.32 -> 0.30 for a
   slightly tighter horizon streak. Compared side by side against the same
   mesh rendered offline, not nudged one value per reload. */
/* DARKER AGAIN, and this one is a correction rather than a step. Chasing
   model-viewer's level took the studio bright enough that the object was
   mostly one pale value with highlights on top of it - Jack: "the lighting,
   I think the fix that the lighting needs is it needs to be darker."
   What a polished object in a dark room actually looks like is a bright lit
   top and legs that fall away to almost nothing, and that contrast is the
   subject. So the cyc comes down by a third, the fill and the rim by more,
   and the floor goes nearly black; the key panel does NOT move, because the
   highlights were never the problem.
   Then the SIDES came back up, because taking the whole studio down took
   them with it: "the sides look a lot darker. Maybe turn it up just a
   little bit, just slightly, but I like how darker it got." Two levers,
   and the second is the one that mattered. The fill and rim panels went
   0.80 to 1.60 and 0.60 to 1.18 - they are the only things lighting the
   flanks. But the LEGS point down and outward, so most of what they see is
   the floor, and the floor had been taken to 0.022: a void. Lifting it to
   0.075 is a bounce card, and it is what actually took the legs off black
   while the lit top and the contrast it is there for both stay. */
const MODEL_LOOK = {
  light: { top: [0.90,0.93,1.04], horizon: [0.42,0.44,0.51], bottom: [0.075,0.075,0.092], exposure: 0.94 },
  dark:  { top: [0.81,0.84,0.94], horizon: [0.37,0.39,0.46], bottom: [0.058,0.058,0.072], exposure: 0.90 },
};

/* THE NUDGE — THE FINGER THAT APPEARS AND ROCKS THE OBJECT.
   Jack asked for the one <model-viewer> does: "it'll have this like little
   finger pop up, and it'll show you that you can kind of rotate it back and
   forth a little bit, and then it goes back to rotating."
   These numbers are READ OUT OF THEIR MINIFIED BUNDLE rather than eyeballed,
   because "similar" is not a spec and the feel of this is entirely in the
   timings. From @google/model-viewer@4.0.0:
     interactionPromptThreshold = 3e3   — 3s since the last input
     (now - promptStart) / 5e3 % 1      — a 5s loop
     finger x = wiggle * canvas.width * 0.05
     camera  += (wiggle - previous) * Math.PI / 16
   and two keyframe timelines, in arbitrary "frames" that divide the 5s:
     wiggle  0→-1 (5), hold (1), -1→+1 (8), hold (1), +1→0 (5), hold 0 (18)
     opacity 0→1 (1), hold (5), 1→0 (1), hold 0 (6)
   The default easing is theirs too, and it is NOT linear — a quadratic
   in-out, which is why the rock reads as a hand moving rather than a slider
   being dragged. So the finger fades in over ~385ms, the object rocks left
   then right then settles, the finger is gone by ~2.7s, and the remaining
   ~2.3s of the loop is still before it all happens again.
   Ours differs in one way, deliberately: the wiggle is applied as a DELTA to
   yaw, exactly as their adjustOrbit is, so the resting drift keeps running
   underneath it instead of being paused and restarted. */
const PROMPT_AFTER = 3000;      // ms of stillness before the first nudge
const PROMPT_LOOP = 5000;       // ms per nudge cycle
const PROMPT_SWING = Math.PI / 16;   // how far the object rocks, theirs exactly
const promptEase = (t) => (t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1);
function promptTimeline(initial, keys) {
  const curves = [], ends = [];
  let prev = initial, acc = 0;
  for (const k of keys) {
    const from = prev, to = k.v;
    curves.push((u) => from + (to - from) * promptEase(u));
    ends.push(acc += k.n);
    prev = to;
  }
  const total = ends[ends.length - 1];
  return (t) => {
    const x = Math.min(Math.max(t, 0), 1) * total;
    let i = ends.findIndex((e) => e >= x);
    if (i < 0) i = ends.length - 1;
    const lo = i < 1 ? 0 : ends[i - 1];
    return curves[i]((x - lo) / (ends[i] - lo || 1));
  };
}
const promptWiggle = promptTimeline(0, [{n:5,v:-1},{n:1,v:-1},{n:8,v:1},{n:1,v:1},{n:5,v:0},{n:18,v:0}]);
const promptFade = promptTimeline(0, [{n:1,v:1},{n:5,v:1},{n:1,v:0},{n:6,v:0}]);

function startModelViewer(stage, src) {
  const canvas = document.createElement('canvas');
  canvas.className = 'model-canvas';
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, depth: true });
  if (!gl) return false;                       // the poster <img> stays, untouched

  /* THE OPENING VIEW IS CHOSEN, not inherited. 0.95 / -0.18 was tuned for
     the old mesh and on this one it opens square onto the flat side, where
     the object reads as a lump: the saddle, the two legs and the notch
     between them - the whole form - are all invisible from there.
     2.0 / -0.28 is the three-quarter from slightly above, which is the
     angle Jack's own product render (14-object.jpg, the poster behind this
     canvas) was shot at. Picked by rendering a yaw sweep offline and
     comparing against that photograph, not by nudging it in the browser. */
  /* the hand. Built here rather than in the markup so the whole prompt is
     one thing to find, and aria-hidden because the stage already carries a
     label saying it can be dragged. */
  const hand = document.createElement('div');
  hand.className = 'model-hand';
  hand.setAttribute('aria-hidden', 'true');
  /* A HAND WITH A TOUCH RING, AND IT WAS LOOKED AT BEFORE IT SHIPPED. The previous
     two were assembled out of a ring, a stem and a pad on the theory
     that primitives cannot be malformed - true, and beside the point:
     Jack, "it looks like a joystick. It looks really bad." He was right,
     a circle on a stick is a joystick however correct its geometry.
     Drawn as three paths now - index finger, folded fingers, palm - and
     the process is the fix rather than the shape: it was rendered at
     150px next to two alternatives and compared before going anywhere
     near the page. An icon is the one thing here that cannot be checked
     by measuring it.
     Theme-independent colours, like the loader and the pong board: it is
     drawn over a light metal object on either ground, so it wants a pale
     fill and a dark outline in both. */
  hand.innerHTML =
    /* THE VIEWBOX STARTS AT -6 so the ring has somewhere to be. It is
       bigger than it was (r 6 -> 8.6) because Jack asked for it bigger,
       and at r 6 on a 20-wide finger it read as a cap rather than a
       target. Drawn LAST, so it sits over the fingertip. */
    '<svg viewBox="0 -6 44 62" aria-hidden="true">' +
      /* THE FINGERS RUN DOWN INTO THE PALM, and that is a fix rather than
         a style. Each of these is an OPEN subpath, so its fill closes
         itself with a straight line from the last point back to the
         first - and the index finger's closing line (24,26)->(16,30) did
         not meet the palm's own closing line (16,36.8)->(31.2,28). The
         wedge between them belonged to neither path, so the page showed
         through it: Jack, "a little transparent rectangle inside of it
         next to the index finger and the thumb." Invisible on the ivory
         ground and obvious the moment it is drawn on red, which is how
         it was found.
         Running the fingers to y=42 puts their fill well under the palm,
         which paints after them and covers both the overlap and the
         stroke that comes with it. */
      '<path d="M16 42V11a4 4 0 0 1 8 0v31" fill="#F7F3EB" stroke="#1A1A18" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M24 42V23a3.6 3.6 0 0 1 7.2 0v19" fill="#F7F3EB" stroke="#1A1A18" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M31.2 28v-2a3.6 3.6 0 0 1 7.2 0v11c0 8-5.4 14-13.5 14h-3.5c-4 0-6.6-1.8-9.2-5.2L6 37.5a3.8 3.8 0 0 1 5.6-5l4.4 4.3" fill="#F7F3EB" stroke="#1A1A18" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle cx="20" cy="6" r="8.6" fill="none" stroke="#1A1A18" stroke-width="2.6"/>' +
    '</svg>';
  stage.appendChild(hand);

  const FOV = 0.62;                // vertical, radians
  let radius = 1.5;                // bounding sphere, measured from the mesh on load
  /* THE OPENING POSE AND THE RESTING POSE ARE ONE PAIR OF NUMBERS, and
     for three rounds they were two. HOME_YAW / HOME_PITCH governed the
     RETURN, while the view a visitor actually arrives on came from a
     separate literal here - and since the viewer starts already homed,
     the return never runs on load, so the constants had no effect on
     anything anyone saw. Every tilt change went into the one that only
     applies after you have dragged it. Jack kept reporting the angle as
     unchanged and he was right: it was.
     Declared above the state that reads them, because a const is in the
     temporal dead zone until its own line.

     POSITIVE PITCH, which is the other half of the same confusion. The
     first offline check "proved" negative, but it ran through the crude
     preview renderer whose two-sided normal flip shades upward faces
     dark - so the flat top was in frame looking like an underside, and I
     read the picture instead of the geometry. The mesh settles it:
     upward-facing surface (normal.y > 0.85) sits at mean y 0.817 of a
     -0.83..0.83 range, so the top is at HIGH y and the eye must be ABOVE
     it. Re-rendered -0.52 / 0 / +0.52 through the shader-accurate
     renderer: +0.5-ish is the one with the saddle in view and the notch
     between the legs still readable. */
  const HOME_YAW = 2.0;         // the opening three-quarter, matching 14-object.jpg
  const HOME_PITCH = 0.36;      // positive = looking down onto the flat top

  let mesh = null, prog = null, raf = 0, yaw = HOME_YAW, pitch = HOME_PITCH;
  /* MOTION STATE. It used to be `yaw += delta` straight out of pointermove
     with a hard clamp on pitch, and Jack's read of that was "you can rotate
     a full 360, but it has like stopping points." Three of them, in fact:
     pitch hit a wall at ±1.3 rad and stopped dead, a release stopped the
     object dead because there was no momentum, and `spin = false` was
     permanent, so the turntable never came back.
     Velocities in radians/second, integrated in the frame loop, so the feel
     does not change with the input device's event rate. */
  let yawVel = 0, pitchVel = 0;
  let promptClock = 0, lastWiggle = 0, handAlpha = 0;
  let covProg = null, quadProg = null, shadowFbo = null, shadowTex = null, quadBuf = null;
  let posBuf = null, norBuf = null;
  let idle = Infinity;                          // seconds since the last input; it has been still since the page loaded
  let drag = null, dpr = 1;

  const compile = (type, srcText) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, srcText); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  };
  const U = (n) => gl.getUniformLocation(prog, n);

  /* THE CAMERA IS FITTED TO THE MESH'S BOUNDING SPHERE, and the old fixed
     DIST = 3.55 is why it clipped. Jack: "it clips off at a certain point,
     so it should always look like you can fully see it."
     Measured: this mesh's bounding sphere is radius 1.4746 (positions are
     normalised so the LONGEST axis is ±1, and the diagonal is longer than
     any axis), while 3.55 at a 0.62 rad vertical FOV only showed 1.1372.
     So it fitted at the resting angle, where the long axis lies across the
     frame, and was cut off the moment a drag stood that axis up.
     A sphere of radius r is fully inside the frustum at distance
     r / sin(halfAngle), and with free rotation the sphere IS the worst
     case - any vertex can be turned to any side. Taking the SMALLER of the
     two half-angles covers a tall stage as well as a wide one, so the phone
     band is handled by the same arithmetic.
     It is recomputed here rather than fixed, so a different export or a
     reshaped stage cannot reintroduce this. */
  const FIT_MARGIN = 1.22;         // air around it — Jack asked for it smaller in the band
  let dist = 4.0;                  // until the mesh is loaded and radius is known
  let fitDirty = true;             // forces a refit once the real radius is known
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(stage.clientWidth * dpr));
    const h = Math.max(1, Math.round(stage.clientHeight * dpr));
    if (fitDirty || canvas.width !== w || canvas.height !== h) {
      fitDirty = false;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      const aspect = w / h;
      const halfY = FOV / 2;
      const halfX = Math.atan(Math.tan(halfY) * aspect);
      dist = (radius / Math.sin(Math.min(halfX, halfY))) * FIT_MARGIN;
      gl.uniformMatrix4fv(U('uProj'), false, M4.persp(FOV, aspect, 0.1, dist + radius + 1));
      gl.useProgram(prog);   // size() can be reached mid-pass; put the object's program back
    }
  }

  function look() {
    const l = MODEL_LOOK[document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'];
    gl.uniform3fv(U('uTop'), l.top);
    gl.uniform3fv(U('uHorizon'), l.horizon);
    gl.uniform3fv(U('uBottom'), l.bottom);
    gl.uniform1f(U('uExposure'), l.exposure);
  }

  /* NOTHING STOPS ANY MORE, IN EITHER AXIS, and the upright guarantee moved
     from a clamp to a RETURN. The previous build kept pitch inside ±1.45 so
     the object could never be seen upside down, which is a wall by another
     name: Jack, after it shipped, "it still hard stops at certain points
     when I'm trying to rotate it... I should be able to rotate it all that
     I want."
     The two requests only look contradictory. He also asked for "when you
     don't touch it for like 5 or 10 seconds, then it should slowly move
     back to its original spot and start rotating" - so uprightness is a
     property of the RESTING pose, not of the drag. Let both axes run free
     while a hand is on it, and bring it home afterwards.
     That is strictly better than the clamp: every angle is reachable, there
     is no edge to hit, and the object still spends all of its unattended
     life the right way up. */
  /* -0.40, not -0.28: Jack wanted the eye a little higher so the flat top
     of the clip reads - "we should be able to see the top a little bit,
     the flat part... but it's really close". Negative pitch tips the far
     side down, which is what shows the upper surface. Chosen by rendering
     -0.28 / -0.38 / -0.46 / -0.56 offline against the real mesh: past -0.5
     the two legs start to foreshorten into each other and the notch
     between them closes up, which is the feature that explains the object. */
  /* 0.20 rad/s, about 11 deg/s - one revolution every 31 seconds.
     It was 0.30, which Jack called a little fast, and then 0.14, which he
     read as not rotating at all. Measured in the page, 0.14 is 8 deg/s on
     a smooth and nearly symmetric object: genuinely moving and genuinely
     imperceptible. 0.20 is the middle and is visible without being busy. */
  const IDLE_SPIN = 0.20;
  const IDLE_AFTER = 6.0;       // "like 5 or 10 seconds" before it heads home
  const THROW_DECAY = 1.8;      // a flick is down to ~2% of itself in 2s
  const RETURN_EASE = 1.1;      // how briskly it travels back
  const HOME_EPS = 0.01;        // close enough to call it home and start spinning

  /* Angles are unbounded, so coming home has to take the SHORT way round.
     After a couple of full tumbles yaw can be 14 rad from where it started
     and pitch can be past vertical; without this the object would unwind
     every turn it was given, which looks like a rewind rather than a
     return. */
  const shortWay = (from, to) => {
    let d = (to - from) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  };

  /* TRUE AT THE START, so it drifts from the first frame. This was the
     other half of "it's not rotating when you leave it": the spin is
     gated behind IDLE_AFTER, and that gate was applied to a page that had
     only just loaded, so the object sat dead still for six seconds before
     doing anything. The delay is meant to be a pause after you LET GO,
     not a wait on arrival - nothing has been touched yet, so there is
     nothing to wait for and nowhere to return from. */
  let homed = true;             // true once it has arrived and is just drifting

  /* built once the mesh is in, because the ortho extent comes off its
     radius. A failure here must not take the object down with it - the
     shadow is the first thing to lose on a context that will not give us
     a float-free RGBA framebuffer. */
  function setupShadow() {
    try {
      covProg = gl.createProgram();
      gl.attachShader(covProg, compile(gl.VERTEX_SHADER, SHADOW_COV_VS));
      gl.attachShader(covProg, compile(gl.FRAGMENT_SHADER, SHADOW_COV_FS));
      gl.linkProgram(covProg);
      quadProg = gl.createProgram();
      gl.attachShader(quadProg, compile(gl.VERTEX_SHADER, SHADOW_QUAD_VS));
      gl.attachShader(quadProg, compile(gl.FRAGMENT_SHADER, SHADOW_QUAD_FS));
      gl.linkProgram(quadProg);
      if (!gl.getProgramParameter(covProg, gl.LINK_STATUS) ||
          !gl.getProgramParameter(quadProg, gl.LINK_STATUS)) throw new Error('shadow link');
      shadowTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, shadowTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SHADOW_RES, SHADOW_RES, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      /* CLAMP_TO_EDGE and not REPEAT: a blur tap that wrapped would paint
         the far side of the object onto the near edge of the shadow. */
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      shadowFbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowTex, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('fbo');
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    } catch (e) {
      covProg = quadProg = shadowFbo = null;   // object still draws, just unshadowed
    }
  }

  /* WHOEVER DISTURBS THE STATE PUTS IT BACK. This used to live at the
     end of the shadow quad, which worked only for as long as the quad
     was drawn unconditionally - and it stopped being, the moment the
     shadow learned to fade out below the floor. Skipping the quad left
     the COVERAGE program bound, whose whole job is to output vec4(1.0),
     so the object came out as a solid white silhouette for exactly the
     orientations where the shadow is hidden. Jack: "whenever you go
     under and look at the bottom, it now looks like there's just like a
     white shape."
     WebGL1 has no VAOs, so attribute pointers are global state and a
     uniform written against another program's location is an
     INVALID_OPERATION that fails silently. Both are the same lesson: a
     teardown attached to an optional call is not a teardown. */
  function useObjectProgram() {
    gl.useProgram(prog);
    const pl = gl.getAttribLocation(prog, 'aPos'), nl = gl.getAttribLocation(prog, 'aNor');
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(pl); gl.vertexAttribPointer(pl, 3, gl.SHORT, true, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, norBuf);
    gl.enableVertexAttribArray(nl); gl.vertexAttribPointer(nl, 3, gl.BYTE, true, 0, 0);
  }

  /* PASS 1: the coverage map. Yaw only - this camera looks straight down
     the floor's normal, so pitch would tilt the thing it is measuring. */
  function drawCoverage(spin, extent) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFbo);
    gl.viewport(0, 0, SHADOW_RES, SHADOW_RES);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(covProg);
    const loc = gl.getAttribLocation(covProg, 'aPos');
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 3, gl.SHORT, true, 0, 0);
    gl.uniformMatrix4fv(gl.getUniformLocation(covProg, 'uSpin'), false, spin);
    gl.uniform1f(gl.getUniformLocation(covProg, 'uExtent'), extent);
    gl.uniform2fv(gl.getUniformLocation(covProg, 'uSkew'), SHADOW_SKEW);
    gl.drawElements(gl.TRIANGLES, mesh.nt * 3, gl.UNSIGNED_SHORT, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.enable(gl.DEPTH_TEST);
    useObjectProgram();   // unconditionally: the quad after this is optional
  }

  /* PASS 2: the floor. Pitch only, no depth write - it is behind
     everything and the object is drawn over it. */
  function drawShadowQuad(projM, viewM, tipM, extent, floorY, strength) {
    gl.useProgram(quadProg);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    const loc = gl.getAttribLocation(quadProg, 'aCorner');
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const Q = (n) => gl.getUniformLocation(quadProg, n);
    gl.uniformMatrix4fv(Q('uProj'), false, projM);
    gl.uniformMatrix4fv(Q('uView'), false, viewM);
    gl.uniformMatrix4fv(Q('uTip'), false, tipM);
    gl.uniform1f(Q('uExtent'), extent);
    gl.uniform1f(Q('uFloor'), floorY);
    gl.uniform1f(Q('uStrength'), strength);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, shadowTex);
    gl.uniform1i(Q('uCov'), 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    useObjectProgram();
  }

  let last = 0, lastTheme = null;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;

    if (!drag && dt) {
      idle += dt;
      if (!prefersReducedMotion && idle > IDLE_AFTER) {
        /* HOME, THEN DRIFT. Two phases rather than one blend, because they
           want opposite things: getting back wants a target, drifting wants
           a rate, and running both at once is what made the previous build
           creep at a quarter of its stated speed.
           The travel is `1 - exp(-k·dt)` on the SHORT way round each axis,
           so it is framerate-independent and never unwinds a turn the
           visitor gave it. Once inside HOME_EPS it latches and the only
           thing left is the slow spin - so it does not keep hauling itself
           back to HOME_YAW while it drifts away from it. */
        if (!homed) {
          const k = 1 - Math.exp(-RETURN_EASE * dt);
          const dy = shortWay(yaw, HOME_YAW);
          const dp = shortWay(pitch, HOME_PITCH);
          yaw += dy * k;
          pitch += dp * k;
          if (Math.abs(dy) < HOME_EPS && Math.abs(dp) < HOME_EPS) {
            /* land on the NEAREST EQUIVALENT of home, not on HOME_YAW
               itself. Assigning the literal throws away however many whole
               turns the visitor put in - 6π in the checker's case. The
               pose renders identically either way, since the matrix is
               2π-periodic, but it is an 18-radian discontinuity in the
               number, and anything that ever reads the angle (the checker
               did) sees a jump that is not a movement. */
            yaw += dy; pitch += dp; homed = true;
          }
        } else {
          yaw += IDLE_SPIN * dt;
        }
        yawVel = pitchVel = 0;
      } else {
        /* still coasting from a throw. Exponential rate, closed-form
           displacement - a `yaw += vel * dt` Riemann sum is not
           framerate-independent even when the rate is, and that alone had
           60Hz and 144Hz 0.022 rad apart after one second. */
        const e = Math.exp(-THROW_DECAY * dt);
        yaw += yawVel * (1 - e) / THROW_DECAY;
        pitch += pitchVel * (1 - e) / THROW_DECAY;
        yawVel *= e;
        pitchVel *= e;
      }
    }

    /* the nudge rides on top of whatever the motion above decided, so the
       drift carries on underneath it. Reduced motion gets none of it: it is
       decorative movement, and the stage is labelled as draggable anyway. */
    let want = 0;
    if (!drag && dt && !prefersReducedMotion) {
      promptClock += dt * 1000;
      if (promptClock > PROMPT_AFTER) {
        const pt = ((promptClock - PROMPT_AFTER) / PROMPT_LOOP) % 1;
        const w = promptWiggle(pt);
        want = promptFade(pt);
        hand.style.transform = 'translate(-50%,0) translateX(' +
          (w * stage.clientWidth * 0.05).toFixed(2) + 'px)';
        yaw += (w - lastWiggle) * PROMPT_SWING;
        lastWiggle = w;
      }
    }
    /* ONE EASED ALPHA RATHER THAN THE CURVE WRITTEN STRAIGHT OUT. The
       timeline's own fade is kept - the ease is fast enough (83ms time
       constant against its 385ms ramp) to track it closely - but it also
       covers the two edges the curve does not: grabbing the object
       mid-prompt used to blank the hand on the same frame, and a tab
       returning from the background used to resume it at full opacity.
       Both are now a short dissolve. Rounded to 3dp so an unchanged value
       does not dirty the style attribute every frame. */
    const eased = handAlpha + (want - handAlpha) * (1 - Math.exp(-14 * (dt || 0)));
    if (Math.abs(eased - handAlpha) > 0.0005 || (want === 0 && handAlpha !== 0)) {
      handAlpha = eased < 0.002 ? 0 : eased;
      hand.style.opacity = handAlpha.toFixed(3);
    }

    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    if (theme !== lastTheme) { lastTheme = theme; look(); }
    size();
    const spin = M4.rotY(yaw);
    const tip = M4.rotX(pitch);
    const model = M4.mul(tip, spin);
    const view = M4.trans(0, 0, -dist);
    const projM = M4.persp(FOV, canvas.width / canvas.height, 0.1, dist + radius + 1);

    /* the shadow goes down first: coverage into its own buffer, then the
       floor quad, then the object over the top of both */
    if (shadowFbo) {
      const extent = radius * 1.35;
      drawCoverage(spin, extent);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (shadowFbo) {
      /* THE SHADOW GOES WHEN YOU GO UNDER THE FLOOR, which is what the
         other viewer does and what a floor plane physically means. After
         rotX(pitch) the floor's normal is (0, cos p, sin p) and the eye
         looks down -Z, so the plane faces the camera exactly while
         sin(pitch) > 0: edge-on at 0, and underneath below it. Drawing a
         contact shadow while the visitor is looking up at the object from
         below is the thing that gives away that it is painted on.
         Faded rather than switched, over the last ~8 degrees, so tumbling
         through the floor is a dissolve and not a pop. */
      const facing = Math.sin(pitch);
      const t = Math.max(0, Math.min(1, facing / 0.14));
      const underFade = t * t * (3 - 2 * t);
      if (underFade > 0.001) {
        drawShadowQuad(projM, view, tip, radius * 1.35, -radius * 0.98,
          SHADOW_STRENGTH * underFade);
      }
    }
    gl.uniformMatrix4fv(U('uModel'), false, model);
    gl.uniformMatrix4fv(U('uView'), false, view);
    gl.uniformMatrix3fv(U('uNormal'), false, new Float32Array([
      model[0], model[1], model[2], model[4], model[5], model[6], model[8], model[9], model[10]]));
    gl.uniform3f(U('uEye'), 0, 0, dist);
    gl.drawElements(gl.TRIANGLES, mesh.nt * 3, gl.UNSIGNED_SHORT, 0);
  }

  fetch(src).then((r) => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.arrayBuffer();
  }).then((buf) => {
    mesh = parseMesh(buf);
    // the fit above needs the real worst case, so measure it rather than
    // assuming the bbox: the diagonal is longer than any single axis
    let r2 = 0;
    for (let i = 0; i < mesh.nv; i++) {
      const x = mesh.pos[i*3] / 32767, y = mesh.pos[i*3+1] / 32767, z = mesh.pos[i*3+2] / 32767;
      const d2 = x*x + y*y + z*z;
      if (d2 > r2) r2 = d2;
    }
    radius = Math.sqrt(r2);
    fitDirty = true;
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, MODEL_VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, MODEL_FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    gl.enable(gl.DEPTH_TEST);
    /* NO BACK-FACE CULLING, deliberately. A decimated mesh cannot promise
       its winding: the packer re-orients every triangle against the
       averaged normals now, which fixed the specks this used to cause, but
       "every triangle a cluster pass could get wrong" is not a guarantee I
       want a visible hole to depend on. The depth test does the real work,
       38k triangles of overdraw costs nothing measurable, and the shader
       has always carried `if (!gl_FrontFacing) N = -N;` - which was dead
       code while culling was on, and is the thing that makes this safe. */
    gl.clearColor(0, 0, 0, 0);

    const buffer = (data, target, loc, type) => {
      const b = gl.createBuffer();
      gl.bindBuffer(target, b);
      gl.bufferData(target, data, gl.STATIC_DRAW);
      if (loc !== undefined) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 3, type, true, 0, 0); }
      return b;
    };
    posBuf = buffer(mesh.pos, gl.ARRAY_BUFFER, gl.getAttribLocation(prog, 'aPos'), gl.SHORT);
    norBuf = buffer(mesh.nor, gl.ARRAY_BUFFER, gl.getAttribLocation(prog, 'aNor'), gl.BYTE);
    buffer(mesh.idx, gl.ELEMENT_ARRAY_BUFFER);
    setupShadow();
    gl.uniform3fv(U('uBase'), [0.80, 0.81, 0.85]);
    gl.uniform1f(U('uRough'), 0.31);
    look();
    size();
    stage.appendChild(canvas);
    stage.classList.add('is-live');
    raf = requestAnimationFrame(frame);
  }).catch(() => { /* poster image stays; nothing to clean up */ });

  /* Pointer events, so one path covers finger, pen and mouse — the same
     reason pong does. touch-action is none in CSS or a drag scrolls the
     page instead of turning the object. */
  /* DRAG SPEED IS PER FRACTION OF THE STAGE, not per pixel. It was a flat
     0.01 rad/px, so the same gesture turned the object a different amount
     on a phone than on a desktop, and after the stage grew to a full-width
     band it turned it much less. A full sweep across the stage is now
     0.75 of a turn whatever the stage measures - it was 1.1, and Jack
     asked for it slower in the hand as well as at rest. */
  const SWEEP = Math.PI * 1.5;
  let moved = 0;

  stage.addEventListener('pointerdown', (e) => {
    if (!mesh) return;
    drag = { x: e.clientX, y: e.clientY, t: performance.now() };
    moved = 0;
    yawVel = pitchVel = 0;     // catching a spinning object stops it dead, as it should
    idle = 0;
    homed = false;             // it has been moved, so it owes a trip home
    promptClock = 0; lastWiggle = 0;   // the eased alpha fades the hand out
    stage.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    const dx = (e.clientX - drag.x) / w * SWEEP;
    const dy = (e.clientY - drag.y) / h * SWEEP;
    const now = performance.now();
    const dt = Math.max(now - drag.t, 1) / 1000;
    yaw += dx;
    pitch += dy;              // unbounded, like yaw: nothing stops
    /* Velocity for the throw, smoothed. A raw last-sample delta is noisy -
       one slow final move before lifting off and the object stops dead
       even though the gesture was a flick - so it is a rolling blend. */
    yawVel += ((dx / dt) - yawVel) * 0.3;
    pitchVel += ((dy / dt) - pitchVel) * 0.3;
    moved += Math.abs(dx) + Math.abs(dy);
    drag = { x: e.clientX, y: e.clientY, t: now };
  });
  const release = () => {
    if (!drag) return;
    drag = null;
    idle = 0;
    // a tap is not a throw: without this, the jitter of a click would
    // launch the object at whatever the last two samples implied
    if (moved < 0.02) { yawVel = 0; pitchVel = 0; }
    // and a throw has a ceiling, so a fast swipe on a phone cannot turn it
    // into a blur nobody asked for
    const CAP = 9;
    yawVel = Math.max(-CAP, Math.min(CAP, yawVel));
    pitchVel = Math.max(-CAP, Math.min(CAP, pitchVel));
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  /* A drag-only control is a control a keyboard cannot reach. The arrows
     nudge the velocity rather than the angle, so a held key accelerates
     into a smooth turn and coasts to a stop on release - the same motion
     the pointer gets, instead of a series of 0.22 rad jumps. */
  stage.addEventListener('keydown', (e) => {
    const push = 1.5;
    if (e.key === 'ArrowLeft') yawVel -= push;
    else if (e.key === 'ArrowRight') yawVel += push;
    else if (e.key === 'ArrowUp') pitchVel -= push;
    else if (e.key === 'ArrowDown') pitchVel += push;
    else return;
    idle = 0;
    homed = false;
    promptClock = 0; lastWiggle = 0;   // the eased alpha fades the hand out
    e.preventDefault();
  });

  /* Stop the loop when the panel it lives in is closed. A requestAnimationFrame
     left running behind a closed overlay is a phone battery being spent on a
     thing nobody is looking at. */
  return {
    stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; },
    start() { if (mesh && !raf) { last = 0; raf = requestAnimationFrame(frame); } },
  };
}

const liveModels = [];
/* APPENDS, it does not reset. It used to stop and drop everything first,
   which was fine while one call site existed and silently wrong the moment
   a second arrived: the panel now sets up .project-media and then
   #projectStage, and a self-clearing setup would have had the second call
   kill the viewer the first one had just started. Tearing down is
   stopModelStages' job, and renderProjectMedia already calls it. */
function setupModelStages(root) {
  root.querySelectorAll('[data-model]').forEach((stage) => {
    stage.tabIndex = 0;
    stage.setAttribute('role', 'application');
    const label = T.t('a11y.modelViewer');
    if (label) stage.setAttribute('aria-label', label);
    const v = startModelViewer(stage, stage.getAttribute('data-model'));
    if (v) liveModels.push(v);
  });
}
function stopModelStages() {
  while (liveModels.length) { const m = liveModels.pop(); if (m && m.stop) m.stop(); }
}

/* ==========================================================================
   SECTION 20 · BOOT THE ROUTE — and this has to be the LAST thing in the file.

   It was 200 lines higher to begin with, next to the other i18n wiring, and
   that threw "Cannot access 'dialogStack' before initialization": opening a
   panel calls activateDialog, which reads a const declared further down, so
   the whole of syncToRoute died in the temporal dead zone after the overlay
   had been given its class but before the title and canonical were set. A
   deep link looked like it worked and shared as the home page.

   The replaceState is what makes Back safe. A visitor who lands directly on
   /work/easter-riverside has exactly one history entry, so a Back out of the
   open panel would leave the site, and leaveOverlay() would have to behave
   differently depending on how the visitor arrived. Putting a synthetic "/"
   underneath first means there is always one of ours to go back to and every
   path through the code is the same afterwards.

   applyRouteMeta runs again on DOMContentLoaded because i18n.js applies its
   strings there, after this file executes, and its pass resets
   document.title to the generic one.
   ========================================================================== */
{
  const initial = routeFromPath(location.pathname);
  if (initial.kind === 'home') {
    /* A path that matched the rewrite but not a real project - /work/typo,
       or a slug from a project that has since been renamed - lands here.
       The rewrite already served the home page with a 200, so the only
       thing left to fix is the address bar: normalise it to "/" rather than
       leave a URL showing that does not exist. The canonical says "/" too,
       so a crawler that reached it is told the same thing. */
    const stray = location.pathname !== '/';
    history.replaceState(
      { kind: 'home', id: null }, '',
      (stray ? '/' : location.pathname) + location.search + location.hash
    );
  } else {
    history.replaceState({ kind: 'home', id: null }, '', '/');
    history.pushState({ kind: initial.kind, id: initial.id || null }, '', pathForRoute(initial));
  }
  syncToRoute(initial);
  document.addEventListener('DOMContentLoaded', () => {
    applyRouteMeta(routeFromPath(location.pathname));
  });
}
