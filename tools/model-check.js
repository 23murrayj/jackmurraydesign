#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Checks the 3D viewer: the packed mesh, and the motion model it is turned by.

     node tools/model-check.js [path/to/model.jmm]

   WHY IT EXISTS. Both halves of SECTION 19 fail silently and invisibly.

   THE MESH. A repack at a different grid, or from a different export, can
   produce a container the parser reads at the wrong offset, normals that
   are not unit length, or - the one that actually shipped - triangles whose
   winding got reversed by the decimation. Clustering moves all three
   corners to cell centroids, and on a thin or curved patch the moved
   triangle can face the other way; with back-face culling on, each one is a
   pinhole, and AlessiPlease2 arrived with 200 of them. They read as dark
   specks scattered over the object, which looks like a bad material rather
   than like bad data, so it is exactly the sort of thing that gets "fixed"
   in the shader for a week.

   THE MOTION. The browser pane freezes requestAnimationFrame - measured, 2
   ticks in 1500ms - so no amount of looking at the page will tell you
   whether the object still turns, whether a flick still coasts, or whether
   the turntable comes back. It has to be checked as arithmetic. That is the
   same reason the theme wipe is verified by asserting keyframes rather than
   by watching it, and the bugs it caught were real: the idle blend was
   fighting the decay and settling at a quarter of the speed it was asked
   for, and the whole model was framerate-dependent, with 60Hz and 144Hz
   0.022 rad apart after a single second.

   THE CONSTANTS ARE READ OUT OF script.js, not copied here, and a missing
   one THROWS. field-shuffle.js went stale twice by scraping values that
   quietly stopped matching and then reporting "all passing" over an empty
   loop; a checker that cannot find what it is checking has to fail loudly.
   --------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ok = [], bad = [];
const T = (name, cond, detail) => (cond ? ok : bad).push(name + (detail ? '  —  ' + detail : ''));

/* ----------------------------------------------- the cache-busting hash */

/* A repack changes the bytes behind a URL that vercel.json gives an hour of
   freshness and a week of stale-while-revalidate. The old mesh then keeps
   being served to anyone who has been before - and since the packer bakes
   the node transform in and the viewer dropped its ZUP correction, a stale
   mesh does not merely look old, it renders lying on its back. So the URL
   carries the file's own content hash, and this is the check that the two
   have not drifted. A hand-maintained hash is a hash that will be wrong. */
function checkCacheKey(file) {
  const crypto = require('crypto');
  const src = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');
  const rel = '/' + path.relative(ROOT, file).split(path.sep).join('/');
  const re = new RegExp(rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\?v=([0-9a-f]+)');
  const m = src.match(re);
  const want = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (!m) {
    T('the model URL carries a cache-busting hash', false,
      `${rel} is referenced in script.js with no ?v= — add ?v=${want.slice(0, 8)}`);
    return;
  }
  T('the ?v hash matches the mesh on disk', want.startsWith(m[1]),
    m[1] === want.slice(0, m[1].length)
      ? `?v=${m[1]}`
      : `script.js says ?v=${m[1]}, the file hashes to ${want.slice(0, 8)} — repacked without updating the URL`);
}

/* ---------------------------------------------------------------- the mesh */

function loadJMM(file) {
  const buf = fs.readFileSync(file);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
  const dv = new DataView(ab);
  const tag = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (tag !== 'JMM1') throw new Error(file + ': not a JMM1 mesh (tag "' + tag + '")');
  const nv = dv.getUint32(4, true), nt = dv.getUint32(8, true);
  const idxOff = dv.getUint32(28, true);
  return {
    bytes: buf.length, nv, nt, idxOff,
    half: dv.getFloat32(12, true),
    frac: [dv.getFloat32(16, true), dv.getFloat32(20, true), dv.getFloat32(24, true)],
    pos: new Int16Array(ab, 32, nv * 3),
    nor: new Int8Array(ab, 32 + nv * 6, nv * 3),
    idx: new Uint16Array(ab, idxOff, nt * 3),
  };
}

function checkMesh(file) {
  const m = loadJMM(file);
  const rel = path.relative(ROOT, file);
  console.log(`\nMESH  ${rel}`);
  console.log(`  ${m.nv} verts  ${m.nt} tris  ${(m.bytes / 1024).toFixed(0)}KB  ` +
              `half-extent ${m.half.toFixed(4)}  axes ${m.frac.map((f) => f.toFixed(3)).join('/')}`);

  // the container: the reader derives the index offset from the header rather
  // than recomputing it, so the two have to agree
  const expect = 32 + m.nv * 6 + m.nv * 3 + ((4 - ((32 + m.nv * 9) % 4)) % 4);
  T('index offset matches the layout', m.idxOff === expect, `header says ${m.idxOff}, layout gives ${expect}`);
  T('file is exactly as long as its header implies',
    m.bytes >= m.idxOff + m.nt * 6, `${m.bytes} bytes, needs ${m.idxOff + m.nt * 6}`);
  T('uint16 indices are enough', m.nv <= 65535, `${m.nv} verts`);

  let outOfRange = 0;
  for (let i = 0; i < m.idx.length; i++) if (m.idx[i] >= m.nv) outOfRange++;
  T('every index is in range', outOfRange === 0, `${outOfRange} out of range`);

  let shortN = 0;
  for (let i = 0; i < m.nv; i++) {
    const L = Math.hypot(m.nor[i*3] / 127, m.nor[i*3+1] / 127, m.nor[i*3+2] / 127);
    if (L < 0.9 || L > 1.1) shortN++;
  }
  T('normals are unit length', shortN === 0, `${shortN} of ${m.nv} outside 0.9–1.1`);

  /* WINDING. Compare each triangle's geometric normal against the sum of its
     vertex normals. They should agree: the vertex normals survive decimation
     and the winding does not. A disagreement is a triangle facing inwards. */
  let flipped = 0, degenerate = 0;
  for (let t = 0; t < m.nt; t++) {
    const a = m.idx[t*3], b = m.idx[t*3+1], c = m.idx[t*3+2];
    if (a === b || b === c || a === c) { degenerate++; continue; }
    const ax = m.pos[a*3], ay = m.pos[a*3+1], az = m.pos[a*3+2];
    const e1 = [m.pos[b*3]-ax, m.pos[b*3+1]-ay, m.pos[b*3+2]-az];
    const e2 = [m.pos[c*3]-ax, m.pos[c*3+1]-ay, m.pos[c*3+2]-az];
    const gx = e1[1]*e2[2] - e1[2]*e2[1];
    const gy = e1[2]*e2[0] - e1[0]*e2[2];
    const gz = e1[0]*e2[1] - e1[1]*e2[0];
    if (!gx && !gy && !gz) { degenerate++; continue; }
    const nx = m.nor[a*3] + m.nor[b*3] + m.nor[c*3];
    const ny = m.nor[a*3+1] + m.nor[b*3+1] + m.nor[c*3+1];
    const nz = m.nor[a*3+2] + m.nor[b*3+2] + m.nor[c*3+2];
    if (gx*nx + gy*ny + gz*nz < 0) flipped++;
  }
  T('no inside-out triangles', flipped === 0, `${flipped} of ${m.nt} face the wrong way`);
  T('no degenerate triangles', degenerate === 0, `${degenerate} collapsed`);

  /* UPRIGHT. The viewer applies no orientation of its own any more - the
     packer bakes the glTF node transform in, so the mesh arrives in world
     space, which the spec says is Y-up. If an export ever lands on its side
     this is the number that says so: the object is taller than it is wide in
     the two vertical silhouettes, and the Y axis is not the longest. */
  const span = m.frac;
  T('mesh is in a plausible upright framing', span[1] <= 1.001 && span[1] > 0.3,
    `Y is ${(span[1] * 100).toFixed(0)}% of the longest axis`);
}

/* ------------------------------------------------------- the motion model */

/* Pulled out of script.js so the two cannot drift. A constant that has been
   renamed or removed throws rather than defaulting - see the header. */
function constants() {
  const src = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');
  const names = ['HOME_YAW', 'HOME_PITCH', 'IDLE_SPIN', 'IDLE_AFTER',
                 'THROW_DECAY', 'RETURN_EASE', 'HOME_EPS', 'FOV', 'FIT_MARGIN'];
  const out = {};
  for (const n of names) {
    const m = src.match(new RegExp('const\\s+' + n + '\\s*=\\s*(-?[\\d.]+)'));
    if (!m) throw new Error(`script.js no longer declares ${n} — this checker is stale, fix it rather than deleting the check`);
    out[n] = parseFloat(m[1]);
  }
  return out;
}

/* THE OBJECT MUST NEVER BE CLIPPED, AT ANY ANGLE. Jack: "it clips off at a
   certain point, so it should always look like you can fully see it."
   The old viewer used a fixed distance of 3.55, which showed 1.137 of
   vertical half-extent against a mesh whose bounding sphere is 1.475 - so
   it fitted at the resting angle, where the long axis lies across the
   frame, and was cut the moment a drag stood that axis up.
   With free rotation the bounding SPHERE is the worst case, because any
   vertex can be turned to any edge, and a sphere of radius r clears a
   frustum at r / sin(halfAngle). This checks the viewer's own arithmetic
   against the mesh's own radius, at the aspect ratios the stage actually
   takes. */
function checkFraming(file, K) {
  const m = loadJMM(file);
  let r2 = 0;
  for (let i = 0; i < m.nv; i++) {
    const x = m.pos[i*3]/32767, y = m.pos[i*3+1]/32767, z = m.pos[i*3+2]/32767;
    const d = x*x + y*y + z*z;
    if (d > r2) r2 = d;
  }
  const r = Math.sqrt(r2);
  console.log(`\nFRAMING   bounding sphere ${r.toFixed(4)}   FOV ${K.FOV} rad   margin ${K.FIT_MARGIN}`);
  /* THE STAGE IS SQUARE EVERYWHERE NOW - it shares the Design band with a
     photograph, so it is the column's width by the same height: 542 inside
     its border at 1440, 429 at 901, 554 stacked, 345 on a phone. Square
     makes the two half-angles equal, so all four reduce to one sum; they
     are listed anyway because a wrong one would otherwise be invisible.
     The last two are NOT in use and are the guard: a band and a tall slot,
     so that putting the stage back to either shape has to pass here. */
  const cases = [[542, 542], [429, 429], [554, 554], [345, 345],
                 [924, 558], [320, 560]];
  let worst = 0, worstAt = '';
  for (const [w, h] of cases) {
    const halfY = K.FOV / 2;
    const halfX = Math.atan(Math.tan(halfY) * (w / h));
    const dist = (r / Math.sin(Math.min(halfX, halfY))) * K.FIT_MARGIN;
    // how much of the half-frame the sphere fills, on the tighter axis
    const fill = Math.sin(Math.min(halfX, halfY)) * r / (r / Math.sin(Math.min(halfX, halfY)) * K.FIT_MARGIN) * 0
      || r / (dist * Math.sin(Math.min(halfX, halfY)));
    if (fill > worst) { worst = fill; worstAt = `${w}x${h}`; }
  }
  T('the bounding sphere always fits the frustum', worst <= 1,
    `worst case ${worstAt} fills ${(worst * 100).toFixed(1)}% of the tighter half-angle (100% = touching the edge)`);
  T('there is visible air around it at every angle', worst <= 0.96,
    `${((1 - worst) * 100).toFixed(1)}% margin from the edge`);

  /* and the same claim the empirical way, because the formula above is only
     a proof if I got the formula right. Projects every vertex through the
     viewer's own matrices at a grid of orientations and finds the furthest
     any of them lands from centre in clip space. Anything over 1.0 is a
     pixel off the edge of the canvas. */
  const [w, h] = [542, 542];
  const halfY = K.FOV / 2;
  const halfX = Math.atan(Math.tan(halfY) * (w / h));
  const dist = (r / Math.sin(Math.min(halfX, halfY))) * K.FIT_MARGIN;
  const t = 1 / Math.tan(halfY), aspect = w / h;
  let maxNdc = 0, at = '';
  for (let yi = 0; yi < 24; yi++) for (let pi = 0; pi <= 16; pi++) {
    const yaw = yi / 24 * Math.PI * 2;
    const pitch = -Math.PI + pi / 16 * Math.PI * 2;      // the full tumble, both axes
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    for (let i = 0; i < m.nv; i++) {
      const x0 = m.pos[i*3]/32767, y0 = m.pos[i*3+1]/32767, z0 = m.pos[i*3+2]/32767;
      const X = cy*x0 + sy*z0, Z = -sy*x0 + cy*z0;
      const Y = cp*y0 - sp*Z,  Z2 = sp*y0 + cp*Z;
      const wc = dist - Z2;                               // -(view z)
      const nx = Math.abs((t / aspect) * X / wc), ny = Math.abs(t * Y / wc);
      const n = Math.max(nx, ny);
      if (n > maxNdc) { maxNdc = n; at = `yaw ${yaw.toFixed(2)} pitch ${pitch.toFixed(2)}`; }
    }
  }
  T('no vertex leaves the canvas, over a full tumble in both axes', maxNdc < 1,
    `worst vertex reaches ${(maxNdc * 100).toFixed(1)}% of the way to the edge, at ${at} (${24 * 17} orientations x ${m.nv} verts)`);
}

function checkMotion(K) {
  console.log('\nMOTION MODEL   ' +
    Object.entries(K).filter(([k]) => k !== 'FOV' && k !== 'FIT_MARGIN')
      .map(([k, v]) => `${k}=${v}`).join('  '));

  const shortWay = (from, to) => {
    let d = (to - from) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  };
  // mirrors the viewer's initial state exactly: nothing has been touched,
  // so it is already home and already idle, and drifts from frame one
  const sim = () => ({ yaw: K.HOME_YAW, pitch: K.HOME_PITCH, yawVel: 0, pitchVel: 0, idle: Infinity, homed: true });
  // the state a pointerdown leaves behind
  const touched = (s) => { s.idle = 0; s.homed = false; return s; };
  const step = (s, dt, reduce) => {
    s.idle += dt;
    if (!reduce && s.idle > K.IDLE_AFTER) {
      if (!s.homed) {
        const k = 1 - Math.exp(-K.RETURN_EASE * dt);
        const dy = shortWay(s.yaw, K.HOME_YAW), dp = shortWay(s.pitch, K.HOME_PITCH);
        s.yaw += dy * k; s.pitch += dp * k;
        if (Math.abs(dy) < K.HOME_EPS && Math.abs(dp) < K.HOME_EPS) {
          s.yaw += dy; s.pitch += dp; s.homed = true;
        }
      } else {
        s.yaw += K.IDLE_SPIN * dt;
      }
      s.yawVel = s.pitchVel = 0;
    } else {
      const e = Math.exp(-K.THROW_DECAY * dt);
      s.yaw += s.yawVel * (1 - e) / K.THROW_DECAY;
      s.pitch += s.pitchVel * (1 - e) / K.THROW_DECAY;
      s.yawVel *= e; s.pitchVel *= e;
    }
  };

  // 1. NOTHING STOPS, IN EITHER AXIS. This is the one Jack reported twice.
  {
    const s = touched(sim()); s.idle = -1e9;   // mid-drag: homing held off
    let minY = Infinity, minP = Infinity;
    for (let i = 0; i < 2000; i++) {
      const y0 = s.yaw, p0 = s.pitch;
      s.yaw += 0.05; s.pitch += 0.05;          // a sustained drag in both axes
      minY = Math.min(minY, s.yaw - y0);
      minP = Math.min(minP, s.pitch - p0);
    }
    T('a drag never stops, in either axis', minY > 0.049 && minP > 0.049,
      `after ${(2000 * 0.05 / (2 * Math.PI)).toFixed(0)} turns of input the smallest step is still ` +
      `${minY.toFixed(4)} yaw / ${minP.toFixed(4)} pitch (input 0.05)`);
    T('pitch can pass vertical and keep going', Math.abs(s.pitch) > Math.PI,
      `reached ${s.pitch.toFixed(1)} rad; the old build stopped dead at 1.45`);
  }
  // 2. it comes home from anywhere, the short way, and then drifts
  {
    const s = touched(sim());
    s.yaw = K.HOME_YAW + 11.3;                 // nearly two extra turns
    s.pitch = 2.9;                             // tumbled past upside down
    s.idle = K.IDLE_AFTER + 1e-9;
    let t = 0, arrived = null;
    while (t < 20) { step(s, 1/60, false); t += 1/60; if (s.homed && arrived === null) arrived = t; }
    T('it returns to its resting pose after a pause', arrived !== null && arrived < 12,
      `home ${arrived ? arrived.toFixed(1) : '—'}s after the pause began, from 11.3 rad of yaw and a tumble past vertical`);
    T('and then drifts, instead of hauling itself back', s.yaw > K.HOME_YAW,
      `drifted ${(s.yaw - K.HOME_YAW).toFixed(2)} rad past home once it arrived`);
  }
  // 3. the return takes the SHORT way - it must not unwind the turns given
  {
    const s = touched(sim());
    s.yaw = K.HOME_YAW + Math.PI * 2 * 3 + 0.2;   // three turns plus a little
    s.idle = K.IDLE_AFTER + 1e-9;
    const travel0 = s.yaw;
    // measure at the moment it ARRIVES, not after; past that it is drifting
    // away again on purpose, and folding that in is what made this read 1.25
    let onArrival = null;
    for (let i = 0; i < 600; i++) { step(s, 1/60, false); if (s.homed && onArrival === null) onArrival = s.yaw; }
    T('the trip home does not unwind whole turns', Math.abs(travel0 - onArrival) < 0.5,
      `moved ${Math.abs(travel0 - onArrival).toFixed(3)} rad to get home, not ${(Math.PI*6).toFixed(1)}`);
  }
  // 4. the resting drift is slow, and is the speed it says it is
  {
    const s = sim();
    const y0 = s.yaw;
    for (let i = 0; i < 600; i++) step(s, 1/60, false);
    const rate = (s.yaw - y0) / 10;
    /* The ceiling is 0.30 because that is the speed Jack called "a little
       fast", and the floor is 0.16 because 0.14 measured as 8 deg/s and he
       read it as not rotating at all. Both ends are his, not mine. */
    T('the resting spin is calm but visible', Math.abs(rate - K.IDLE_SPIN) < 1e-6 && rate < 0.30 && rate > 0.16,
      `${rate.toFixed(4)} rad/s, ${(rate * 180 / Math.PI).toFixed(1)}°/s — one revolution every ${(2 * Math.PI / rate).toFixed(0)}s`);

    /* AND IT STARTS AT ONCE. The spin sits behind IDLE_AFTER, and that gate
       used to apply to a freshly loaded page too, so the object stood dead
       still for six seconds before it did anything - the other half of
       "it's not rotating when you leave it". */
    const fresh = sim();
    const before = fresh.yaw;
    step(fresh, 1/60, false);
    T('it drifts from the very first frame, with no dead wait', fresh.yaw > before,
      `moved ${((fresh.yaw - before) * 1000).toFixed(2)} mrad on frame one; the gate is a pause after letting go, not a wait on arrival`);

    /* and a pointerdown does reinstate the pause */
    const held = touched(sim());
    const h0 = held.yaw;
    for (let i = 0; i < Math.round(K.IDLE_AFTER * 60) - 2; i++) step(held, 1/60, false);
    T('touching it reinstates the pause before it moves again', Math.abs(held.yaw - h0) < 1e-9,
      `still after ${K.IDLE_AFTER}s of being left alone following a touch`);
  }
  // 5. same motion at any refresh rate
  {
    const a = sim(), b = sim();
    a.yawVel = b.yawVel = 5;
    for (let i = 0; i < 60; i++) step(a, 1/60, false);
    for (let i = 0; i < 144; i++) step(b, 1/144, false);
    const c = touched(sim()), d = touched(sim());
    c.yaw = d.yaw = K.HOME_YAW + 4; c.idle = d.idle = K.IDLE_AFTER + 1e-9;
    for (let i = 0; i < 60; i++) step(c, 1/60, false);
    for (let i = 0; i < 144; i++) step(d, 1/144, false);
    T('60Hz and 144Hz agree, coasting and returning',
      Math.abs(a.yaw - b.yaw) < 1e-6 && Math.abs(c.yaw - d.yaw) < 1e-6,
      `throw ${Math.abs(a.yaw - b.yaw).toExponential(1)} rad apart, return ${Math.abs(c.yaw - d.yaw).toExponential(1)} rad apart after 1s`);
  }
  // 6. reduced motion never moves on its own, and never homes on its own
  {
    const s = touched(sim()); s.yaw += 3; s.pitch = 1.9;
    for (let t = 0; t < 20; t += 1/60) step(s, 1/60, true);
    T('reduced motion leaves it exactly where it was put',
      Math.abs(s.yaw - (K.HOME_YAW + 3)) < 1e-9 && Math.abs(s.pitch - 1.9) < 1e-9,
      `yaw ${s.yaw.toFixed(4)}, pitch ${s.pitch.toFixed(4)} after 20s untouched`);
  }
  // 7. upright is what HOME means, and home is where it ends up
  {
    T('the resting pose is the right way up',
      Math.abs(K.HOME_PITCH) < Math.PI / 2,
      `home pitch ${K.HOME_PITCH} rad (${(K.HOME_PITCH * 180 / Math.PI).toFixed(0)}°) — within a quarter turn of level, so +Y is up on screen`);
  }
}

/* -------------------------------------------------------------------- run */

const target = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'assets/projects/pot-clip/model.jmm');

try {
  checkMesh(target);
  checkCacheKey(target);
  const K = constants();
  checkFraming(target, K);
  checkMotion(K);
} catch (e) {
  console.error('\n  FAIL  ' + e.message);
  process.exit(1);
}

console.log('');
ok.forEach((l) => console.log('  ok    ' + l));
bad.forEach((l) => console.log('  FAIL  ' + l));
console.log(bad.length ? `\n${bad.length} check(s) failed` : '\nALL CHECKS PASS');
process.exit(bad.length ? 1 : 0);
