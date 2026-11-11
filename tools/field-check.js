// Checks the hero field against every rule that is invisible at full width.
// Run after ANY change to the def arrays.
const fs = require('fs');
const s_src = fs.readFileSync(process.argv[2] || 'script.js', 'utf8');
const s = s_src;
const W = 1440, H = 1026;                                  // measured field box at 1440
const NAV_BOTTOM = 0.092;
const FS_CENTRE  = { x: 0.6555, y: 0.42 };                 // the full stop after MURRAY
const MARQUEE    = { y0: 0.579, y1: 0.640 };
const band = y => y < 0.35 ? 'TOP' : y < 0.62 ? 'MID' : 'SEAM';

function defs(name) {
  const a = s.indexOf('const ' + name + ' = [');
  const b = s.indexOf('\n  ];', a);
  const body = s.slice(a, b);
  return [...body.matchAll(
    /type: '(\w+)',\s*size: (\d+),\s*color: 'var\(--([\w-]+)\)',\s*filled: (\w+),([^}]*?)keep: (\d+),\s*at: \[([\d.]+), ([\d.]+)\]([^}]*)/g
  )].map(m => {
    const tail = m[9] || '';
    const num = (k, dflt) => {
      const hit = new RegExp(k + ': ([0-9.]+)').exec(tail);
      return hit ? +hit[1] : dflt;
    };
    /* The per-shape path keys. The defaults are what the whole field used
       to share, so a def carrying none of them is checked exactly as it
       always was. */
    return { type: m[1], size: +m[2], hue: m[3], filled: m[4] === 'true',
             vivid: /vivid/.test(m[5]), keep: +m[6], x: +m[7], y: +m[8],
             aspect: num('aspect', 1), ratio: num('ratio', 0.8), reach: num('reach', 1),
             overNav: /overNav/.test(tail) };
  });
}

let failures = 0;

/* ------------------------------------------------------------------------
   TEXT OVER A FILLED SHAPE.
   The shapes are allowed to drift across the type - that is settled, and the
   build that fenced them out was tried and rejected. What protects the text
   is the z-order and the alpha, and the alpha is only safe if someone has
   actually done the arithmetic. Nobody had: a walk of the resting DOM, which
   is what the live audit does, cannot see what a MOVING element will be
   behind, so this class of pairing has never been covered by anything.
   It found a real one the day it was written - the filled lime star in dark
   measured 2.48:1 under .hero-role, where large text owes 3:1.
   Only FILLED shapes are checked. An outline at these weights covers 2-5px
   of a glyph and barely tints it; a fill composites the whole area.
   The bar is 3:1, not 4.5: everything a hero shape can reach is display
   type - the name at 12rem and the role line at 37.6px - and the small text
   in range (the badge, the filter chips, the nav controls) carries an opaque
   background for exactly this reason. ------------------------------------ */
const CSS = fs.readFileSync((process.argv[3] || 'styles.css'), 'utf8');
function tokens(block) {
  const a = CSS.indexOf(block);
  const body = CSS.slice(a, CSS.indexOf('}', a));
  const out = {};
  for (const m of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})/g)) out[m[1]] = m[2];
  return out;
}
function hex2rgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(x => x + x).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
function lum(c) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}
function contrast(a, b) {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
const mix = (fg, bg, a) => fg.map((v, i) => a * v + (1 - a) * bg[i]);
/* alphas from .hero-shapes .shape in styles.css, desktop values - the
   ≤760px overrides are lower in light and lower in dark, so desktop is the
   binding case in both. */
const ALPHA = { light: { base: 0.34, vivid: 0.66 }, dark: { base: 0.62, vivid: 0.78 } };
const TEXT_BAR = 3;

// The budgets come from shapeBudget() in script.js rather than being
// repeated here. The checker went stale once already by hardcoding a
// shape count, which is exactly the failure it exists to catch.
const BUDGETS_LIGHT = (() => {
  const a = s_src.indexOf('function shapeBudget(');
  const body = s_src.slice(a, s_src.indexOf('\n  }', a));
  const n = [...body.matchAll(/[?:]\s*(\d+)/g)].map(m => +m[1]);
  return [...new Set(n)].sort((x, y) => x - y);
})();
/* Dark runs two shapes lighter at every width - see shapeBudget(). Read,
   not repeated: this file has gone stale by hardcoding a count before. */
const DARK_FEWER = (() => {
  const m = /const DARK_FEWER = (\d+)/.exec(s_src);
  return m ? +m[1] : 0;
})();
const budgetsFor = name =>
  BUDGETS_LIGHT.map(b => b - (name === 'jaggedDefs' ? DARK_FEWER : 0)).filter(b => b > 0);

// No band may hold two shapes of the same hue. Whether that is even
// POSSIBLE at a given budget is arithmetic, not taste: with H shapes of one
// hue and 3 bands, pigeonhole forces a repeat once H > 3. So the rule is
// enforced at every budget where it is satisfiable and reported elsewhere.
/* A hue with two or more shapes must appear on BOTH sides of the field.
   Nothing checked this until 2026-11-11 and the arrangement in use had all
   three corals at x > .87 - Jack spotted it immediately: "make sure there's
   also red on the left side because it doesn't look like there's much red
   on the left side." Per-band hue mixing stops horizontal stripes; this
   stops vertical ones, which is the same failure rotated and just as easy
   to ship. .45/.55 rather than a hard half, so a shape sitting near the
   centre line counts for neither side and cannot rescue a lopsided hue. */
function hueSidesOk(kept) {
  const bad = [];
  const by = {};
  kept.forEach(d => (by[d.hue] = by[d.hue] || []).push(d.x));
  for (const [hue, xs] of Object.entries(by)) {
    if (xs.length < 2) continue;
    if (!xs.some(x => x < 0.45) || !xs.some(x => x > 0.55)) {
      bad.push(hue + '[' + xs.map(x => x.toFixed(2)).join(' ') + ']');
    }
  }
  return bad;
}

function hueRuleSatisfiable(kept) {
  const counts = {};
  kept.forEach(d => counts[d.hue] = (counts[d.hue] || 0) + 1);
  return Object.values(counts).every(c => c <= 3);
}
for (const name of ['smoothDefs', 'jaggedDefs']) {
  const all = defs(name);
  const theme = name === 'jaggedDefs' ? 'dark' : 'light';
  const T = tokens(theme === 'dark' ? ':root[data-theme="dark"]' : ':root {');
  const ground = T.white && hex2rgb(T.white);
  const ink = T.black && hex2rgb(T.black);
  console.error('\n=== ' + name + ' (' + all.length + ') ===');
  if (all.length < 4) { console.error('  PARSE FAILED (' + all.length + ' defs)'); failures++; continue; }

  const MAX = Math.max(...all.map(d => d.size));
  const SPAN = MAX - Math.min(...all.map(d => d.size)) || 1;

  // 1. ranks unique 1..12
  const ranks = all.map(d => d.keep).sort((a, b) => a - b).join(',');
  const expect = all.map((_, i) => i + 1).join(',');
  const ok1 = ranks === expect;
  console.error('  ranks unique 1-' + all.length + ' ............. ' + (ok1 ? 'ok' : 'FAIL ' + ranks));
  if (!ok1) failures++;

  // 2. swing envelopes: nav band, the full stop's centre, resting on the marquee
  /* The amplitudes are reconstructed EXACTLY as buildShapes derives them,
     aspect and reach included. Get that wrong and the checker vouches for
     an envelope nobody draws: with aspect 2.2 the real vertical swing is
     2.2x what the old flat formula said, which is the difference between
     clearing the nav and sitting in it. If the formula in buildShapes
     moves, move this with it. */
  let envFails = 0;
  const exits = [];
  const envelopes = [];
  for (const d of all) {
    const t = (MAX - d.size) / SPAN;
    const ampX = (40 + 110 * t) * d.reach / d.aspect;
    const ampY = (32 + 86 * t) * d.reach * d.aspect;
    const wob = 6 + 10 * t;
    const e = { x0: d.x - (ampX + wob) / W - d.size / 2 / W, x1: d.x + (ampX + wob) / W + d.size / 2 / W,
                y0: d.y - (ampY + wob) / H - d.size / 2 / H, y1: d.y + (ampY + wob) / H + d.size / 2 / H };
    /* THE NAV RULE IS OPT-IN NOW. It used to be absolute, and it was right
       to be while nothing was meant to go up there. Jack then asked for
       two things that are: the red square "go past the top line that we can
       see", and a small shape that "should kind of get near the language
       button and the dark and light mode button". So a def may carry
       overNav: true, and then rising into the nav band is its job rather
       than a bug. Everything WITHOUT the flag is still held out, which is
       the part worth keeping - the failure this catches is a shape that
       drifts up there by accident after someone changes a size.
       The two controls up there carry an opaque background now (see
       .theme-switch in styles.css), which is the condition for allowing
       this at all. */
    const hitsNav  = e.y0 < NAV_BOTTOM && !d.overNav;
    const hitsStop = FS_CENTRE.x >= e.x0 && FS_CENTRE.x <= e.x1 && FS_CENTRE.y >= e.y0 && FS_CENTRE.y <= e.y1;
    const restsOnMarquee = (d.y + d.size / 2 / H) > MARQUEE.y0 && (d.y - d.size / 2 / H) < MARQUEE.y1;
    /* Leaving the frame is the POINT, not a failure - "I think the shapes
       need to be going off the screen, maybe a little bit" - so it is
       counted and printed rather than flagged. The page carries
       overflow-x: clip, so a shape crossing the edge costs nothing. */
    envelopes.push(e);
    if (e.x0 < 0) exits.push(d.size + 'L');
    if (e.x1 > 1) exits.push(d.size + 'R');
    if (hitsNav || hitsStop || restsOnMarquee) {
      failures++; envFails++;
      console.error('  ENVELOPE FAIL ' + d.type + ' ' + d.size + ' @ ' + d.x + ',' + d.y + '  ' +
        [hitsNav && 'NAV', hitsStop && 'FULL-STOP', restsOnMarquee && 'ON-MARQUEE'].filter(Boolean).join(' '));
    }
  }
  console.error('  envelopes (nav / full stop / marquee) ... ' + (envFails ? envFails + ' FAIL' : 'ok'));
  /* THE TRAJECTORIES THEMSELVES ARE A RULE NOW. Amplitude used to be
     ampX = 40 + 110t and ampY = 32 + 86t, which holds ampY/ampX at .79 for
     every shape in the set, and the y frequency was a hardcoded .8 of the x
     one for all of them - so eleven shapes traced eleven scaled copies of a
     single Lissajous figure. Jack saw it straight away: "there is like three
     shapes that are all lined up on like the same trajectory." Nothing here
     would have caught that, because every individual envelope was legal.
     Three distinct aspects and three distinct frequency ratios is a low bar
     deliberately - it is there to catch a flattening, not to dictate the
     spread. */
  const aspects = [...new Set(all.map(d => d.aspect))].length;
  const ratios = [...new Set(all.map(d => d.ratio))].length;
  const aspMin = Math.min(...all.map(d => d.aspect));
  const aspMax = Math.max(...all.map(d => d.aspect));
  console.error('  paths: ' + aspects + ' aspects (' + aspMin + '-' + aspMax + ') / ' +
    ratios + ' freq ratios,  off-frame ' +
    (exits.length ? exits.join(' ') : 'NONE - reach keys flattened?') +
    ',  over the nav ' + (all.filter(d => d.overNav).map(d => d.size).join(' ') || 'none'));
  if (aspects < 3 || ratios < 3) {
    failures++;
    console.error('  PATHS FAIL: under three distinct values the field is back on one trajectory');
  }

  /* OCCUPANCY. CLAUDE.md has called this "the tool for this question" since
     the white-space note; it lived in a throwaway script until Jack asked
     it again from the other end - "no trajectories really go at the top
     very much... they need to also make sure that they're going to the
     bottoms and the tops."
     Twentieths of the field, counting how many shapes can REACH each slice
     rather than how long they spend there. Reach is the actionable half:
     a slice no envelope covers is a part of the hero no shape ever visits,
     and no amount of re-timing will fill it.
     The marquee slab is SUPPOSED to be thin - a shape on the strip is
     invisible anyway - and the nav band is now visited only by the slots
     carrying overNav. Everything else reading 0, or the whole top of the
     field reading 1, is the thing to look at. */
  const SLICES = 20;
  const occ = new Array(SLICES).fill(0);
  for (const e of envelopes) {
    for (let i = 0; i < SLICES; i++) {
      const lo = i / SLICES, hi = (i + 1) / SLICES;
      if (e.y1 > lo && e.y0 < hi) occ[i]++;
    }
  }
  const bar = n => n === 0 ? '.' : n > 9 ? '#' : String(n);
  if (ground && ink) {
    const bad = [];
    for (const d of all) {
      if (!d.filled) continue;
      const hex = T[d.hue];
      if (!hex) continue;
      const r = contrast(ink, mix(hex2rgb(hex), ground, d.vivid ? ALPHA[theme].vivid : ALPHA[theme].base));
      if (r < TEXT_BAR) { bad.push(d.size + ' ' + d.hue + ' ' + r.toFixed(2) + ':1'); failures++; }
    }
    console.error('  text over a filled shape (bar ' + TEXT_BAR + ':1) ... ' +
      (bad.length ? 'FAIL ' + bad.join(', ') : 'ok'));
  }
  console.error('  occupancy y (20ths, nav=slice 1, marquee=12-13):  ' + occ.map(bar).join(''));
  const thin = occ.map((n, i) => [n, i]).filter(([n, i]) => n <= 1 && i > 1 && (i < 11 || i > 13));
  if (thin.length) {
    console.error('    thin slices (<=1 shape can reach): ' +
      thin.map(([n, i]) => (i / SLICES).toFixed(2) + '=' + n).join(' '));
  }

  // 3. per budget: band balance, and NO REPEATED HUE IN A BAND
  for (const budget of budgetsFor(name)) {
    const kept = all.filter(d => d.keep <= budget);
    const byBand = {};
    kept.forEach(d => (byBand[band(d.y)] = byBand[band(d.y)] || []).push(d));
    const counts = ['TOP', 'MID', 'SEAM'].map(b => (byBand[b] || []).length).join('/');
    const xs = kept.map(d => d.x).sort((a, b) => a - b);
    let hueProblem = '';
    for (const b of ['TOP', 'MID', 'SEAM']) {
      const hues = (byBand[b] || []).map(d => d.hue);
      if (hues.length !== new Set(hues).size) hueProblem += ' ' + b + '[' + hues.join('+') + ']';
    }
    const enforce = hueRuleSatisfiable(kept);
    if (hueProblem && enforce) failures++;
    const sides = hueSidesOk(kept);
    if (sides.length) failures++;
    console.error('  budget ' + String(budget).padStart(2) + ': bands ' + counts +
      '  x ' + xs[0].toFixed(2) + '-' + xs[xs.length - 1].toFixed(2) +
      '  hues ' + (hueProblem ? (enforce ? 'FAIL repeated:' : 'repeated, unavoidable here:') + hueProblem : 'all mixed') +
      '  fills ' + kept.filter(d => d.filled).length + 'f/' + kept.filter(d => !d.filled).length + 'o' +
      (sides.length ? '\n           SIDES FAIL, hue stuck on one side: ' + sides.join(' ') : '  sides ok'));
  }
}

// 4. both themes use the same slots
/* Position AND path. The theme switch rebuilds the field inside the
   view-transition callback, and the wipe is meant to reveal the same
   composition wearing different shapes - a slot that changes trajectory as
   well as silhouette is a shape that jumps mid-wipe. */
const slot = d => [d.x, d.y, d.aspect, d.ratio, d.reach].join(',');
const a = defs('smoothDefs').map(slot).sort().join('|');
const b = defs('jaggedDefs').map(slot).sort().join('|');
console.error('\nslots + paths identical across themes ... ' + (a === b ? 'ok' : 'FAIL'));
if (a !== b) failures++;
console.error(failures === 0 ? '\nALL CHECKS PASS' : '\n' + failures + ' FAILURE(S)');
process.exit(failures === 0 ? 0 : 1);
