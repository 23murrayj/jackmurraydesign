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

   THE ONE ORDERING RULE: the routing boot block is SECTION 19 and must
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
function mediaTag(entry, projectId, index, projectTitle) {
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
  const img = `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${dims}${srcset}${track}${full}${exif}` +
              ` loading="lazy" decoding="async">`;
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

  gallery.innerHTML = Object.entries(projectData).map(([id, p]) => {
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
        (thumb && thumb.altIndex ? thumb.altIndex - 1 : 0), p.title)}</div>
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

function renderProjectMedia(data) {
  projectMedia.className = `project-media layout-${data.layout}`;
  // masonry projects get the full-page sticky-scroll treatment: photos
  // flow with the page on the left, info panel pinned on the right
  projectDetailEl.classList.toggle('is-masonry', data.layout === 'masonry');
  // the sticky two-column shell: every masonry project, plus anything that
  // opts in with `sidebar: true` so its write-up reads alongside its images
  projectDetailEl.classList.toggle('has-sidebar',
    data.layout === 'masonry' || data.sidebar === true);
  projectDetailEl.classList.toggle('is-video', data.layout === 'video');
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
    projectMedia.innerHTML = items.map((entry, i2) =>
      `<div class="masonry-item size-${sizes[i2]}">${mediaTag(entry, data.id, i2, data.title)}</div>`
    ).join('');
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
  activateDialog(projectOverlay, projectBack);
}

function closeProject() {
  openProjectId = null;
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
  activateDialog(aboutOverlay, aboutBack);
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

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

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

// seamless marquee: keep duplicating the group until it's wide enough
// to fill at least double the viewport, so the -50% loop never shows a gap
/* ------------------------------------------------------------------------
   SECTION 14 · MARQUEE STRIPS
   Fixed px/second, so resizing the type does not change the speed.
   ------------------------------------------------------------------------ */
function setupSeamlessMarquee(trackId, groupClass, pxPerSecond) {
  const track = document.getElementById(trackId);
  if (!track) return;
  function fill() {
    const groupSelector = `.${groupClass}`;
    const groups = () => track.querySelectorAll(groupSelector);
    const baseGroup = groups()[0];
    if (!baseGroup) return;
    const targetWidth = window.innerWidth * 2.2;
    // remove any extra clones beyond the original two groups
    track.querySelectorAll(`${groupSelector}.clone`).forEach((el) => el.remove());
    let currentWidth = Array.from(groups()).reduce((sum, el) => sum + el.offsetWidth, 0);
    while (currentWidth < targetWidth) {
      const clone = baseGroup.cloneNode(true);
      clone.classList.add('clone');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
      currentWidth += clone.offsetWidth;
    }
    // an even group count keeps the -50% loop point on a group boundary (no seam)
    if (groups().length % 2 !== 0) {
      const clone = baseGroup.cloneNode(true);
      clone.classList.add('clone');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
    const groupWidth = baseGroup.offsetWidth;
    const totalGroups = groups().length;
    const duration = (groupWidth * (totalGroups / 2)) / pxPerSecond;
    track.style.animationDuration = duration + 's';
  }
  window.addEventListener('load', fill);
  window.addEventListener('resize', fill);
  fill();
  return fill;
}
const marqueeRefills = [
  setupSeamlessMarquee('marqueeTrack', 'marquee-group', 55),
  setupSeamlessMarquee('skillsTrack', 'skills-group', 36)
].filter(Boolean);

// Both ticker strips are authored in the HTML as two base groups which
// setupSeamlessMarquee then clones to fill the viewport. Retranslating
// means rewriting the base groups, dropping the stale clones, and letting
// the refill re-clone at the new text width — Japanese and Spanish are
// materially different lengths, so the clone count genuinely changes.
function renderTickers() {
  const mTrack = document.getElementById('marqueeTrack');
  if (mTrack) {
    const items = T.list('marquee.items');
    if (items.length) {
      const SEP = '\u00A0\u00A0\u2726\u00A0\u00A0';
      // non-breaking spaces inside an item keep multi-word entries
      // ("BRAND SYSTEMS") from breaking across the scroll
      const text = items.map((s) => s.replace(/ /g, '\u00A0')).join(SEP) + SEP;
      mTrack.querySelectorAll('.marquee-group').forEach((g) => {
        if (g.classList.contains('clone')) { g.remove(); return; }
        const span = g.querySelector('span');
        if (span) span.textContent = text;
      });
    }
  }

  const sTrack = document.getElementById('skillsTrack');
  if (sTrack) {
    const items = T.list('skills.marquee');
    if (items.length) {
      sTrack.querySelectorAll('.skills-group').forEach((g) => {
        if (g.classList.contains('clone')) { g.remove(); return; }
        g.textContent = '';
        items.forEach((txt) => {
          const span = document.createElement('span');
          span.textContent = txt;
          g.appendChild(span);
        });
      });
    }
  }

  marqueeRefills.forEach((fn) => fn());
}
renderTickers();

/* ------------------------------------------------------------------------
   SECTION 15 · HERO SHAPE FIELD
   Twelve per theme, AUTHORED positions. Four forms only - do not add a fifth.
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
    /* viewBox units, so these ARE percentages of the rendered size and
       scale for free. Stars stay at 3 where smooth shapes get 5: a sharp
       star's inner radius is 14 against an outer 48, and a 5-unit stroke
       on spikes that thin closes the notches up into a blob. */
    poly.style.strokeWidth = def.type === 'star' ? '3' : '5';
    svg.appendChild(poly);
    return svg;
  }

  /* Four forms, and that is the whole vocabulary: circle, square and
     triangle in light, jagged star in dark. An arc, a flat bar and a cross
     were added on 2026-11-10 to give the field more to look at and were
     cut the same day - "they dont fit". They were not wrong in isolation;
     they were wrong HERE. This page already carries a lot of distinct
     geometry - the marquee band, the hard rules, the cards, the chips, the
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
       5% matches what the triangles already do, so one weight now governs
       every smooth outline: 132 -> 7px, 104 -> 5, 72 -> 4, 36 -> 3 via the
       floor. The floor exists because 5% of the smallest shape is under 2px,
       which at .33 alpha on a phone is not a line, it is a rumour.
       Jack asked for "a little bit thicker"; what it actually needed was
       consistent, and consistent happens to be thicker everywhere it was
       thin. Stars keep their own 3% - see createSvgShape. */
    if (!def.filled) {
      el.style.borderWidth = Math.max(3, Math.round(def.size * 0.05)) + 'px';
    }
    return el;
  }

  /* TWELVE. It has been twelve before and the history matters, because the
     first twelve were not twelve things you could see: three of them were
     var(--highlight), which light mode resolves to stone at 1.43:1 on the
     ground, and at .38 alpha that is a shape you cannot find. So it was
     really nine objects and three ghosts, and it was cut to nine. It came
     back to twelve on 2026-11-10 by adding three more shapes that actually
     read, not by reinstating the ghosts. **Do not colour a light-mode shape
     --highlight.**
     The amber pair are deliberately the two SMALLEST shapes - "a little
     vibrancy", not a third primary.

     vivid: true on FOUR of the twelve here, and two of the twelve in dark.
     At a flat .38 the whole field read as pale, which is correct for texture
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
     whole of what made the field look unconsidered. Random twelve-point
     scatter clumps: on any given load two or three shapes would overlap
     into one blob and a quadrant would be empty, and because it re-rolled
     on every load and every theme switch there was no arrangement to
     judge, let alone tune. Authored, the composition is a thing with
     intent that can be argued with - and it is the same one every time.

     The arrangement is THREE BANDS OF THREE, and each band carries a left,
     a centre and a right:
         y .195 / .21  / .26    x .11  .44  .82
         y .42  / .45  / .49    x .14  .95  .40
         y .745 / .86  / .88    x .88  .25  .70
     Measured against the real hero at 1440, where the field box is
     1440x1026: the nav ends at y .092, the name occupies .184-.499, the
     side column .236-.499, the marquee strip .579-.640, SELECTED PROJECTS
     .702-.875 and the filter row .914-1.002. So band one sits across the
     top of the name, band two across its foot and the margins either side,
     band three down in the seam.
     Band two is NOT on the marquee, and that was a correction: at .57-.66
     all three rested on or beside the strip, and a 50px near-black circle
     at .38 over a near-black slab is not a shape, it is a smudge. They
     cross it on the drift, which is fine and always was; they just do not
     live there.
     That is the same "thin out across strip, heading and tags" the field
     was extended 306px for - it only actually happens if shapes LIVE down
     there rather than wandering down by luck, which is what twelve random
     y values gave: usually six in the hero and three nowhere useful.

     Two more things the slots are doing:
     - The two largest forms are the corner-to-corner diagonal, .11/.195
       and .88/.745. The name is heavy left and the column light right, so
       the bottom-right anchor is the counterweight to the headline, and it
       lands in the same corner as the seam ring in styles.css.
     - No resting position is in the nav band or under the full stop after
       MURRAY, and both are about the SWING, not the resting point. Every
       shape travels +/- its amplitude: the 36px amber circle swings +/-116px
       vertically, so a rest at .17 would have put it in the nav on half of
       every cycle, and the black 50px circle swings +/-127 horizontally, so
       a rest at .55/.52 parked it on the full stop - which is exactly what
       it did, and it looked like a smudge on the page's one piece of
       punctuation-as-graphic. They rest at .26 and .40/.49 instead, and
       the circle's x never reaches .636 where the full stop starts.
     This is NOT a keep-out. Nothing clamps anything at runtime, and a shape
     is free to drift over the name, the column, the nav and the marquee -
     the build that fenced them out of measured boxes was tried and rejected
     and must not come back, see CLAUDE.md. This sets where a shape lives,
     not where it is allowed to go. */
  /* NINE, down from twelve on 2026-11-11. Jack: "I don't love where we're
     at now... maybe take out a couple shapes."

     THIS ARRANGEMENT WAS CHOSEN, NOT COMPOSED BY HAND. It is one of several
     that tools/field-shuffle.js generated inside the rules, rendered on the
     real page, and Jack picked by eye - the "bold" size profile, which
     scales the big shapes harder than the small ones and takes the set from
     132..36 to 191..36. That is the workflow these rules exist to support:
     the generator guarantees the arrangement is valid, the eye decides
     which valid one it is. Do not hand-edit a coordinate here without
     re-running `node tools/field-check.js`.

     Nine is not just twelve minus three - it changes what the rules can
     guarantee. With 4 blue and 4 coral shapes across 3 bands, pigeonhole
     forced some band to hold two of one hue at full budget. At nine there
     are 3 blue, 3 coral, 2 black and 1 amber, so every band gets exactly
     one blue and one coral and **no band repeats a hue at ANY budget** -
     the rule that used to be enforceable only on a phone now holds
     everywhere. Colour banding is what Jack caught by eye last time; this
     makes it structurally impossible rather than merely checked.

     What went, and why those three:
     - the 104 coral square at .11/.215, because TOP had to lose a coral
       and the 90 disc is the one Jack asked for. The 36 amber ring moved
       from .34 to .14 to keep something anchoring the top-left.
     - the 80 blue triangle at .07/.50, so MID keeps its far-right shape.
     - the 48 amber triangle at .66/.84, which also leaves amber with a
       single instance in the whole field - the hollow ring over the name.

     `keep` is the thinning rank: 1 is the shape the composition can least
     afford to lose. 9 above 760px, 7 at or below it, 5 at or below 600.
     Bands come out 3/3/3, 3/2/2 and 2/2/1, hues mixed at all three.
     `node tools/field-check.js` proves it - run it after ANY edit here. */
  const smoothDefs = [
    /* The biggest shape, and it leads the TOP band rather than anchoring a
       corner - at 191px an outline circle beside the name is the one object
       that can hold its own against a 12rem headline without filling in.
       Worth knowing what this arrangement gave up: until 2026-11-11 the
       largest shape sat bottom-right, concentric with the seam ring in
       styles.css, and the two read as the same figure at two scales. That
       echo is not part of this layout. It was my rationale rather than a
       rule, and the arrangement Jack chose is better without it - but if a
       future version wants the echo back, put the largest shape in the
       SEAM band at a high x and the relationship returns. */
    { type: 'circle',   size: 191, color: 'var(--blue)',        filled: false, keep: 3, at: [0.586, 0.263] },
    /* FILLED, and the one that changes the character of the field.
       Everything large used to be an outline, so the whole thing read as
       line work with a few small solids dropped in. One big soft coral
       disc gives it a mass to sit against. Jack's own suggestion.
       It sits in the SEAM here, half off the right edge at .903, which is
       where the seam ring in styles.css also lives - so the corner that
       used to hold the field's largest outline now holds its largest
       solid. */
    { type: 'circle',   size: 113, color: 'var(--accent)',      filled: true,  keep: 8, at: [0.903, 0.702] },
    { type: 'circle',   size: 137, color: 'var(--blue)',        filled: false, keep: 1, at: [0.561, 0.873] },
    { type: 'circle',   size: 53,  color: 'var(--black)',       filled: true,  keep: 6, at: [0.459, 0.536] },
    { type: 'triangle', size: 61,  color: 'var(--accent)',      filled: false, keep: 2, at: [0.881, 0.277] },
    /* the smallest solid coral, and the one object in the field allowed to
       look like a deliberate mark rather than drift. Small enough to keep
       its vivid alpha - see the 90px ceiling in tools/field-shuffle.js. */
    { type: 'square',   size: 47,  color: 'var(--accent)',      filled: true,  vivid: true, keep: 4, at: [0.872, 0.487] },
    /* HOLLOW, and it stays hollow wherever it lands. Filled, this stacked
       three maxima on one object: the warmest hue, the brightest alpha and
       a solid mass. That was unbearable when it sat over the name - Jack:
       "it stands out too much" - and the fix was to make it a ring rather
       than to move it, so the reasoning survives a reshuffle. In this
       arrangement it rests at the bottom-left of the seam instead.
       Keeps vivid: a 3px amber border at the base alpha is barely there,
       and the point was to quieten it, not delete it. It is also the only
       amber left in the field, so it is the whole of the third hue. */
    { type: 'circle',   size: 36,  color: 'var(--accent-warm)', filled: false, vivid: true, keep: 5, at: [0.096, 0.81] },
    { type: 'square',   size: 84,  color: 'var(--black)',       filled: false, keep: 7, at: [0.208, 0.24] },
    { type: 'square',   size: 81,  color: 'var(--blue)',        filled: true,  vivid: true, keep: 9, at: [0.083, 0.534] },
  ];

  /* Same twelve-shape budget in dark, and the neons stay neon: this half of
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
  /* The SAME nine slots, assigned biggest-to-biggest, so the theme switch -
     which rebuilds this field inside the view-transition callback - reveals
     the same composition wearing different shapes instead of jumping to a
     new scatter mid-wipe. Two vivid here rather than three, and NOT the
     amber: off-white text crossing an amber star measures 3.22:1 at the
     base .62 already, and brightening it is the one move in this field that
     would take a pair below 3:1. */
  const jaggedDefs = [
    { type: 'star', size: 203, color: 'var(--blue)',        filled: false, spikes: 6, sharp: true, keep: 3, at: [0.586, 0.263] },
    { type: 'star', size: 120, color: 'var(--accent)',      filled: true,  spikes: 7, sharp: true, keep: 8, at: [0.903, 0.702] },
    { type: 'star', size: 145, color: 'var(--blue)',        filled: false, spikes: 7, sharp: true, keep: 1, at: [0.561, 0.873] },
    { type: 'star', size: 60,  color: 'var(--highlight)',   filled: true,  spikes: 5, sharp: true, keep: 6, at: [0.459, 0.536] },
    { type: 'star', size: 67,  color: 'var(--accent)',      filled: false, spikes: 6, sharp: true, keep: 2, at: [0.881, 0.277] },
    { type: 'star', size: 41,  color: 'var(--accent)',      filled: true,  spikes: 5, sharp: true, vivid: true, keep: 4, at: [0.872, 0.487] },
    /* hollow here too, matching light slot for slot */
    { type: 'star', size: 34,  color: 'var(--accent-warm)', filled: false, spikes: 6, sharp: true, keep: 5, at: [0.096, 0.81] },
    { type: 'star', size: 84,  color: 'var(--highlight)',   filled: false, spikes: 8, sharp: true, keep: 7, at: [0.208, 0.24] },
    { type: 'star', size: 74,  color: 'var(--blue)',        filled: true,  spikes: 5, sharp: true, vivid: true, keep: 9, at: [0.083, 0.534] },
  ];

  /* Where a shape sits at a given moment, with no cursor and no chaos in it.
     Pulled out of the animation loop so the loop and the initial placement
     below cannot drift apart - this formula is the look of the whole field
     and it should exist once.
     Two sine terms per axis, not one. A single sine traces a clean ellipse
     and twelve ellipses read as clockwork; the faster, smaller wobble on top
     breaks the period so each path wanders instead. */
  function driftAt(s, time, rect) {
    return {
      x: s.baseX * rect.width
        + Math.sin(time * s.speed + s.phase) * s.ampX
        + Math.sin(time * s.wobbleSpeed + s.phase * 1.7) * s.wobbleAmp,
      y: s.baseY * rect.height
        + Math.cos(time * s.speed * 0.8 + s.phase) * s.ampY
        + Math.cos(time * s.wobbleSpeed * 0.83 + s.phase) * s.wobbleAmp,
    };
  }

  /* Put every shape where it belongs the instant it is built, instead of
     leaving it at translate(0,0) until the next animation frame.
     That gap is normally one frame and invisible. It stops being invisible
     under a view transition: the theme switch rebuilds the field inside the
     transition callback, and the new snapshot is taken BEFORE the next frame
     runs - so without this the wipe would reveal twelve shapes piled in the
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

  /* How many of the twelve survive at this width. Thinning, not dimming -
     and that reverses what the ≤760px opacity rule says it does ("dialled
     back rather than thinned out, so the phone keeps the same look with less
     of it"). That was the wrong read: at 375 the field box is 338px wide
     against 1440's, so twelve objects are nearly four times as dense per
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
  function shapeBudget() {
    if (mqNarrow.matches) return 5;
    if (mqMobile.matches) return 7;
    return 9;
  }
  let activeBudget = shapeBudget();

  function buildShapes() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const all = isDark ? jaggedDefs : smoothDefs;
    activeBudget = shapeBudget();
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
       the 1392px-wide field box at 1440, but the box is 338px wide at 375 -
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
       range is drama on a desktop and noise in a 338px box. So the largest
       shape loses the most and the smallest barely moves, which pulls the
       set toward its middle instead of toward zero.
       At 375 that lands the set at 86 / 76 / 43 / 34 / 27 against a
       uniform scale's 86 / 62 / 27 / 21 / 16. Desktop is untouched: both
       ends are 1 at and above 1392. */
    const fieldW = heroShapesContainer.getBoundingClientRect().width || 1392;
    const narrow = 1 - Math.max(0, Math.min(1, (fieldW - 420) / (1392 - 420)));
    const scaleFor = (size) => {
      const tt = (maxSize - size) / sizeSpan;            // 1 smallest, 0 largest
      const big = 1 - 0.55 * narrow;                     // largest  -> .45 at 375
      const small = 1 - 0.25 * narrow;                   // smallest -> .75 at 375
      return big + (small - big) * tt;
    };

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
         SPREAD - shapes overtaking each other is what stops twelve objects
         reading as one slow field - but attached that spread to nothing,
         so a 110px form could end up the fastest, widest-travelling thing
         on screen while a 34px speck sat nearly still. That is the exact
         inverse of how distance reads.
         Tying it to size instead keeps the full range and makes it mean
         something: big forms barely move and act as structure, small ones
         travel far and read as the live layer in front. Same idea as
         parallax, done with amplitude rather than depth. */
      const t = (maxSize - def.size) / sizeSpan;
      return {
        el,
        size: renderSize,
        baseColor: def.color,
        baseX: def.at[0],
        baseY: def.at[1],
        // 40-150 across the set, and the big ones are at the bottom of it
        ampX: 40 + 110 * t,
        ampY: 32 + 86 * t,
        speed: 0.14 + 0.30 * t,
        /* the golden angle, which is the most irrational turn there is:
           stepping phase by it spreads twelve shapes as evenly round the
           cycle as twelve shapes can be spread, so no two are ever swinging
           together. Random phases bunch - that is what random does - and a
           bunched pair looks like the two shapes are linked. */
        phase: i * 2.39996,
        // and a second, faster wobble so the path is not a clean ellipse
        wobbleAmp: 6 + 10 * t,
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
     375px screen still showing twelve shapes because the page was opened
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
    if (shapeBudget() !== activeBudget) buildShapes();
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
      // availability dot, twelve shapes that each briefly become a thirteenth colour
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
const chaosCountdownEl = document.getElementById('chaosCountdown');
const CHAOS_DURATION = 30; // seconds

function endChaosMode() {
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
if (!prefersReducedMotion) document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  });
  card.addEventListener('mouseleave', () => {
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
  renderTickers();
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

function setInert(el, on) {
  if (!el) return;
  if (on) el.setAttribute('inert', '');
  else el.removeAttribute('inert');
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
  const target = (initialFocus && focusablesIn(overlay).includes(initialFocus))
    ? initialFocus
    : focusablesIn(overlay)[0];
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
(function marqueeHoverPause() {
  var strip = document.querySelector('.marquee');
  if (!strip) return;
  var DWELL_MS = 450;
  var timer = null;
  strip.addEventListener('pointerenter', function (e) {
    // touch has no hover state; a tap would latch the pause on with no way off
    if (e.pointerType === 'touch') return;
    timer = setTimeout(function () { strip.classList.add('is-paused'); }, DWELL_MS);
  });
  strip.addEventListener('pointerleave', function () {
    clearTimeout(timer);
    strip.classList.remove('is-paused');
  });
})();

/* ==========================================================================
   SECTION 19 · BOOT THE ROUTE — and this has to be the LAST thing in the file.

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
