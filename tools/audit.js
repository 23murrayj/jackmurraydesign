#!/usr/bin/env node
/* tools/audit.js - the static half of the site audit. Run it before any
 * commit that touches more than one file:
 *
 *     node tools/audit.js
 *
 * WHY IT IS A FILE. This has been written from scratch three times as a
 * throwaway, and each time it found something and then vanished - the same
 * fate the occupancy scan and the loudness measurement had before they
 * moved into tools/field-check.js. The run on 2026-11-11 found 76 dead
 * i18n keys (19 per language): translations for four placeholder projects
 * that were deleted long ago, two filter categories with no projects, two
 * dialog labels superseded by aria-labelledby, and lang.name, which the
 * language menu never used because a language name should always appear in
 * its own language and so is hardcoded in the markup.
 *
 * TWO FALSE POSITIVES ARE HANDLED EXPLICITLY, because both have nearly got
 * live code deleted:
 *   - CSS comments name classes that are not selectors, so comments are
 *     stripped before any "is this class used" question;
 *   - classes built from template literals (shape-circle, layout-masonry,
 *     size-tall) never appear as whole words anywhere.
 * The same applies to i18n: proj.<id>.* and cat.<CATEGORY> are composed at
 * runtime, so the live ids and categories are read out of projectData and
 * fed to the check rather than guessed at.
 *
 * What it does NOT cover, because it needs a running page: contrast,
 * horizontal overflow, console errors, focus order, and any count that
 * only exists after JS runs (.reveal is 19 at runtime and 16 in markup).
 * Drive the page for those. tools/field-check.js covers the hero field.
 */
const fs = require('fs');
const path = require('path');
const R = require('path').join(__dirname, '..') + '/';
const read = f => fs.readFileSync(R + f, 'utf8');

const html = read('index.html');
const cssRaw = read('styles.css');
const css = cssRaw.replace(/\/\*[\s\S]*?\*\//g, ' ');
const js = read('script.js');
const i18n = read('i18n.js');
const notFound = read('404.html');
// the six live project ids and the categories they use - the i18n check
// needs them, because proj.<id>.* and cat.<CATEGORY> are looked up as
// 'proj.' + id and never appear as literals anywhere
const LIVE_IDS = [...new Set([...js.matchAll(/^ {2}'([\w-]+)':\s*\{\s*$/gm)].map(m => m[1]))];
const LIVE_CATS = [...new Set([...js.matchAll(/category:\s*'([^']+)'/g)].map(m => m[1]))];
let problems = 0;
const say = (label, ok, detail) => {
  if (!ok) problems++;
  console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '  ' + detail : ''));
};

console.log('\n— leftovers in source');
for (const [name, needle] of [['debugger', /\bdebugger\b/], ['console.log', /console\.log\(/],
                              ['TODO/FIXME', /\b(TODO|FIXME|XXX)\b/]]) {
  const hits = ['index.html', 'styles.css', 'script.js', 'i18n.js'].filter(f => needle.test(read(f)));
  say(name, hits.length === 0, hits.join(' '));
}

console.log('\n— dead CSS classes');
{
  const classes = new Set();
  for (const m of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) classes.add(m[1]);
  const elsewhere = html + js + i18n;
  const dead = [...classes].filter(c => {
    if (new RegExp('\\b' + c + '\\b').test(elsewhere)) return false;
    /* Built from a template literal: shape-circle, layout-masonry and
       size-tall never appear as whole words - they are written
       `shape-${def.type}`. Missing this is how an earlier audit nearly
       deleted four live rules. */
    const prefix = c.replace(/-[^-]+$/, '-');
    return prefix === c || (!elsewhere.includes('`' + prefix) && !elsewhere.includes(prefix + '$'));
  });
  say('every class is referenced', dead.length === 0, dead.join(' '));
  console.log('       ' + classes.size + ' classes');
}

console.log('\n— unused CSS custom properties');
{
  const declared = new Set();
  for (const m of cssRaw.matchAll(/^\s*(--[\w-]+)\s*:/gm)) declared.add(m[1]);
  const unused = [...declared].filter(v => (cssRaw + js + html).split('var(' + v).length - 1 === 0);
  say('every custom property is used', unused.length === 0, unused.join(' '));
  console.log('       ' + declared.size + ' properties');
}

console.log('\n— uncalled functions in script.js');
{
  const declared = [...js.matchAll(/^\s*(?:async\s+)?function\s+(\w+)/gm)].map(m => m[1]);
  const uncalled = declared.filter(f => js.split(new RegExp('\\b' + f + '\\b')).length - 1 <= 1);
  say('every function is called', uncalled.length === 0, uncalled.join(' '));
  console.log('       ' + declared.length + ' functions');
}

console.log('\n— i18n');
{
  const langs = ['en', 'es', 'ja', 'it'];
  const blocks = {};
  for (const lang of langs) {
    const a = i18n.indexOf('\n    ' + lang + ': {');
    let b = i18n.indexOf('\n    },', a);
    if (b < 0) b = i18n.indexOf('\n    }', a);        // the last block has no trailing comma
    blocks[lang] = [...i18n.slice(a, b).matchAll(/^      '([^']+)'\s*:/gm)].map(m => m[1]);
  }
  const counts = langs.map(l => blocks[l].length);
  say('key counts equal', new Set(counts).size === 1, counts.join(' / '));
  for (const l of langs.slice(1)) {
    const missing = blocks.en.filter(k => !blocks[l].includes(k));
    const extra = blocks[l].filter(k => !blocks.en.includes(k));
    say('parity en vs ' + l, !missing.length && !extra.length,
      (missing.length ? 'missing ' + missing.join(',') : '') + (extra.length ? ' extra ' + extra.join(',') : ''));
  }
  for (const l of langs) {
    const d = [...new Set(blocks[l].filter((k, i) => blocks[l].indexOf(k) !== i))];
    if (d.length) say('duplicate keys in ' + l, false, d.join(','));
  }
  const used = new Set();
  const markup = html + js + notFound;
  for (const m of markup.matchAll(/data-i18n(?:-\w+)?="([\w.]+)"/g)) used.add(m[1]);
  for (const m of notFound.matchAll(/I18N\.t\('([\w.]+)'\)/g)) used.add(m[1]);
  // keys composed at runtime
  for (const id of LIVE_IDS) for (const k of ['desc', 'type', 'role', 'body']) used.add('proj.' + id + '.' + k);
  for (const k of blocks.en) if (/^proj\.[\w-]+\.alt\.\d+$/.test(k) && LIVE_IDS.some(id => k.startsWith('proj.' + id + '.'))) used.add(k);
  for (const c of LIVE_CATS) used.add('cat.' + c);
  for (const m of js.matchAll(/T\.t\('([\w.]+)'\)/g)) used.add(m[1]);
  for (const m of js.matchAll(/setAttribute\('data-i18n'[^)]*'([\w.]+)'\)/g)) used.add(m[1]);
  const missingKeys = [...used].filter(k => !blocks.en.includes(k));
  say('every referenced key exists', missingKeys.length === 0, missingKeys.join(' '));
  const unusedKeys = blocks.en.filter(k => !used.has(k) && !markup.includes("'" + k + "'") && !markup.includes('"' + k + '"'));
  say('every key is referenced', unusedKeys.length === 0, unusedKeys.join(' '));
  console.log('       ' + counts[0] + ' keys x 4 languages');
}

console.log('\n— the project list agrees everywhere');
{
  const inData = [...new Set([...js.matchAll(/^ {2}'([\w-]+)':\s*\{\s*$/gm)].map(m => m[1]))];
  const sitemap = read('sitemap.xml');
  const llms = read('llms.txt');
  const jsonLd = (html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/) || [''])[0];
  const sets = {
    projectData: inData,
    sitemap: [...new Set([...sitemap.matchAll(/\/work\/([\w-]+)/g)].map(m => m[1]))],
    llmsTxt: [...new Set([...llms.matchAll(/\/work\/([\w-]+)/g)].map(m => m[1]))],
    jsonLd: [...new Set([...jsonLd.matchAll(/\/work\/([\w-]+)/g)].map(m => m[1]))],
  };
  const sig = o => o.slice().sort().join(',');
  for (const [k, v] of Object.entries(sets)) say(k + ' (' + v.length + ')', sig(v) === sig(sets.projectData), sig(v));
}

console.log('\n— WebP invariant (every inline jpg has a webp sibling)');
{
  const miss = []; let n = 0;
  const walk = d => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.jpg') && !e.name.endsWith('-full.jpg')) {
        n++;
        if (!fs.existsSync(p.replace(/\.jpg$/, '.webp'))) miss.push(p.replace(R, ''));
      }
    }
  };
  for (const d of ['assets/projects', 'assets/about']) if (fs.existsSync(R + d)) walk(R + d);
  say(n + ' inline jpgs each have a webp', miss.length === 0, miss.join(' '));
}

console.log('\n— asset paths are root-relative (they resolve against /work/ on a deep link)');
{
  const rel = (js.match(/["']assets\//g) || []).length + (html.match(/(src|href)="assets\//g) || []).length;
  say('no relative assets/ paths', rel === 0, rel + ' found');
}

console.log('\n— hover and focus pairs');
{
  /* CLAUDE.md: "a walk of the resting DOM misses them, and this is now the
     source of every contrast bug this project has shipped". --warn-ink on
     --highlight sat at 3.55:1 unnoticed; --paper on the card hover's coral
     fill went unseen for months. The live audit cannot visit :hover, so the
     pairs are resolved from the stylesheet instead: every rule that sets
     BOTH a colour and a ground, measured in both themes.
     Comments are already stripped from `css`, which matters here - a
     comment that happens to mention :hover otherwise drags the rule after
     it into the list. */
  const tok = (block) => {
    const a = css.indexOf(block);
    const body = css.slice(a, css.indexOf('\n}', a));
    const out = {};
    for (const m of body.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,8})/g)) out[m[1]] = m[2];
    return out;
  };
  const LIGHT = tok(':root {');
  const DARK = Object.assign({}, LIGHT, tok(':root[data-theme="dark"]'));
  const rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  const pairs = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim().replace(/\s+/g, ' ');
    if (!/:hover|:focus/.test(sel)) continue;
    const fg = /(?:^|[;\s])color:\s*var\((--[\w-]+)\)/.exec(m[2]);
    const bg = /background(?:-color)?:\s*var\((--[\w-]+)\)/.exec(m[2]);
    if (fg && bg) pairs.push({ sel, fg: fg[1], bg: bg[1] });
  }
  const low = [];
  let unresolved = 0;
  for (const p of pairs) {
    for (const [name, T] of [['light', LIGHT], ['dark', DARK]]) {
      const f = T[p.fg], b = T[p.bg];
      if (!f || !b) { unresolved++; continue; }   // rgba() tokens, measured in the live walk instead
      const r = ratio(rgb(f), rgb(b));
      if (r < 4.5) low.push(p.sel.slice(0, 40) + ' ' + name + ' ' + r.toFixed(2) + ':1 (' + p.fg + ' on ' + p.bg + ')');
    }
  }
  say(pairs.length + ' token pairs across hover/focus rules', low.length === 0, low.join(' | '));
  if (unresolved) console.log('       ' + unresolved + ' pair(s) use a non-hex token and are left to the live walk');
}

console.log('\n— script.js section order');
{
  const nums = [...js.matchAll(/SECTION (\d+) ·/g)].map(m => +m[1]);
  const sorted = nums.every((n, i) => i === 0 || n >= nums[i - 1]);
  say('banners run in order, boot block last', sorted && nums[nums.length - 1] === Math.max(...nums),
    nums.join(','));
}

console.log(problems ? '\n' + problems + ' PROBLEM(S)\n' : '\nstatic audit clean\n');
process.exit(problems ? 1 : 0);
