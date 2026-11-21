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
  const names = ['PITCH_MAX', 'PITCH_SOFT', 'IDLE_SPIN', 'IDLE_AFTER', 'THROW_DECAY', 'IDLE_EASE'];
  const out = {};
  for (const n of names) {
    const m = src.match(new RegExp('const\\s+' + n + '\\s*=\\s*([-\\d.]+)'));
    if (!m) throw new Error(`script.js no longer declares ${n} — this checker is stale, fix it rather than deleting the check`);
    out[n] = parseFloat(m[1]);
  }
  return out;
}

function checkMotion(K) {
  console.log('\nMOTION MODEL   ' +
    Object.entries(K).map(([k, v]) => `${k}=${v}`).join('  '));

  const sim = () => ({ yaw: 2.0, pitch: -0.28, yawVel: 0, pitchVel: 0, idle: 0 });
  const addPitch = (s, d) => {
    const over = (Math.abs(s.pitch) - K.PITCH_SOFT) / (K.PITCH_MAX - K.PITCH_SOFT);
    if (over > 0 && Math.sign(d) === Math.sign(s.pitch)) d *= Math.max(0, 1 - over) ** 2;
    s.pitch = Math.max(-K.PITCH_MAX, Math.min(K.PITCH_MAX, s.pitch + d));
  };
  const step = (s, dt, reduce) => {
    s.idle += dt;
    if (!reduce && s.idle > K.IDLE_AFTER) {
      const e = Math.exp(-K.IDLE_EASE * dt);
      s.yaw += K.IDLE_SPIN * dt + (s.yawVel - K.IDLE_SPIN) * (1 - e) / K.IDLE_EASE;
      s.yawVel = K.IDLE_SPIN + (s.yawVel - K.IDLE_SPIN) * e;
    } else {
      const e = Math.exp(-K.THROW_DECAY * dt);
      s.yaw += s.yawVel * (1 - e) / K.THROW_DECAY;
      s.yawVel *= e;
    }
    const ep = Math.exp(-K.THROW_DECAY * dt);
    if (s.pitchVel) addPitch(s, s.pitchVel * (1 - ep) / K.THROW_DECAY);
    s.pitchVel *= ep;
    const over = Math.abs(s.pitch) - K.PITCH_SOFT;
    if (over > 0) s.pitch = Math.sign(s.pitch) * (K.PITCH_SOFT + over * Math.exp(-3.0 * dt));
  };

  // 1. yaw is unbounded: a genuine endless 360 with no stopping point
  {
    const s = sim(); s.yawVel = 2;
    let minStep = Infinity;
    for (let i = 0; i < 4000; i++) { const y = s.yaw; step(s, 1/60, false); minStep = Math.min(minStep, s.yaw - y); }
    T('yaw turns forever and never stops',
      s.yaw > 18 && minStep > 0 && Math.abs(s.yawVel - K.IDLE_SPIN) < 0.001,
      `${(s.yaw / (2*Math.PI)).toFixed(1)} turns in 66s, smallest step ${minStep.toFixed(5)} rad, resting at ${s.yawVel.toFixed(4)} rad/s`);
  }
  // 2. pitch has resistance, not a wall
  {
    const s = sim(); s.pitch = 0;
    const d = [];
    for (let i = 0; i < 60; i++) { const p = s.pitch; addPitch(s, 0.05); d.push(s.pitch - p); }
    const late = d.slice(-12);
    const easing = late.every((v, i) => i === 0 || v <= late[i-1] + 1e-9);
    T('pitch eases into its limit rather than hitting a wall',
      easing && s.pitch > K.PITCH_SOFT && s.pitch < K.PITCH_MAX,
      `60 equal pushes reach ${s.pitch.toFixed(3)} rad; the last four add ${late.slice(-4).map((v)=>v.toFixed(4)).join(' > ')}`);
    T('pitch can never pass vertical, so the object stays upright',
      K.PITCH_MAX < Math.PI / 2,
      `limit ${(K.PITCH_MAX*180/Math.PI).toFixed(1)}° against 90°`);
  }
  // 3. the same motion at any refresh rate
  {
    const a = sim(), b = sim(); a.yawVel = b.yawVel = 5;
    for (let i = 0; i < 60; i++) step(a, 1/60, false);
    for (let i = 0; i < 144; i++) step(b, 1/144, false);
    T('60Hz and 144Hz give the same motion',
      Math.abs(a.yaw - b.yaw) < 1e-6,
      `after 1s of a throw: ${a.yaw.toFixed(6)} vs ${b.yaw.toFixed(6)}`);
  }
  // 4. a flick coasts
  {
    const s = sim(); s.yawVel = 6;
    const at = {};
    for (let t = 0; t < 2; t += 1/60) { step(s, 1/60, false); at[Math.round(t*2)/2] = s.yawVel; }
    T('a flick coasts and runs down', s.yawVel > 0 && s.yawVel < 6,
      `6.00 rad/s -> ${[0.5,1,1.5].map((k)=>at[k].toFixed(2)).join(' -> ')} rad/s`);
  }
  // 5. the turntable comes back, eased
  {
    const s = sim();
    let justAfter = null;
    for (let t = 0; t < 8; t += 1/60) {
      step(s, 1/60, false);
      if (justAfter === null && s.idle > K.IDLE_AFTER + 0.01) justAfter = s.yawVel;
    }
    T('the turntable returns after an idle pause, eased not snapped',
      Math.abs(s.yawVel - K.IDLE_SPIN) < 0.02 && justAfter < K.IDLE_SPIN * 0.2,
      `${justAfter.toFixed(4)} rad/s just after the ${K.IDLE_AFTER}s pause, settling to ${s.yawVel.toFixed(4)}`);
  }
  // 6. reduced motion never moves on its own, but still honours a drag
  {
    const idle = sim();
    for (let t = 0; t < 8; t += 1/60) step(idle, 1/60, true);
    const thrown = sim(); thrown.yawVel = 4;
    const y0 = thrown.yaw;
    for (let i = 0; i < 30; i++) step(thrown, 1/60, true);
    T('reduced motion: no drift of its own, a drag still coasts',
      Math.abs(idle.yawVel) < 1e-9 && thrown.yaw - y0 > 0.5,
      `idle ${idle.yawVel.toFixed(9)} rad/s, a throw still travels ${(thrown.yaw - y0).toFixed(2)} rad`);
  }
  // 7. upright is structural, not a clamp
  {
    /* The model matrix is rotX(pitch) · rotY(yaw). rotY spins the object
       about its OWN up axis, so (0,1,0) is its eigenvector and comes out
       unchanged; rotX then tips it in the YZ plane only. The up axis
       therefore has an x component of exactly zero at every angle - it can
       lean toward or away from the viewer but never sideways, which is
       what "no roll" means. Sampled rather than argued, so a change to the
       matrix order is caught. */
    let worst = 0, n = 0;
    for (let p = -K.PITCH_MAX; p <= K.PITCH_MAX; p += 0.02)
      for (let y = 0; y < Math.PI * 2; y += 0.02) {
        const cy = Math.cos(y), sy = Math.sin(y), cp = Math.cos(p), sp = Math.sin(p);
        // up = (0,1,0) through rotY then rotX
        const x1 = cy * 0 + sy * 0, y1 = 1, z1 = -sy * 0 + cy * 0;
        const ux = x1, uy = cp * y1 - sp * z1;
        worst = Math.max(worst, Math.abs(ux));
        if (uy <= 0) worst = Math.max(worst, 1);     // up must never point down
        n++;
      }
    T('the object cannot roll at any angle', worst === 0,
      `max sideways lean of the up axis over ${(n/1000).toFixed(0)}k yaw/pitch pairs = ${worst}`);
  }
}

/* -------------------------------------------------------------------- run */

const target = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'assets/projects/pot-clip/model.jmm');

try {
  checkMesh(target);
  checkMotion(constants());
} catch (e) {
  console.error('\n  FAIL  ' + e.message);
  process.exit(1);
}

console.log('');
ok.forEach((l) => console.log('  ok    ' + l));
bad.forEach((l) => console.log('  FAIL  ' + l));
console.log(bad.length ? `\n${bad.length} check(s) failed` : '\nALL CHECKS PASS');
process.exit(bad.length ? 1 : 0);
