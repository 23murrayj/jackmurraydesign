// respected throughout: users who've asked their OS for less motion get
// a site that still works, just without the perpetual decorative motion
// (floating shapes, magnetic letters, lagged cursor, cycling tagline) —
// CSS handles keyframe/transition-based effects (see styles.css), this
// flag gates the continuous JS rAF loops that CSS alone can't reach
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// loading screen
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let loadProgress = 0;
const loadInterval = setInterval(() => {
  loadProgress += Math.random() * 18;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadInterval);
  }
  loaderFill.style.width = loadProgress + '%';
}, 120);

window.addEventListener('load', () => {
  setTimeout(() => {
    loaderFill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.remove('is-loading');
      setTimeout(() => loader.remove(), 800);
    }, 250);
  }, 400);
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
// TYPE/ROLE are kept honest (school/personal/church/concept work) —
// no fake client names or invented agency-style services.
const projectData = {
  'cat-coaching': {
    bg: '#f2a71b',
    thumb: { src: 'assets/projects/cat-coaching/thumb.jpg', w: 1400, h: 1050, altIndex: 1 },
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
    hero: { src: 'assets/projects/cat-coaching/hero.jpg', w: 1900, h: 1069,
            full: 'assets/projects/cat-coaching/hero-full.jpg' },
    // One supporting photo, not two. The whiteboard shot came out and the
    // team shot takes the full width under the hero - see the :only-child
    // rule in styles.css. Alt strings are resolved BY POSITION and the hero
    // is index 0, so detail images start at alt.2, not alt.1: dropping the
    // whiteboard here meant deleting the old alt.2 and moving the team
    // string from alt.3 to alt.2 in all four languages. The hero's alt.1 is
    // untouched.
    detailImages: [
      { src: 'assets/projects/cat-coaching/03-team.jpg', w: 700, h: 700,
        full: 'assets/projects/cat-coaching/03-team-full.jpg' }
    ]
  },

  'easter-riverside': {
    bg: '#8fc0e0',
    // native 4:3 cut from the 1920x1080 master. The old thumb was 1000x562,
    // so the 4:3 card frame cover-cropped a 16:9 image AND had well under
    // 2x the 717px it renders at — it read soft on a retina screen.
    thumb: { src: 'assets/projects/easter-riverside/thumb.jpg', w: 1400, h: 1050 },
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
    hero: { src: 'assets/projects/easter-riverside/01-hero.jpg', w: 1600, h: 900,
            full: 'assets/projects/easter-riverside/01-hero-full.jpg' },
    detailImages: [
      { src: 'assets/projects/easter-riverside/03-banner.jpg', w: 1200, h: 900,
        full: 'assets/projects/easter-riverside/03-banner-full.jpg' , exif: '26mm · f/1.5 · 1/6400 s · ISO 50' },
      { src: 'assets/projects/easter-riverside/02-photo-wall.jpg', w: 800, h: 1200,
        full: 'assets/projects/easter-riverside/02-photo-wall-full.jpg' , exif: '50mm · f/2.8 · 1/2500 s · ISO 2500' },
      { src: 'assets/projects/easter-riverside/04-invite-cards.jpg', w: 900, h: 1200,
        full: 'assets/projects/easter-riverside/04-invite-cards-full.jpg' , exif: '26mm · f/1.5 · 1/60 s · ISO 400' }
    ]
  },
  'fuse-partners-in-crime': {
    bg: '#1aa64b',
    video: {
      src: 'assets/projects/fuse-partners-in-crime/partners-in-crime.mp4',
      type: 'video/mp4',
      poster: 'assets/projects/fuse-partners-in-crime/video-poster.jpg',
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
    thumb: { src: 'assets/projects/fuse-partners-in-crime/cover-banner.jpg', w: 1167, h: 875, altIndex: 1 },
    category: 'UX/UI',
    alsoIn: ['MOTION'],
    title: 'PARTNERS IN CRIME',
    desc: "Asymmetric VR and PC co-op heist, shown at the Peoria Riverfront Museum.",
    type: 'Bradley FUSE - VR Game',
    year: '2025',
    role: 'VR Interface & VFX',
    layout: 'video',
    detailImages: [
      { src: 'assets/projects/fuse-partners-in-crime/02-museum-play.jpg', w: 757, h: 760 },
      { src: 'assets/projects/fuse-partners-in-crime/03-museum-room.jpg', w: 1013, h: 760 },
      // the exhibition standup: title lockup, the full 17-person crew by
      // department, and the in-game scanner art. Unreadable at strip width by
      // definition, so it carries a zoom source.
      { src: 'assets/projects/fuse-partners-in-crime/04-standup-banner.jpg', w: 210, h: 700,
        full: 'assets/projects/fuse-partners-in-crime/04-standup-banner-full.jpg' }
    ]
  },

  sandcastles: {
    // bg is sampled from the artwork's own paper texture (#4ea7ae), not picked
    bg: '#4ea7ae',
    // 4:3 crop of the 16:9 artwork rather than a cover-crop of it — the script
    // wordmark runs nearly edge to edge, so letting the card frame crop the
    // 16:9 version would cut the ends off the word the project is named after.
    thumb: { src: 'assets/projects/sandcastles/thumb.jpg', w: 1400, h: 1050 },
    category: 'GRAPHICS',
    title: 'SANDCASTLES',
    desc: "Sermon series identity applied across stage screens, social, and print.",
    type: 'Sermon Series Identity',
    // the church's livestream of the opening service is dated 06.29.25
    year: '2025',
    role: 'Graphic Designer',
    // same shape as easter-riverside: the design, then the design in use
    layout: 'mixed',
    hero: { src: 'assets/projects/sandcastles/01-hero.jpg', w: 1900, h: 1069,
            full: 'assets/projects/sandcastles/01-hero-full.jpg' },
    // Two applications, both of them the finished thing in use. 02-photoshop.jpg
    // and 04-instagram.jpg are still on disk but unused: the Photoshop shot was
    // a photo of a screen rather than a screenshot, and it showed one near-final
    // state while the copy claims iteration, so it was promising something it
    // didn't deliver.
    detailImages: [
      { src: 'assets/projects/sandcastles/05-reading-plan.jpg', w: 1100, h: 1100,
        full: 'assets/projects/sandcastles/05-reading-plan-full.jpg' },
      { src: 'assets/projects/sandcastles/03-stage.jpg', w: 1200, h: 671,
        full: 'assets/projects/sandcastles/03-stage-full.jpg' }
    ]
  },
  'monmouth-retreat': {
    bg: '#111',
    // Card image is photo 9, the guitarist in the doorway — cropped to 4:3
    // from the 4480x6720 original rather than squeezed from the portrait
    // export, so the card frame fits it exactly and nothing is cover-cropped.
    // altIndex points the alt text at that photo; without it the thumbnail
    // inherits alt.1, which describes a different photograph entirely.
    thumb: { src: 'assets/projects/monmouth-retreat/thumb.jpg', w: 1400, h: 1050, altIndex: 9 },
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
      { src: 'assets/projects/monmouth-retreat/01.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/01-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 2500' },
      { src: 'assets/projects/monmouth-retreat/02.jpg', w: 800, h: 1200, full: 'assets/projects/monmouth-retreat/02-full.jpg',
        exif: '85mm · f/13 · 1/160 s · ISO 160' },
      { src: 'assets/projects/monmouth-retreat/03.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/03-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 400' },
      { src: 'assets/projects/monmouth-retreat/04.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/04-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: 'assets/projects/monmouth-retreat/05.jpg', w: 800, h: 1200, full: 'assets/projects/monmouth-retreat/05-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: 'assets/projects/monmouth-retreat/06.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/06-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 500' },
      { src: 'assets/projects/monmouth-retreat/07.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/07-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 1000' },
      { src: 'assets/projects/monmouth-retreat/08.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/08-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 2500' },
      { src: 'assets/projects/monmouth-retreat/09.jpg', w: 800, h: 1200, full: 'assets/projects/monmouth-retreat/09-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 800' },
      { src: 'assets/projects/monmouth-retreat/10.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/10-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: 'assets/projects/monmouth-retreat/11.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/11-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 640' },
      { src: 'assets/projects/monmouth-retreat/12.jpg', w: 843, h: 1200, full: 'assets/projects/monmouth-retreat/12-full.jpg',
        exif: '50mm · f/2.2 · 1/400 s · ISO 2500' },
      { src: 'assets/projects/monmouth-retreat/13.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/13-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: 'assets/projects/monmouth-retreat/14.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/14-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: 'assets/projects/monmouth-retreat/15.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/15-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 500' },
      { src: 'assets/projects/monmouth-retreat/16.jpg', w: 800, h: 1200, full: 'assets/projects/monmouth-retreat/16-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 400' },
      { src: 'assets/projects/monmouth-retreat/17.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/17-full.jpg',
        exif: '85mm · f/2 · 1/160 s · ISO 640' },
      { src: 'assets/projects/monmouth-retreat/18.jpg', w: 1200, h: 800, full: 'assets/projects/monmouth-retreat/18-full.jpg',
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
         layout: 'mixed',                     // 'single' | 'mixed'
         hero: { src: '...', w: 1900, h: 1069, full: '...' },
         detailImages: [ { src: '...', w: 1200, h: 671, full: '...' } ]
       }

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
      src: 'assets/projects/oasis-journey/journey-to-the-oasis.mp4',
      type: 'video/mp4',
      poster: 'assets/projects/oasis-journey/video-poster.jpg'
    },
    detailImages: [
      { src: 'assets/projects/oasis-journey/poster-art.jpg', w: 776, h: 1200,
        full: 'assets/projects/oasis-journey/poster-art-full.jpg' }
    ],
    // 4:3 crop of the poster artwork, taken below the title lockup so the card
    // shows the render rather than a squeezed portrait poster. Cut from the
    // 1375x2125 original PNG — a 1375x1031 window at y=640, resampled to 1400
    // wide. That offset is bounded on both sides: the title's descenders and
    // drop shadow reach down to ~y=620, so anything higher clips "OASIS" into
    // the card, while lower leads with the dark ship hulls instead of the
    // city. altIndex 1 resolves to alt.1, which is its own string
    // rather than the poster's — this crop excludes the ships alt.2 describes.
    thumb: { src: 'assets/projects/oasis-journey/thumb.jpg', w: 1400, h: 1049, altIndex: 1 },
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
     'assets/projects/x/01.jpg'                       a path
     { src: '...', alt: '...', w: 1600, h: 1200 }     a path plus metadata
     '<svg ...>'                                       legacy inline artwork
   ========================================================================== */

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
  return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${dims}${track}${full}${exif}` +
         ` loading="lazy" decoding="async">`;
}

/* ==========================================================================
   GALLERY CARDS
   Generated from projectData rather than hand-written in index.html, so a
   project exists in exactly one place. The data-i18n attributes are applied
   by i18n.js on DOMContentLoaded, which runs after this file.
   ========================================================================== */

function renderGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  gallery.innerHTML = Object.entries(projectData).map(([id, p]) => {
    // `thumb` is the card image; falls back to whatever hero art the entry
    // already has so existing placeholder projects still render
    const thumb = p.thumb || p.svg || p.heroSvg ||
                  (p.images && p.images[0]) || (p.photos && p.photos[0]) || '';
    return `
    <article class="card reveal" data-tilt data-project="${escapeAttr(id)}"` +
      ` data-category="${escapeAttr([p.category].concat(p.alsoIn || []).join(' '))}"` +
      ` style="--bg:${escapeAttr(p.bg || '#111')};"` +
      ` role="button" tabindex="0" aria-label="${escapeAttr(p.title)}">
      <div class="card-media">${mediaTag(thumb, id,
        (thumb && thumb.altIndex ? thumb.altIndex - 1 : 0), p.title)}</div>
      <div class="card-info">
        <h3>${escapeAttr(p.title)}</h3>
        <p data-i18n="proj.${escapeAttr(id)}.desc">${escapeAttr(p.desc)}</p>
        <div class="card-tags">${[p.category].concat(p.alsoIn || []).map((c) =>
          `<span class="tag" data-i18n="cat.${escapeAttr(c)}">${escapeAttr(c)}</span>`).join('')}</div>
      </div>
    </article>`;
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
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryCards().forEach((card) => {
      // a space-separated list now, so one project can sit under more than
      // one filter — the VR game is interface work and motion work both
      const match = filter === 'ALL' ||
        card.dataset.category.split(' ').includes(filter);
      card.classList.toggle('hidden-card', !match);
    });
  });
});


// project detail overlay open/close
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

document.querySelectorAll('.gallery .card').forEach((card) => {
  card.addEventListener('click', () => openProject(card.dataset.project));
});
projectBack.addEventListener('click', closeProject);

// full about page overlay — opened from the nav link, the about section
// title, or the explicit "read more" button
const aboutOverlay = document.getElementById('aboutOverlay');
const aboutBack = document.getElementById('aboutBack');
function openAboutPage(e) {
  e?.preventDefault();
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
document.getElementById('navAboutLink')?.addEventListener('click', openAboutPage);
document.getElementById('aboutTitle')?.addEventListener('click', openAboutPage);
document.getElementById('aboutTitle')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') openAboutPage(e);
});
document.getElementById('aboutReadMore')?.addEventListener('click', openAboutPage);
// the portrait is a second door to the same page, not decoration
document.querySelectorAll('.about-panel .about-portrait')
  .forEach((el) => el.addEventListener('click', openAboutPage));
aboutBack?.addEventListener('click', closeAboutPage);

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
  if (aboutOverlay.classList.contains('open')) closeAboutPage();
  openProject(id);
});

// Escape closes whichever overlay is currently open, restoring the
// exact scroll position the user was at before it opened
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  // innermost first, or Escape would close the project overlay out from
  // under an open lightbox
  if (lightbox && lightbox.classList.contains('open')) closeLightbox();
  else if (projectOverlay.classList.contains('open')) closeProject();
  else if (aboutOverlay.classList.contains('open')) closeAboutPage();
});

// live clock — small brutalist data readout in the footer
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
  const CURSOR_TARGETS = '.card, .btn-block, a, .skills span, .filter-btn, .project-back, .theme-toggle, .form-submit, #aboutTitle, .about-back, .about-readmore-btn, .about-portrait, .play-btn, .video-play, #projectMedia img[data-full], .sticker, .placed-sticker, .cv-download-btn, .copy-email-btn, .egg-menu button, #chaosPlayBtn, #pongClose, .cvd-toggle, .cvd-option, #chaosStopBtn, .lang-toggle, .lang-option, .lightbox-close';
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
document.querySelectorAll('.stat-num[data-count]').forEach((el) => counterObserver.observe(el));

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

// typewriter cycling taglines
const heroTagEl = document.getElementById('heroTag');
if (heroTagEl) {
  // the rotation lives in i18n.js now so it can be translated. Each line
  // still has to earn its slot: the offer, the range, the point of view.
  // (A fourth English line was cut earlier — it was line 1 reshuffled, so
  // the typewriter visibly retyped the same sentence and read as a bug.)
  let TAGLINES = T.list('hero.taglines');
  let tlIndex = 0;
  let charIndex = 0;
  let deleting = false;

  // reserve enough height for the tallest tagline at the current column
  // width so cycling through shorter/longer strings never reflows the
  // badge/button below it — the fixed CSS min-height guess didn't match
  // how narrow the actual hero-side column renders at most viewports
  function lockHeroTagHeight() {
    const prevText = heroTagEl.textContent;
    heroTagEl.style.minHeight = '';
    let tallest = 0;
    TAGLINES.forEach(t => {
      heroTagEl.textContent = t;
      tallest = Math.max(tallest, heroTagEl.getBoundingClientRect().height);
    });
    heroTagEl.textContent = prevText;
    heroTagEl.style.minHeight = tallest + 'px';
  }
  // column width shifts during load (webfont swap, grid settling) in ways
  // a one-off timed measurement can't reliably catch, so re-lock whenever
  // the box's actual width changes rather than guessing when it's "ready"
  if (window.ResizeObserver) {
    let lastWidth = null;
    const ro = new ResizeObserver(entries => {
      const w = Math.round(entries[0].contentRect.width);
      if (w !== lastWidth) {
        lastWidth = w;
        lockHeroTagHeight();
      }
    });
    ro.observe(heroTagEl);
  } else {
    lockHeroTagHeight();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(lockHeroTagHeight, 150);
    });
  }

  function typeLoop() {
    const current = TAGLINES[tlIndex];
    if (!deleting) {
      charIndex++;
      heroTagEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
      setTimeout(typeLoop, 32 + Math.random() * 35);
    } else {
      charIndex--;
      heroTagEl.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        tlIndex = (tlIndex + 1) % TAGLINES.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 16);
    }
  }
  if (prefersReducedMotion) {
    // show the first tagline as plain static text instead of an
    // endlessly cycling type/delete animation
    heroTagEl.textContent = TAGLINES[0];
  } else {
    heroTagEl.textContent = '';
    setTimeout(typeLoop, 1000);
  }

  // Swap the source array and rewind the cursor. Deliberately does NOT
  // start a second typeLoop chain — the existing one reads TAGLINES and
  // tlIndex fresh on every tick, so it picks up the new language on its
  // own; kicking off another would double the typing speed permanently.
  T.onChange(() => {
    TAGLINES = T.list('hero.taglines');
    tlIndex = 0;
    charIndex = 0;
    deleting = false;
    if (prefersReducedMotion) heroTagEl.textContent = TAGLINES[0];
    lockHeroTagHeight();
  });
}

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
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMobileNav() {
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
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  localStorage.setItem('jm-theme', theme);
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}
const savedTheme = localStorage.getItem('jm-theme')
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// color vision mode — applies a CSS filter to the whole page (<html>)
// and persists the choice
const cvdToggle = document.getElementById('cvdToggle');
const cvdMenu = document.getElementById('cvdMenu');
const cvdOptions = document.querySelectorAll('.cvd-option');
function applyCvdMode(mode) {
  document.documentElement.classList.remove('cvd-deuteranopia', 'cvd-protanopia', 'cvd-highcontrast');
  if (mode !== 'normal') document.documentElement.classList.add(`cvd-${mode}`);
  cvdOptions.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === mode));
  cvdToggle?.classList.toggle('active-mode', mode !== 'normal');
  localStorage.setItem('jm-cvd', mode);
}
cvdToggle?.addEventListener('click', () => cvdMenu.classList.toggle('open'));
cvdOptions.forEach((btn) => {
  btn.addEventListener('click', () => {
    applyCvdMode(btn.dataset.mode);
    cvdMenu.classList.remove('open');
  });
});
document.addEventListener('click', (e) => {
  if (cvdMenu && !e.target.closest('.cvd-control')) cvdMenu.classList.remove('open');
});
applyCvdMode(localStorage.getItem('jm-cvd') || 'normal');

// seamless marquee: keep duplicating the group until it's wide enough
// to fill at least double the viewport, so the -50% loop never shows a gap
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
  setupSeamlessMarquee('marqueeTrack', 'marquee-group', 80),
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

// floating geometric shapes — drift + rotate slowly, ease away from the
// cursor, and flash a highlight color while being pushed.
// Light mode: smooth circles/squares/triangles. Dark mode: sharp jagged
// stars/spikes, rebuilt whenever the theme flips.
// chaos mode (defined further below) cranks this up temporarily so the
// shapes spin and lunge harder without the animation loop needing to
// know anything about chaos mode itself
window.chaosBoost = 1;

const heroShapesContainer = document.getElementById('heroShapes');
if (heroShapesContainer) {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const FLASH_COLOR = 'var(--green)';
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
    svg.style.color = def.color;
    const poly = document.createElementNS(SVG_NS, 'polygon');
    poly.setAttribute('points', points);
    poly.style.fill = def.filled ? 'currentColor' : 'none';
    poly.style.stroke = 'currentColor';
    poly.style.strokeWidth = def.type === 'star' ? '3' : '5';
    svg.appendChild(poly);
    return svg;
  }

  function createShapeEl(def) {
    if (def.type === 'triangle') {
      return createSvgShape(def, '50,6 94,94 6,94');
    }
    if (def.type === 'star') {
      const spikes = def.spikes || 6;
      return createSvgShape(def, starPoints(spikes, 48, def.sharp ? 14 : 22, 50, 50));
    }
    const el = document.createElement('div');
    el.className = `shape shape-${def.type} ${def.filled ? 'filled' : 'outline'}`;
    el.style.width = def.size + 'px';
    el.style.height = def.size + 'px';
    el.style.color = def.color;
    return el;
  }

  const smoothDefs = [
    { type: 'circle', size: 90, color: 'var(--accent)', filled: false },
    { type: 'square', size: 70, color: 'var(--blue)', filled: true },
    { type: 'triangle', size: 60, color: 'var(--yellow)', filled: false },
    { type: 'circle', size: 50, color: 'var(--black)', filled: true },
    { type: 'square', size: 110, color: 'var(--accent)', filled: false },
    { type: 'triangle', size: 80, color: 'var(--blue)', filled: true },
    { type: 'circle', size: 65, color: 'var(--yellow)', filled: false },
    { type: 'square', size: 45, color: 'var(--black)', filled: false },
    { type: 'circle', size: 36, color: 'var(--accent)', filled: true },
    { type: 'triangle', size: 50, color: 'var(--black)', filled: false },
    { type: 'square', size: 30, color: 'var(--yellow)', filled: true },
    { type: 'circle', size: 110, color: 'var(--blue)', filled: false },
  ];

  const jaggedDefs = [
    { type: 'star', size: 95, color: 'var(--accent)', filled: false, spikes: 7, sharp: true },
    { type: 'star', size: 65, color: 'var(--blue)', filled: true, spikes: 5, sharp: true },
    { type: 'star', size: 55, color: 'var(--yellow)', filled: false, spikes: 8, sharp: true },
    { type: 'star', size: 50, color: 'var(--green)', filled: true, spikes: 6, sharp: true },
    { type: 'star', size: 110, color: 'var(--accent)', filled: false, spikes: 6, sharp: true },
    { type: 'star', size: 80, color: 'var(--blue)', filled: false, spikes: 9, sharp: true },
    { type: 'star', size: 60, color: 'var(--yellow)', filled: true, spikes: 5, sharp: true },
    { type: 'star', size: 40, color: 'var(--black)', filled: false, spikes: 7, sharp: true },
    { type: 'star', size: 34, color: 'var(--accent)', filled: true, spikes: 5, sharp: true },
    { type: 'star', size: 48, color: 'var(--black)', filled: false, spikes: 8, sharp: true },
    { type: 'star', size: 28, color: 'var(--yellow)', filled: true, spikes: 5, sharp: true },
    { type: 'star', size: 115, color: 'var(--blue)', filled: false, spikes: 6, sharp: true },
  ];

  function buildShapes() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const defs = isDark ? jaggedDefs : smoothDefs;
    heroShapesContainer.innerHTML = '';
    shapes = defs.map((def) => {
      const el = createShapeEl(def);
      el.style.opacity = '0.5';
      heroShapesContainer.appendChild(el);
      return {
        el,
        size: def.size,
        baseColor: def.color,
        baseX: Math.random(),
        baseY: Math.random(),
        ampX: 40 + Math.random() * 60,
        ampY: 30 + Math.random() * 50,
        speed: 0.15 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * (isDark ? 30 : 18), // jagged ones spin faster/harder
        rotation: Math.random() * 360,
        offsetX: 0,
        offsetY: 0,
        flashed: false,
      };
    });
  }
  buildShapes();
  document.addEventListener('themechange', buildShapes);

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
      const driftX = s.baseX * rect.width + Math.sin(time * s.speed + s.phase) * s.ampX;
      const driftY = s.baseY * rect.height + Math.cos(time * s.speed * 0.8 + s.phase) * s.ampY;

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

      // flash a highlight color while actively being pushed, ease back after
      if (isNear && !s.flashed) {
        s.flashed = true;
        s.el.style.color = FLASH_COLOR;
      } else if (!isNear && s.flashed) {
        s.flashed = false;
        s.el.style.color = s.baseColor;
      }

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
if (magneticTextEl && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
  let magMouseX = -9999;
  let magMouseY = -9999;
  window.addEventListener('mousemove', (e) => {
    magMouseX = e.clientX;
    magMouseY = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    magMouseX = -9999;
    magMouseY = -9999;
  });

  // bigger radius + much stronger push so letters fly further, and a
  // lower damping ratio so the snap-back overshoots more visibly
  const MAG_RADIUS = 220;
  const MAG_FORCE = 220;
  const STIFFNESS = 230;
  const DAMPING = 11;
  let magLastT = 0;

  function animateMagnetic(t) {
    const dt = magLastT ? Math.min((t - magLastT) / 1000, 0.05) : 0;
    magLastT = t;

    magneticLetterStates.forEach((s) => {
      const rect = s.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - magMouseX;
      const dy = cy - magMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = 0, targetY = 0;
      if (dist < MAG_RADIUS && dist > 0.01) {
        const force = (1 - dist / MAG_RADIUS) * MAG_FORCE;
        targetX = (dx / dist) * force;
        targetY = (dy / dist) * force;
      }

      // spring-damper physics: underdamped for a dramatic bounce on
      // both the explosion outward and the snap back into place
      const ax = (targetX - s.dx) * STIFFNESS - s.vx * DAMPING;
      const ay = (targetY - s.dy) * STIFFNESS - s.vy * DAMPING;
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
    });
    requestAnimationFrame(animateMagnetic);
  }
  requestAnimationFrame(animateMagnetic);
}

// contact form — TODO: there's no real Formspree ID yet (see the HTML
// comment above the <form>), so this opens a pre-filled mailto: to
// 23jmurr@gmail.com instead of posting anywhere. Swap in a real
// Formspree fetch() call (or other backend) once one exists. The
// honeypot check still applies — it costs nothing to keep.
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

  // Netlify provisions the endpoint at the site root from the form's own
  // markup, so posting the encoded fields back to "/" is the whole integration.
  // Done with fetch rather than a normal submit so the inline status line and
  // the chosen language survive instead of the visitor being thrown to a
  // generic success page. Anywhere that endpoint doesn't exist (localhost, or
  // a host without Netlify Forms) the catch falls back to the old mailto.
  const body = new URLSearchParams(new FormData(contactForm)).toString();
  formStatus.textContent = T.t('form.status.sending');
  formSubmit.disabled = true;

  fetch('/', {
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

// keyboard navigation: gallery cards are clickable but not natively
// focusable — make them tabbable and Enter/Space-activatable
document.querySelectorAll('.gallery .card').forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProject(card.dataset.project);
    }
  });
});

// hidden easter egg menu — pick stickers or chaos mode
const eggTrigger = document.getElementById('eggTrigger');
const eggMenu = document.getElementById('eggMenu');
const stickerTray = document.getElementById('stickerTray');
const stickerTrayClose = document.getElementById('stickerTrayClose');
const stickerTrash = document.getElementById('stickerTrash');

eggTrigger?.addEventListener('click', () => eggMenu.classList.toggle('open'));
// the third dropdown in the same cluster; without this it stayed open until
// you picked one of its options, while the other two closed on an outside click
document.addEventListener('click', (e) => {
  if (eggMenu && !eggMenu.contains(e.target) && !eggTrigger.contains(e.target)) {
    eggMenu.classList.remove('open');
  }
});
document.getElementById('eggMenuStickers')?.addEventListener('click', () => {
  eggMenu.classList.remove('open');
  stickerTray.classList.add('open');
  setInert(stickerTray, false);
});
document.getElementById('eggMenuChaos')?.addEventListener('click', () => {
  eggMenu.classList.remove('open');
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

// CHAOS MODE — 30 seconds of "corrupted TV signal" hitting every part
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
    pctx.fillStyle = '#00e1ff';
    pctx.fillRect(14, p1Y, PADDLE_W, PLAYER_PADDLE_H);
    pctx.fillStyle = '#ff2d55';
    pctx.fillRect(W - 14 - PADDLE_W, p2Y, PADDLE_W, PADDLE_H);
    pctx.fillStyle = '#f9ff2e';
    pctx.fillRect(ballX - 5, ballY - 5, 10, 10);
    pctx.fillStyle = '#fff';
    pctx.font = '22px "Courier New", monospace';
    pctx.fillText(String(score1), W / 2 - 40, 30);
    pctx.fillText(String(score2), W / 2 + 26, 30);
  }

  function pongLoop() {
    if (!pongRunning) return;
    // player paddle moves a bit faster than before (was 5) so quick
    // returns feel responsive instead of always trailing the ball
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
    pongWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function closePong() {
    pongWindow.classList.remove('open');
    pongRunning = false;
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
