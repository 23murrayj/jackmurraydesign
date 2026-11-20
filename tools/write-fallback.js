#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Regenerates the <ul class="gallery-fallback"> block in index.html.

   WHY THIS IS A TOOL AND NOT TYPING. The block is the six projects written
   out in markup so the document says what the work is before renderGallery()
   replaces it with the real cards - the markup-holds-the-truth rule. That
   makes it a COPY of projectData and of the English strings in i18n.js, and a
   copy drifts. Generating it means the copy is derived from the originals and
   can be re-derived whenever they move; tools/audit.js then checks that what
   is in index.html is what this script would write today.

   IT IS NOT A BUILD STEP. Nothing runs at deploy and nothing runs in the
   visitor's browser. What ships is the same hand-editable static HTML it was
   before; this just writes a block of it for you, the way
   tools/field-shuffle.js writes a block of script.js. Run it after changing a
   project's title, desc or write-up:

     node tools/write-fallback.js          # rewrite the block in place
     node tools/write-fallback.js --check  # exit 1 if index.html is stale

   English only, deliberately. The markup is what a reader sees before any
   script has run, and i18n.js cannot have run by then, so there is exactly
   one language available and it is the document's own lang.
   --------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');

const R = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(R, f), 'utf8');

const js = read('script.js');
const i18n = read('i18n.js');

// ids in projectData order - the order the cards render in, so the fallback
// and the real grid agree about which project comes first
const ids = [...js.matchAll(/^ {2}'([\w-]+)':\s*\{\s*$/gm)].map((m) => m[1]);
if (ids.length === 0) throw new Error('no projects found in projectData - has its indentation changed?');

// Read one single- or double-quoted JS string literal starting at `from`,
// honouring backslash escapes. A regex cannot do this: every desc and body
// here contains apostrophes, and a character class that excludes both quote
// characters silently stops at the first one - which is how an earlier pass
// of this came back with desc: null for monmouth-retreat and nothing else.
function readLiteral(src, from) {
  const q = src[from];
  if (q !== '"' && q !== "'" && q !== '`') return null;
  let s = '';
  for (let i = from + 1; i < src.length; i++) {
    const c = src[i];
    if (c === '\\') {
      const n = src[i + 1];
      s += n === 'n' ? '\n' : n === 't' ? '\t' : n;
      i++;
      continue;
    }
    if (c === q) return s;
    s += c;
  }
  throw new Error('unterminated string literal');
}

function fromProjectData(id, key) {
  const at = js.indexOf("  '" + id + "': {");
  if (at < 0) throw new Error('no projectData entry for ' + id);
  const seg = js.slice(at, at + 6000);
  const m = new RegExp('\\b' + key + ': ').exec(seg);
  if (!m) return null;
  return readLiteral(seg, m.index + m[0].length);
}

// The FIRST occurrence of each key in i18n.js is the English block; the other
// three languages repeat the same keys below it.
function englishKey(key) {
  const m = new RegExp("'" + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "':\\s*").exec(i18n);
  if (!m) return null;
  return readLiteral(i18n, m.index + m[0].length);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const items = ids.map((id) => {
  const title = fromProjectData(id, 'title');
  const category = fromProjectData(id, 'category');
  const desc = englishKey('proj.' + id + '.desc') || fromProjectData(id, 'desc');
  const body = englishKey('proj.' + id + '.body');
  if (!title || !category || !desc) throw new Error('incomplete entry for ' + id);

  // same split openProject() uses, so the paragraphing matches the panel
  const paras = body
    ? body.split(/\n{2,}/).map((p) => `\n        <p class="gallery-fallback-body">${esc(p.trim())}</p>`).join('')
    : '';

  return `      <li>
        <a href="/work/${id}">
          <span class="gallery-fallback-cat">${esc(category)}</span>
          <span class="gallery-fallback-title">${esc(title)}</span>
          <span class="gallery-fallback-desc">${esc(desc)}</span>
        </a>${paras}
      </li>`;
}).join('\n');

const block = `    <ul class="gallery-fallback">\n${items}\n    </ul>`;

const file = path.join(R, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const re = /^ {4}<ul class="gallery-fallback">[\s\S]*?^ {4}<\/ul>$/m;
if (!re.test(html)) throw new Error('could not find the gallery-fallback block in index.html');

const next = html.replace(re, block);
const check = process.argv.includes('--check');

if (check) {
  const stale = next !== html;
  console.log(stale
    ? 'STALE  index.html does not match projectData + i18n.js - run: node tools/write-fallback.js'
    : 'ok     gallery-fallback is current (' + ids.length + ' projects)');
  process.exit(stale ? 1 : 0);
}

fs.writeFileSync(file, next);
console.log('wrote ' + ids.length + ' projects into the gallery-fallback block' +
  (next === html ? ' (no change)' : ''));
