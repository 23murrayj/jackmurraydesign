#!/usr/bin/env node
/* tools/field-shuffle.js — propose alternative hero-field arrangements.
 *
 *   node tools/field-shuffle.js            list 5 valid arrangements
 *   node tools/field-shuffle.js --n 12     list 12
 *   node tools/field-shuffle.js --apply 3  write arrangement 3 into script.js
 *   node tools/field-shuffle.js --apply 0  restore the one that was there
 *
 * WHY THIS EXISTS. The field used to be Math.random() per load, which was
 * replaced with an authored arrangement because random scatter clumps. Jack
 * named what that cost: "the good thing about random was that it was always
 * random, so you could get ones you like and ones you didn't love. But I
 * think this is probably smarter." Both halves are true. Random gave variety
 * with no floor on quality; authored gives quality but exactly one answer,
 * so disliking it leaves you stuck.
 *
 * This is the synthesis: roll the dice, but only inside the rules. Every
 * arrangement it emits already satisfies the band balance, the hue rule, the
 * x-spread and the swing envelopes, so choosing between them is a question
 * of taste and nothing else. The duds are filtered out before anyone looks.
 *
 * WHAT IT VARIES, and what it does not. Colours, fills and which shapes are
 * vivid are settled - argued out one at a time, and not up for a dice roll.
 * What moves on every roll is which shape sits in which band, where inside
 * that band it rests, and the keep order that decides who survives a phone.
 *
 * SIZES move only when asked, via --sizes, never as part of the roll. The
 * profiles scale the BIG shapes harder than the small ones rather than
 * inflating everything equally, for two reasons. It deepens the size
 * hierarchy, which is what the jump to 132 bought in the first place - a
 * field where everything is roughly one size is a spread, not a hierarchy.
 * And it keeps the vivid shapes small, which matters because a large shape
 * at the .72 vivid alpha stops reading as background and starts reading as
 * an object (see CLAUDE.md). The smallest shape is a fixed point in every
 * profile; the largest grows most.
 *
 * THE HUE RULE IS NOT CHECKED, IT IS BUILT IN. Each band must hold three
 * distinct hues, and with 3 blue, 3 coral, 2 black and 1 amber that forces
 * every band to be one blue + one coral + one of black/black/amber. Since
 * any subset of a hue-distinct set is still hue-distinct, satisfying it at
 * nine satisfies it at seven and five for free - so the generator assigns
 * from those three pools and the rule cannot be broken by construction.
 *
 * Both themes are permuted together by size rank. Light and dark hold the
 * same hue pattern in size order (blue, blue, coral, black, blue, coral,
 * black, coral, amber), so one permutation keeps the two arrays consistent
 * and the theme switch keeps revealing the same composition.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'script.js');
const BACKUP = path.join(__dirname, '.field-before-shuffle.json');

/* The field box at 1440, measured in the live page. Everything below is a
   fraction of it. */
const W = 1440, H = 1026;
const NAV_BOTTOM = 0.092;
const FS_CENTRE = { x: 0.6555, y: 0.42 };     // the full stop after MURRAY
const MARQUEE = { y0: 0.579, y1: 0.640 };

/* Where a band may place a shape. Deliberately narrow: these ranges are the
   part of the composition that was designed, and the roll happens inside
   them. TOP sits across the top of the name, MID across its foot, SEAM down
   past the marquee. */
const BANDS = {
  TOP:  { y: [0.20, 0.28] },
  MID:  { y: [0.44, 0.56] },
  SEAM: { y: [0.70, 0.90] },
};
/* The order bands are drawn from as keep-rank climbs. Fixed, because it is
   what makes the thinned sets balance: cumulative counts come out 2/1/2 at
   five, 3/2/2 at seven and 3/3/3 at nine. */
const RANK_BAND_ORDER = ['SEAM', 'TOP', 'TOP', 'MID', 'SEAM', 'MID', 'TOP', 'SEAM', 'MID'];
const BUDGETS = [5, 7, 9];
const MIN_X_SPREAD = 0.70;                    // widest minus narrowest, per budget

/* k is how much harder the largest shape grows than the smallest. The curve
   is linear in size, anchored so the smallest never moves:
     new = old * (1 + (old - min) / (max - min) * k)
   At k = 0.45 the light set 36..132 becomes 36..191. */
const SIZE_PROFILES = { current: 0, bigger: 0.25, bold: 0.45, biggest: 0.65 };

function scaleSizes(defs, k) {
  if (!k) return defs.map(d => d.size);
  const lo = Math.min(...defs.map(d => d.size));
  const hi = Math.max(...defs.map(d => d.size));
  return defs.map(d => Math.round(d.size * (1 + (d.size - lo) / (hi - lo) * k)));
}

/* A large shape must not also be bright. The exact threshold is a judgement,
   but the rule behind it is not: .72 on something big stops being texture. */
const VIVID_MAX_SIZE = 90;

function parseDefs(src, name) {
  const a = src.indexOf('const ' + name + ' = [');
  const b = src.indexOf('\n  ];', a);
  if (a < 0 || b < 0) throw new Error('cannot find ' + name);
  const body = src.slice(a, b);
  const lines = [];
  for (const m of body.matchAll(/^(    \{ type: .*?\}),?$/gm)) lines.push(m[1]);
  const defs = lines.map((line) => {
    const g = /size: (\d+),\s*color: 'var\(--([\w-]+)\)'/.exec(line);
    const k = /keep: (\d+)/.exec(line);
    const at = /at: \[([\d.]+), ([\d.]+)\]/.exec(line);
    return { line, size: +g[1], hue: g[2], keep: +k[1], x: +at[1], y: +at[2] };
  });
  return { start: a, end: b, defs };
}

/* hue families, by the role they play rather than by name, so light and dark
   map onto each other */
function family(hue) {
  if (hue === 'blue') return 'blue';
  if (hue === 'accent') return 'coral';
  if (hue === 'black' || hue === 'highlight') return 'neutral';
  return 'warm';                               // accent-warm
}

function envelopeOk(d, maxSize, span) {
  /* checkSize is the larger of the two themes' sizes for this slot; plain
     size is used when no scaling profile is in play and they match. */
  const sz = d.checkSize || d.size;
  const t = (maxSize - d.size) / span;
  const ampX = 40 + 110 * t, ampY = 32 + 86 * t, wob = 6 + 10 * t;
  const x0 = d.x - (ampX + wob) / W - sz / 2 / W;
  const x1 = d.x + (ampX + wob) / W + sz / 2 / W;
  const y0 = d.y - (ampY + wob) / H - sz / 2 / H;
  const y1 = d.y + (ampY + wob) / H + sz / 2 / H;
  if (y0 < NAV_BOTTOM) return false;                                  // into the nav
  if (FS_CENTRE.x >= x0 && FS_CENTRE.x <= x1 &&
      FS_CENTRE.y >= y0 && FS_CENTRE.y <= y1) return false;           // parks on the full stop
  const top = d.y - sz / 2 / H, bot = d.y + sz / 2 / H;
  if (bot > MARQUEE.y0 && top < MARQUEE.y1) return false;             // rests on the strip
  return true;
}

const rnd = (lo, hi) => lo + Math.random() * (hi - lo);
const shuffled = (a) => { const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;
    [r[i], r[j]] = [r[j], r[i]]; } return r; };

/* One attempt: deal the shapes into bands by hue family, place them, rank
   them, and return the arrangement if every rule holds. */
function attempt(defs) {
  const maxSize = Math.max(...defs.map(d => d.size));
  const span = maxSize - Math.min(...defs.map(d => d.size)) || 1;

  const byFamily = { blue: [], coral: [], neutral: [], warm: [] };
  defs.forEach((d, i) => byFamily[family(d.hue)].push(i));
  if (byFamily.blue.length !== 3 || byFamily.coral.length !== 3) return null;

  const blues = shuffled(byFamily.blue);
  const corals = shuffled(byFamily.coral);
  const thirds = shuffled(byFamily.neutral.concat(byFamily.warm));
  if (thirds.length !== 3) return null;

  const bandNames = ['TOP', 'MID', 'SEAM'];
  const bandMembers = {};
  bandNames.forEach((b, i) => { bandMembers[b] = [blues[i], corals[i], thirds[i]]; });

  // place: a y inside the band, and x values kept apart so a band is not a huddle
  const placed = defs.map(d => ({ ...d, newSize: d.size }));
  for (const b of bandNames) {
    let xs = null;
    for (let tries = 0; tries < 200 && !xs; tries++) {
      const c = [rnd(0.08, 0.95), rnd(0.08, 0.95), rnd(0.08, 0.95)].sort((p, q) => p - q);
      if (c[1] - c[0] > 0.18 && c[2] - c[1] > 0.18 && c[2] - c[0] > 0.55) xs = shuffled(c);
    }
    if (!xs) return null;
    bandMembers[b].forEach((idx, j) => {
      placed[idx].x = +xs[j].toFixed(3);
      placed[idx].y = +rnd(BANDS[b].y[0], BANDS[b].y[1]).toFixed(3);
      placed[idx].band = b;
    });
  }

  if (!placed.every(d => envelopeOk(d, maxSize, span))) return null;

  // rank: walk RANK_BAND_ORDER, taking an unused shape from that band each time
  const pool = {}; bandNames.forEach(b => pool[b] = shuffled(bandMembers[b]));
  const order = [];
  for (const b of RANK_BAND_ORDER) {
    if (!pool[b].length) return null;
    order.push(pool[b].shift());
  }
  order.forEach((idx, i) => { placed[idx].keep = i + 1; });

  // x-spread has to survive the cuts
  for (const budget of BUDGETS) {
    const kept = placed.filter(d => d.keep <= budget).map(d => d.x);
    if (Math.max(...kept) - Math.min(...kept) < MIN_X_SPREAD) return null;
  }
  return placed;
}

function generate(n, k) {
  const src = fs.readFileSync(SRC, 'utf8');
  const light = parseDefs(src, 'smoothDefs');
  const dark = parseDefs(src, 'jaggedDefs');
  const sized = scaleSizes(light.defs, k);

  /* VALIDATE AGAINST THE BIGGER OF THE TWO THEMES AT EACH SLOT. Dark scales
     from its own range, so its shapes are not the same px as light's - at
     the biggest profile light's largest is 218 and dark's is 231. Checking
     only light's numbers passes placements that put the dark star through
     the nav band, which is exactly what happened: field-check caught a
     231px star resting at y .238. The envelope has to hold for whichever
     theme is larger, or the two themes cannot share a slot. */
  const darkSized = scaleSizes(dark.defs, k);
  const lightRank = light.defs.map((d, i) => i).sort((a, b) => light.defs[b].size - light.defs[a].size);
  const darkRank = dark.defs.map((d, i) => i).sort((a, b) => dark.defs[b].size - dark.defs[a].size);
  const worst = new Array(light.defs.length);
  lightRank.forEach((li, rank) => {
    worst[li] = Math.max(sized[li], darkSized[darkRank[rank]]);
  });

  const defs = light.defs.map((d, i) => ({
    ...d, size: sized[i], checkSize: worst[i], vivid: /vivid: true/.test(d.line),
  }));
  const tooBright = defs.filter(d => d.vivid && d.size > VIVID_MAX_SIZE);
  if (tooBright.length) {
    console.error('  note: ' + tooBright.map(d => d.size + 'px ' + d.hue).join(', ') +
      ' would be vivid above ' + VIVID_MAX_SIZE + 'px; dropping them to the base alpha');
  }
  const out = [];
  for (let guard = 0; guard < 400000 && out.length < n; guard++) {
    const a = attempt(defs);
    if (a) out.push(a);
  }
  return out;
}

function describe(arr) {
  const byBand = { TOP: [], MID: [], SEAM: [] };
  arr.forEach(d => byBand[d.band].push(d));
  return ['TOP', 'MID', 'SEAM'].map(b =>
    '    ' + b.padEnd(5) + byBand[b].sort((p, q) => p.x - q.x)
      .map(d => `${String(d.size).padStart(3)}${d.hue === 'accent' ? ' coral' : ' ' + d.hue}`
        .padEnd(16) + `@${d.x.toFixed(2)},${d.y.toFixed(2)} k${d.keep}`).join('  ')
  ).join('\n');
}

/* Rewrite both def arrays in place. Only `keep` and `at` move; every other
   token on the line, comments included, is left exactly as it was. */
function apply(arr, k) {
  let src = fs.readFileSync(SRC, 'utf8');
  for (const name of ['smoothDefs', 'jaggedDefs']) {
    const { defs } = parseDefs(src, name);
    /* Each theme scales from ITS OWN range. Dark's stars run 34-140 against
       light's 36-132 - deliberately a little larger, because a spiky
       silhouette reads smaller than a solid one at the same box. Taking
       light's scaled numbers for both would erase that, which is what the
       first version of this did: dark came out identical to light. */
    const ownSizes = k ? scaleSizes(defs, k) : defs.map(d => d.size);
    const order = defs.map((d, i) => i).sort((a, b) => defs[b].size - defs[a].size);
    const lightOrder = arr.map((d, i) => i).sort((a, b) => arr[b].size - arr[a].size);
    for (let rank = 0; rank < order.length; rank++) {
      const target = arr[lightOrder[rank]];
      const def = defs[order[rank]];
      let updated = def.line
        .replace(/keep: \d+/, 'keep: ' + target.keep)
        .replace(/at: \[[\d.]+, [\d.]+\]/, `at: [${target.x}, ${target.y}]`);
      const newSize = k ? ownSizes[order[rank]] : null;
      if (newSize) {
        /* keep the column alignment the arrays are written in: the size
           field is padded to 4 so the colour column stays put */
        updated = updated.replace(/size: \d+,(\s*)/, (m, sp) => {
          const want = 'size: ' + newSize + ',';
          const pad = Math.max(1, ('size: 000,').length + sp.length - want.length);
          return want + ' '.repeat(pad);
        });
        if (newSize > VIVID_MAX_SIZE) updated = updated.replace(/\s*vivid: true,/, '');
      }
      src = src.replace(def.line, updated);
    }
  }
  fs.writeFileSync(SRC, src);
}

/* Restoring is not the same operation as applying: it has to put the
   original sizes back as well as the positions, and it has them verbatim
   rather than through a profile. */
function applyRestore(saved) {
  let src = fs.readFileSync(SRC, 'utf8');
  for (const name of ['smoothDefs', 'jaggedDefs']) {
    const { defs } = parseDefs(src, name);
    const order = defs.map((d, i) => i).sort((a, b) => defs[b].size - defs[a].size);
    const savedOrder = saved.map((d, i) => i).sort((a, b) => saved[b].size - saved[a].size);
    for (let rank = 0; rank < order.length; rank++) {
      const t = saved[savedOrder[rank]];
      const def = defs[order[rank]];
      let updated = def.line
        .replace(/keep: \d+/, 'keep: ' + t.keep)
        .replace(/at: \[[\d.]+, [\d.]+\]/, `at: [${t.x}, ${t.y}]`);
      src = src.replace(def.line, updated);
    }
  }
  fs.writeFileSync(SRC, src);
}

const args = process.argv.slice(2);
const flag = (name, dflt) => { const i = args.indexOf(name); return i < 0 ? dflt : args[i + 1]; };

if (args.includes('--apply')) {
  const which = +flag('--apply', '0');
  if (which === 0) {
    if (!fs.existsSync(BACKUP)) { console.error('no saved arrangement to restore'); process.exit(1); }
    applyRestore(JSON.parse(fs.readFileSync(BACKUP, 'utf8')));
    console.error('restored the arrangement saved before shuffling');
  } else {
    const stash = flag('--from', null);
    if (!stash) { console.error('--apply N needs --from <file> of generated options'); process.exit(1); }
    const opts = JSON.parse(fs.readFileSync(stash, 'utf8'));
    if (!opts[which - 1]) { console.error('no option ' + which); process.exit(1); }
    const src = fs.readFileSync(SRC, 'utf8');
    if (!fs.existsSync(BACKUP)) fs.writeFileSync(BACKUP, JSON.stringify(parseDefs(src, 'smoothDefs').defs));
    const k = SIZE_PROFILES[flag('--sizes', 'current')] || 0;
    apply(opts[which - 1], k);
    console.error('applied option ' + which + (k ? ' with sizes ' + flag('--sizes', 'current') : ''));
  }
  process.exit(0);
}

const n = +flag('--n', '5');
const profile = flag('--sizes', 'current');
if (!(profile in SIZE_PROFILES)) {
  console.error('unknown --sizes ' + profile + '; pick one of ' + Object.keys(SIZE_PROFILES).join(', '));
  process.exit(1);
}
const opts = generate(n, SIZE_PROFILES[profile]);
const stash = flag('--out', null);
if (stash) fs.writeFileSync(stash, JSON.stringify(opts));
console.error('generated ' + opts.length + ' arrangements (sizes: ' + profile +
  '), all passing band / hue / spread / envelope\n');
opts.forEach((a, i) => { console.error('  OPTION ' + (i + 1)); console.error(describe(a)); console.error(''); });
