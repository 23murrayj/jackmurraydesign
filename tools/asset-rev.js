#!/usr/bin/env node
/*
 * asset-rev.js — keep every ?v= in script.js equal to its file's content hash.
 *
 *   node tools/asset-rev.js            rewrite any stale hash in place
 *   node tools/asset-rev.js --check    exit 1 if one is stale, change nothing
 *
 * WHY THIS EXISTS. vercel.json gives everything under /assets/ an hour of
 * freshness and a WEEK of stale-while-revalidate, so changing the bytes at a
 * path a visitor has already loaded shows them the old file for days. The
 * mesh has always carried a ?v= for exactly this (see the note in
 * CLAUDE.md); photographs were handled by renaming the file instead, which
 * works and costs a new filename every time a crop is tuned. cs-hero went
 * cs-hero -> cs-hero-bowl -> cs-hero-clip in two commits before this landed.
 *
 * IT IS NOT A BUILD STEP. Nothing runs at deploy and nothing runs in a
 * browser; it rewrites a few characters in a static file on this machine,
 * the way tools/write-fallback.js rewrites a block of index.html. The
 * pre-commit hook calls it so the hash cannot be forgotten - a hash somebody
 * has to remember to update is a hash that will be wrong.
 *
 * OPT-IN BY MARKER. It only touches paths that ALREADY carry a ?v=, so
 * adding one to a path is how you enrol it and there is no sweeping change
 * to the other ~90 assets. `?v=0` is the convenient way to enrol a new one:
 * it is stale by definition, so the first run fills it in.
 *
 * .jmm IS SKIPPED. tools/model-check.js owns the mesh's hash and asserts it
 * independently; two tools writing the same characters is how they drift.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const TARGETS = ['script.js', 'index.html'].map((f) => path.join(ROOT, f));   // index.html carries the resume's ?v=
const CHECK = process.argv.includes('--check');

const hashOf = (rel) =>
  crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex').slice(0, 8);


/* The path, then the marker. Anchored on /assets/ and stopped at the quote
   so it cannot run past the end of one string literal into the next - the
   tempered-lazy bug this repo has shipped three times. */
const RE = /(\/assets\/[^'"?\s]+)\?v=([0-9a-f]+)/g;

const stale = [];
const missing = [];
const outs = TARGETS.map((file) => [file, fs.readFileSync(file, 'utf8').replace(RE, (whole, rel, have) => {
  if (rel.endsWith('.jmm')) return whole;          // model-check owns this one
  if (!fs.existsSync(path.join(ROOT, rel))) { missing.push(rel); return whole; }
  const want = hashOf(rel);
  if (want === have) return whole;
  stale.push({ rel, have, want });
  return rel + '?v=' + want;
})]);

/* A webp sibling shares the jpg's hash in the markup (mediaTag derives the
   .webp path from the .jpg one), so the two files would have to be hashed
   separately to be strictly correct. They always change together, so the
   jpg's hash is a perfectly good cache key for both - but say so, because
   the alternative reading is that the webp is unversioned. */

if (missing.length) {
  console.error('asset-rev: these ?v= paths do not exist on disk:\n  ' + missing.join('\n  '));
  process.exit(1);
}

if (!stale.length) {
  console.log('asset-rev: every ?v= matches its file');
  process.exit(0);
}

for (const s of stale) console.log('  ' + s.rel + '  ?v=' + s.have + ' -> ?v=' + s.want);

if (CHECK) {
  console.error('asset-rev: ' + stale.length + ' stale hash(es). Run `node tools/asset-rev.js`.');
  process.exit(1);
}

for (const [file, text] of outs) fs.writeFileSync(file, text);
console.log('asset-rev: updated ' + stale.length + ' hash(es)');
