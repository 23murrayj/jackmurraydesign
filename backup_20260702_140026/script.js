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

// portfolio filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery .card');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryCards.forEach((card) => {
      const match = filter === 'ALL' || card.dataset.category === filter;
      card.classList.toggle('hidden-card', !match);
    });
  });
});

// project detail data — each project picks a "layout" so the case
// studies don't all look the same: single hero shot, scrollable photo
// gallery, video placeholder, or a hero + smaller detail shots mix.
// TYPE/ROLE are kept honest (school/personal/church/concept work) —
// no fake client names or invented agency-style services.
const projectData = {
  'easter-riverside': {
    category: 'GRAPHICS',
    title: 'EASTER AT RIVERSIDE',
    desc: "Promotional graphic and visual direction for a church Easter event.",
    type: 'Church / Event Graphic',
    year: '2024',
    role: 'Graphic Designer',
    layout: 'single',
    svg: `<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="450" fill="#ff3b30"/>
      <circle cx="300" cy="180" r="120" fill="#fffb00"/>
      <polygon points="265,90 335,90 335,180 375,180 300,260 225,180 265,180" fill="#111"/>
      <text x="40" y="410" font-family="Archivo Black" font-size="44" fill="#fff">EASTER AT RIVERSIDE</text>
    </svg>`
  },
  'monmouth-retreat': {
    category: 'PHOTOGRAPHY',
    title: 'MONMOUTH RETREAT',
    desc: "Photography collection capturing atmosphere, people, and place.",
    type: 'Photography Collection',
    year: '2024',
    role: 'Photographer',
    layout: 'masonry',
    masonryCount: 12,
  },
  sandcastles: {
    category: 'GRAPHICS',
    title: 'SANDCASTLES',
    desc: "Sermon graphic exploring faith, structure, and visual storytelling.",
    type: 'Church / Event Graphic',
    year: '2023',
    role: 'Graphic Designer',
    layout: 'single',
    svg: `<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="450" fill="#fffb00"/>
      <polygon points="60,400 180,260 300,400" fill="#111"/>
      <polygon points="220,400 340,220 460,400" fill="#ff3b30"/>
      <text x="40" y="80" font-family="Archivo Black" font-size="48" fill="#111">SANDCASTLES</text>
    </svg>`
  },
  'oasis-journey': {
    category: 'MOTION',
    title: 'JOURNEY TO THE OASIS',
    desc: "3D animated short created as an early motion and storytelling project.",
    type: 'School Project',
    year: '2023',
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
  'portfolio-website': {
    category: 'WEB',
    title: 'PORTFOLIO WEBSITE',
    desc: "Personal website built to explore UX, front-end design, and visual identity.",
    type: 'Personal Project',
    year: '2026',
    role: 'Designer & Developer',
    layout: 'single',
    svg: `<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="450" fill="#111"/>
      <rect x="40" y="40" width="520" height="60" fill="#fff"/>
      <rect x="40" y="130" width="240" height="280" fill="#ff3b30"/>
      <rect x="300" y="130" width="260" height="130" fill="#fffb00"/>
      <rect x="300" y="280" width="260" height="130" fill="#0a5cff"/>
      <text x="60" y="80" font-family="Archivo Black" font-size="26" fill="#111">JACKMURRAY.DESIGN</text>
    </svg>`
  },
  'brand-concept': {
    category: 'BRANDING',
    title: 'BRAND / CONCEPT STUDY',
    desc: "Conceptual identity work exploring brand systems, typography, and visual direction.",
    type: 'Concept Project',
    year: '2025',
    role: 'Brand Designer',
    layout: 'single',
    svg: `<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="450" fill="#ff7a00"/>
      <rect x="60" y="60" width="160" height="160" fill="#111"/>
      <circle cx="430" cy="140" r="80" fill="#f5f5f0"/>
      <polygon points="120,260 240,400 0,400" fill="#0a5cff"/>
      <text x="260" y="400" font-family="Archivo Black" font-size="34" fill="#111">CONCEPT</text>
    </svg>`
  }
};

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

  if (data.layout === 'masonry') {
    const sizeCycle = ['large', 'small', 'medium', 'small', 'medium', 'large', 'small', 'small', 'medium', 'large', 'small', 'medium', 'small', 'large', 'small', 'medium', 'small', 'small', 'large', 'medium'];
    projectMedia.innerHTML = Array.from({ length: data.masonryCount }, (_, i) => {
      const size = sizeCycle[i % sizeCycle.length];
      return `<div class="masonry-item size-${size}">${generatePlaceholderSvg(i)}</div>`;
    }).join('');
    return;
  }

  if (data.layout === 'gallery') {
    projectMedia.innerHTML = data.images
      .map((svg) => `<div class="project-gallery-item">${svg}</div>`)
      .join('');
    return;
  }

  if (data.layout === 'video') {
    projectMedia.innerHTML = `
      ${data.videoSvg.replace('<svg ', '<svg class="video-bg" ')}
      <div class="project-video-overlay">
        <button class="play-btn" id="projectPlayBtn" aria-label="Play case study film">
          <svg viewBox="0 0 24 24"><polygon points="5,3 21,12 5,21"></polygon></svg>
        </button>
        <span class="video-caption">${data.videoCaption}</span>
      </div>`;
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
      <div class="project-mixed-hero">${data.heroSvg}</div>
      <div class="project-mixed-details">
        ${data.detailImages.map((svg) => `<div>${svg}</div>`).join('')}
      </div>`;
    return;
  }

  // single (default)
  projectMedia.innerHTML = data.svg;
}

// both full-screen overlays (project detail + the about page) share one
// "return to where you were" scroll position, since only one can
// realistically be open at a time
let savedScrollY = 0;

function openProject(id) {
  const data = projectData[id];
  if (!data) return;
  renderProjectMedia(data);
  projectCat.textContent = data.category;
  projectTitle.textContent = data.title;
  projectDesc.textContent = data.desc;
  projectType.textContent = data.type;
  projectYear.textContent = data.year;
  projectRole.textContent = data.role;
  savedScrollY = window.scrollY;
  projectOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo({ top: 0 });
}

function closeProject() {
  projectOverlay.classList.remove('open');
  document.body.style.overflow = '';
  window.scrollTo({ top: savedScrollY });
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
  savedScrollY = window.scrollY;
  aboutOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo({ top: 0 });
}
function closeAboutPage() {
  aboutOverlay.classList.remove('open');
  document.body.style.overflow = '';
  window.scrollTo({ top: savedScrollY });
}
document.getElementById('navAboutLink')?.addEventListener('click', openAboutPage);
document.getElementById('aboutTitle')?.addEventListener('click', openAboutPage);
document.getElementById('aboutTitle')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') openAboutPage(e);
});
document.getElementById('aboutReadMore')?.addEventListener('click', openAboutPage);
aboutBack?.addEventListener('click', closeAboutPage);

// Escape closes whichever overlay is currently open, restoring the
// exact scroll position the user was at before it opened
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (projectOverlay.classList.contains('open')) closeProject();
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
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.2;
    curY += (mouseY - curY) * 0.2;
    cursorDot.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('.card, .btn-block, a, .skills span, .filter-btn, .project-back, .theme-toggle, .form-submit, #aboutTitle, .about-back, .about-readmore-btn, .play-btn, .sticker, .placed-sticker, .cv-download-btn, .copy-email-btn, .egg-menu button, #chaosPlayBtn, #pongClose, .cvd-toggle, .cvd-option, #chaosStopBtn').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('big'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('big'));
  });
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
  const TAGLINES = [
    'UX designer building websites, visual systems, and digital experiences with personality.',
    'Websites, visual systems, branding, photography, motion, and digital experiments.',
    "Design that's intentional, not generic.",
    'UX, websites, and visual systems with personality.',
  ];
  let tlIndex = 0;
  let charIndex = 0;
  let deleting = false;

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
  heroTagEl.textContent = '';
  setTimeout(typeLoop, 1000);
}

const heroEl = document.querySelector('.hero');
const heroNameEl = document.querySelector('.hero-name');

// random hero heading glitch flicker
if (heroNameEl) {
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
}
function closeMobileNav() {
  navToggle.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
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
}
setupSeamlessMarquee('marqueeTrack', 'marquee-group', 80);
setupSeamlessMarquee('skillsTrack', 'skills-group', 36);

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
  requestAnimationFrame(animateShapes);
}

// magnetic typography — each letter explodes away from the cursor then
// snaps back with springy, slightly-overshooting physics
const magneticTextEl = document.getElementById('magneticText');
if (magneticTextEl && window.matchMedia('(pointer: fine)').matches) {
  const ROWS = ["LET'S MAKE", 'SOMETHING.'];
  const letterStates = [];

  ROWS.forEach((row) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'magnetic-row';
    row.split(' ').forEach((word) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'magnetic-word';
      word.split('').forEach((ch) => {
        const letterEl = document.createElement('span');
        letterEl.className = 'magnetic-letter';
        letterEl.textContent = ch;
        wordEl.appendChild(letterEl);
        letterStates.push({ el: letterEl, dx: 0, dy: 0, vx: 0, vy: 0 });
      });
      rowEl.appendChild(wordEl);
    });
    magneticTextEl.appendChild(rowEl);
  });

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

    letterStates.forEach((s) => {
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
    formStatus.textContent = "Thanks — I'll get back to you soon.";
    contactForm.reset();
    return;
  }

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name || !email || !message) return;

  const subject = encodeURIComponent(`New project inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:23jmurr@gmail.com?subject=${subject}&body=${body}`;

  formStatus.textContent = "Opening your email app — send it over and I'll get back to you.";
  contactForm.reset();
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
  copyEmailBtn.textContent = 'COPIED ✓';
  copyEmailBtn.classList.add('copied');
  setTimeout(() => {
    copyEmailBtn.textContent = 'COPY';
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
document.getElementById('eggMenuStickers')?.addEventListener('click', () => {
  eggMenu.classList.remove('open');
  stickerTray.classList.add('open');
});
document.getElementById('eggMenuChaos')?.addEventListener('click', () => {
  eggMenu.classList.remove('open');
  startChaosMode();
});
stickerTrayClose?.addEventListener('click', () => stickerTray.classList.remove('open'));

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
    '.nav-logo, .nav-links a, .hero-role, .contact-statement, .contact-email-text, .social-link-text, .contact-loc, .footer span, .footer a'
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
  const PADDLE_H = 60, PADDLE_W = 10;
  let p1Y = H / 2 - PADDLE_H / 2;
  let p2Y = H / 2 - PADDLE_H / 2;
  // halfway between the original speed (3/2) and the too-slow 2.1/1.4 —
  // challenging but actually winnable
  let ballX = W / 2, ballY = H / 2, ballVX = 2.55, ballVY = 1.7;
  let score1 = 0, score2 = 0;
  let pongRunning = false;
  const keys = {};
  window.addEventListener('keydown', (e) => { keys[e.key] = true; });
  window.addEventListener('keyup', (e) => { keys[e.key] = false; });

  function resetBall(dir) {
    ballX = W / 2; ballY = H / 2;
    ballVX = (dir || (Math.random() < 0.5 ? -1 : 1)) * 2.55;
    ballVY = (Math.random() < 0.5 ? -1 : 1) * 1.7;
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
    pctx.fillRect(14, p1Y, PADDLE_W, PADDLE_H);
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
    if (keys['ArrowUp'] || keys['w'] || keys['W']) p1Y -= 5;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) p1Y += 5;
    p1Y = Math.max(0, Math.min(H - PADDLE_H, p1Y));
    // simple AI, deliberately imperfect and ~30% slower than before so
    // it's actually beatable (was 0.07, now 0.049)
    p2Y += (ballY - PADDLE_H / 2 - p2Y) * 0.049;
    p2Y = Math.max(0, Math.min(H - PADDLE_H, p2Y));

    ballX += ballVX;
    ballY += ballVY;
    if (ballY <= 0 || ballY >= H - 8) ballVY *= -1;
    if (ballX <= 24 && ballY > p1Y - 8 && ballY < p1Y + PADDLE_H + 8) ballVX = Math.abs(ballVX) * 1.04;
    if (ballX >= W - 24 && ballY > p2Y - 8 && ballY < p2Y + PADDLE_H + 8) ballVX = -Math.abs(ballVX) * 1.04;
    if (ballX < 0) { score2++; resetBall(1); }
    if (ballX > W) { score1++; resetBall(-1); }

    drawPong();

    if (score1 >= 5 || score2 >= 5) {
      pongRunning = false;
      showPongEnd(score1 >= 5 ? 'YOU WIN' : 'CPU WINS');
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

// subtle tilt on portfolio cards
document.querySelectorAll('[data-tilt]').forEach((card) => {
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
