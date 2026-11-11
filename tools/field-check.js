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
    /type: '(\w+)',\s*size: (\d+),\s*color: 'var\(--([\w-]+)\)',\s*filled: (\w+),([^}]*?)keep: (\d+),\s*at: \[([\d.]+), ([\d.]+)\]/g
  )].map(m => ({ type: m[1], size: +m[2], hue: m[3], filled: m[4] === 'true',
                 vivid: /vivid/.test(m[5]), keep: +m[6], x: +m[7], y: +m[8] }));
}

let failures = 0;

// The budgets come from shapeBudget() in script.js rather than being
// repeated here. The checker went stale once already by hardcoding a
// shape count, which is exactly the failure it exists to catch.
const BUDGETS = (() => {
  const a = s_src.indexOf('function shapeBudget()');
  const body = s_src.slice(a, s_src.indexOf('}', a));
  const n = [...body.matchAll(/return (\d+)/g)].map(m => +m[1]);
  return [...new Set(n)].sort((x, y) => x - y);
})();

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
  let envFails = 0;
  for (const d of all) {
    const t = (MAX - d.size) / SPAN;
    const ampX = 40 + 110 * t, ampY = 32 + 86 * t, wob = 6 + 10 * t;
    const e = { x0: d.x - (ampX + wob) / W - d.size / 2 / W, x1: d.x + (ampX + wob) / W + d.size / 2 / W,
                y0: d.y - (ampY + wob) / H - d.size / 2 / H, y1: d.y + (ampY + wob) / H + d.size / 2 / H };
    const hitsNav  = e.y0 < NAV_BOTTOM;
    const hitsStop = FS_CENTRE.x >= e.x0 && FS_CENTRE.x <= e.x1 && FS_CENTRE.y >= e.y0 && FS_CENTRE.y <= e.y1;
    const restsOnMarquee = (d.y + d.size / 2 / H) > MARQUEE.y0 && (d.y - d.size / 2 / H) < MARQUEE.y1;
    if (hitsNav || hitsStop || restsOnMarquee) {
      failures++; envFails++;
      console.error('  ENVELOPE FAIL ' + d.type + ' ' + d.size + ' @ ' + d.x + ',' + d.y + '  ' +
        [hitsNav && 'NAV', hitsStop && 'FULL-STOP', restsOnMarquee && 'ON-MARQUEE'].filter(Boolean).join(' '));
    }
  }
  console.error('  envelopes (nav / full stop / marquee) ... ' + (envFails ? envFails + ' FAIL' : 'ok'));

  // 3. per budget: band balance, and NO REPEATED HUE IN A BAND
  for (const budget of BUDGETS) {
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
const a = defs('smoothDefs').map(d => d.x + ',' + d.y).sort().join('|');
const b = defs('jaggedDefs').map(d => d.x + ',' + d.y).sort().join('|');
console.error('\nslots identical across themes ... ' + (a === b ? 'ok' : 'FAIL'));
if (a !== b) failures++;
console.error(failures === 0 ? '\nALL CHECKS PASS' : '\n' + failures + ' FAILURE(S)');
process.exit(failures === 0 ? 0 : 1);
