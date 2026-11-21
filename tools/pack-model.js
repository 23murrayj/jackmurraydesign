#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   GLB -> the .jmm mesh SECTION 19 of script.js reads.

     node tools/pack-model.js <in.glb> <out.jmm> [grid]

   WHY THIS EXISTS. Jack's Blender export is 18.3MB: 684,604 triangles, no
   textures, one metallic grey material. That is about a hundred times more
   geometry than a 600px viewport resolves, and shipping it would have cost
   twelve times the entire rest of the site. The page gets 385KB instead.

   WHAT IT DOES, IN ORDER.
   1. Reads POSITION / NORMAL / indices straight out of the GLB. No glTF
      library: this file needs four accessors out of one primitive, and a
      parser for that is thirty lines.
   2. Decimates by vertex clustering on a grid, averaging each cell. Not
      quadric edge-collapse, because this form has no sharp creases to
      protect - every feature is a smooth fillet, which is exactly the case
      where a grid average is indistinguishable from the expensive algorithm.
      `grid` is the number of cells across the longest axis; 80 gives 37,724
      triangles, which is the number in the repo. 64 gives 24,485 and is
      visibly fine too. Above ~128 the vertex count passes 65,535 and uint16
      indices stop being possible, which the script refuses rather than
      silently truncating.
   3. Quantises positions to int16 across the bounding box and normals to
      int8. On a ~100mm object a 16-bit step is about 15 microns.
   4. Writes a 32-byte header that carries its own index offset. The first
      version computed the padding from the normals block alone, which is
      2 mod 4 whenever the vertex count is odd - so the reader and the writer
      could disagree about where the indices start. Storing the offset means
      they cannot.

   The output is centred on its bounding box and scaled so the longest axis
   is 1, so the viewer needs no per-model framing constants.
   --------------------------------------------------------------------------- */

const fs = require('fs');

function readGLB(file) {
  const b = fs.readFileSync(file);
  let off = 12, json = null, bin = null;
  while (off < b.length) {
    const len = b.readUInt32LE(off), type = b.toString('ascii', off + 4, off + 8);
    const body = b.subarray(off + 8, off + 8 + len);
    if (type === 'JSON') json = JSON.parse(body.toString('utf8'));
    else bin = body;
    off += 8 + len + ((4 - len % 4) % 4);
  }
  return { json, bin };
}

const CT = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
const NC = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
function accessor(g, bin, i) {
  const a = g.accessors[i], bv = g.bufferViews[a.bufferView];
  const TA = CT[a.componentType], n = NC[a.type];
  const base = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const stride = bv.byteStride;
  if (!stride || stride === TA.BYTES_PER_ELEMENT * n) {
    return new TA(bin.buffer, bin.byteOffset + base, a.count * n);
  }
  const out = new TA(a.count * n);                 // interleaved: de-stride
  for (let k = 0; k < a.count; k++) {
    const src = new TA(bin.buffer, bin.byteOffset + base + k * stride, n);
    out.set(src, k * n);
  }
  return out;
}

function decimate(pos, nor, idx, grid) {
  let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3)
    for (let c = 0; c < 3; c++) {
      if (pos[i + c] < min[c]) min[c] = pos[i + c];
      if (pos[i + c] > max[c]) max[c] = pos[i + c];
    }
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const cell = Math.max(size[0], size[1], size[2]) / grid;
  const gx = Math.ceil(size[0] / cell) + 1, gy = Math.ceil(size[1] / cell) + 1;
  const key = new Int32Array(pos.length / 3);
  const map = new Map();                       // cell -> representative index
  const acc = [];                              // [px,py,pz,nx,ny,nz,count]
  for (let v = 0; v < pos.length / 3; v++) {
    const cx = Math.floor((pos[v*3]   - min[0]) / cell);
    const cy = Math.floor((pos[v*3+1] - min[1]) / cell);
    const cz = Math.floor((pos[v*3+2] - min[2]) / cell);
    const k = (cz * gy + cy) * gx + cx;
    let r = map.get(k);
    if (r === undefined) { r = acc.length; map.set(k, r); acc.push([0,0,0,0,0,0,0]); }
    const a = acc[r];
    a[0] += pos[v*3]; a[1] += pos[v*3+1]; a[2] += pos[v*3+2];
    a[3] += nor[v*3]; a[4] += nor[v*3+1]; a[5] += nor[v*3+2];
    a[6]++;
    key[v] = r;
  }
  const outPos = new Float32Array(acc.length * 3);
  const outNor = new Float32Array(acc.length * 3);
  for (let r = 0; r < acc.length; r++) {
    const a = acc[r], n = a[6];
    outPos[r*3] = a[0]/n; outPos[r*3+1] = a[1]/n; outPos[r*3+2] = a[2]/n;
    let L = Math.hypot(a[3], a[4], a[5]) || 1;
    outNor[r*3] = a[3]/L; outNor[r*3+1] = a[4]/L; outNor[r*3+2] = a[5]/L;
  }
  /* Rebuild triangles, dropping any that collapsed into one or two cells.
     WINDING HAS TO BE RE-DERIVED, NOT INHERITED, and that was a real bug
     rather than a precaution. Clustering moves all three corners to cell
     centroids, and on a thin or highly curved patch the moved triangle can
     come out facing the other way - the source winding was right for the
     source positions and means nothing for the new ones. With CULL_FACE on
     every such triangle is a pinhole, and the object rendered covered in
     small dark specks and scratches.
     So each surviving triangle is oriented against the averaged vertex
     normals, which the cluster pass has already computed and which are the
     one piece of orientation information that survives decimation intact.
     A near-degenerate sliver, where the geometric normal is noise, is
     dropped rather than guessed at - it is a few square microns of surface
     and a coin flip on which way it faces. */
  const seen = new Set(); const tris = [];
  let flipped = 0, slivers = 0;
  for (let t = 0; t < idx.length; t += 3) {
    const a = key[idx[t]], b = key[idx[t+1]], c = key[idx[t+2]];
    if (a === b || b === c || a === c) continue;
    const s = [a,b,c].sort((x,y)=>x-y).join(',');
    if (seen.has(s)) continue;
    seen.add(s);
    const ax = outPos[a*3], ay = outPos[a*3+1], az = outPos[a*3+2];
    const e1 = [outPos[b*3]-ax, outPos[b*3+1]-ay, outPos[b*3+2]-az];
    const e2 = [outPos[c*3]-ax, outPos[c*3+1]-ay, outPos[c*3+2]-az];
    const gx = e1[1]*e2[2] - e1[2]*e2[1];
    const gy = e1[2]*e2[0] - e1[0]*e2[2];
    const gz = e1[0]*e2[1] - e1[1]*e2[0];
    const area = Math.hypot(gx, gy, gz);
    if (area < 1e-12) { slivers++; continue; }
    const nx = outNor[a*3] + outNor[b*3] + outNor[c*3];
    const ny = outNor[a*3+1] + outNor[b*3+1] + outNor[c*3+1];
    const nz = outNor[a*3+2] + outNor[b*3+2] + outNor[c*3+2];
    if (gx*nx + gy*ny + gz*nz < 0) { tris.push(a, c, b); flipped++; }
    else tris.push(a, b, c);
  }
  if (flipped || slivers) console.log(`  winding: ${flipped} triangles re-oriented, ${slivers} slivers dropped`);
  // drop vertices no surviving triangle references
  const used = new Int32Array(acc.length).fill(-1);
  for (const v of tris) used[v] = 1;
  let n = 0; for (let i = 0; i < used.length; i++) if (used[i] === 1) used[i] = n++;
  const P = new Float32Array(n * 3), N = new Float32Array(n * 3);
  for (let i = 0; i < used.length; i++) if (used[i] >= 0) {
    P.set(outPos.subarray(i*3, i*3+3), used[i]*3);
    N.set(outNor.subarray(i*3, i*3+3), used[i]*3);
  }
  const I = new Uint32Array(tris.length);
  for (let i = 0; i < tris.length; i++) I[i] = used[tris[i]];
  return { pos: P, nor: N, idx: I, min, size };
}

/* THE NODE TRANSFORM IS NOT OPTIONAL, AND IGNORING IT COST A WHOLE
   ORIENTATION BUG. A glTF mesh lives in its node's local space; the node
   carries the transform that puts it in the world. This script read the
   accessors straight out of the file and threw that away, so what it
   wrote was whatever space the exporter happened to leave the mesh in.

   It got away with it for exactly one file. Blender's exporter bakes the
   Z-up -> Y-up conversion into the root node as a +90 deg X rotation, so
   3DModel.glb's mesh data was still Z-up and the viewer's own `ZUP`
   constant - a -90 deg X - put it back. Two errors cancelling, which is
   the worst kind of working.

   AlessiPlease2.glb carries [0,0,-1,0] instead, a 180 deg turn about Z,
   because the object is rotated in the scene rather than by the export.
   Dropped, that is the clip standing on its head.

   So: compose T * R * S down the scene graph, transform the positions by
   it and the normals by its rotation (uniform scale here, so the
   inverse-transpose is the rotation itself), and emit in glTF WORLD space,
   which the spec says is Y-up. The viewer then needs no per-file constant
   and `ZUP` is gone with it. A flipped determinant would also need the
   winding reversed; none of these exports has one, and the script says so
   rather than silently shipping inside-out triangles. */
function quatMat(q) {
  const [x, y, z, w] = q;
  return [
    1-2*(y*y+z*z), 2*(x*y+z*w),   2*(x*z-y*w),
    2*(x*y-z*w),   1-2*(x*x+z*z), 2*(y*z+x*w),
    2*(x*z+y*w),   2*(y*z-x*w),   1-2*(x*x+y*y),
  ];                                            // column-major 3x3
}
function nodeMatrix(n) {
  if (n.matrix) {                               // column-major 4x4, already composed
    const m = n.matrix;
    return { r: [m[0],m[1],m[2], m[4],m[5],m[6], m[8],m[9],m[10]], t: [m[12],m[13],m[14]] };
  }
  const s = n.scale || [1, 1, 1];
  const r = quatMat(n.rotation || [0, 0, 0, 1]);
  for (let c = 0; c < 3; c++) for (let k = 0; k < 3; k++) r[c*3+k] *= s[c];
  return { r, t: n.translation || [0, 0, 0] };
}
function mulRT(a, b) {                          // a applied after b
  const r = new Array(9);
  for (let c = 0; c < 3; c++) for (let k = 0; k < 3; k++)
    r[c*3+k] = a[k] * b[c*3] + a[3+k] * b[c*3+1] + a[6+k] * b[c*3+2];
  const t = [0, 1, 2].map((k) =>
    a[k] * b.t[0] + a[3+k] * b.t[1] + a[6+k] * b.t[2] + a.t[k]);
  r.t = t;
  return Object.assign(r, { t });
}
// the world transform of the first node that carries a mesh
function meshWorldTransform(g) {
  const parentOf = new Map();
  (g.nodes || []).forEach((n, i) => (n.children || []).forEach((c) => parentOf.set(c, i)));
  let idx = (g.nodes || []).findIndex((n) => n.mesh !== undefined);
  if (idx < 0) return null;
  const chain = [];
  for (let i = idx; i !== undefined; i = parentOf.get(i)) chain.unshift(i);
  let acc = { r: [1,0,0, 0,1,0, 0,0,1], t: [0,0,0] };
  for (const i of chain) {
    const m = nodeMatrix(g.nodes[i]);
    const r = new Array(9);
    for (let c = 0; c < 3; c++) for (let k = 0; k < 3; k++)
      r[c*3+k] = acc.r[k]*m.r[c*3] + acc.r[3+k]*m.r[c*3+1] + acc.r[6+k]*m.r[c*3+2];
    const t = [0,1,2].map((k) => acc.r[k]*m.t[0] + acc.r[3+k]*m.t[1] + acc.r[6+k]*m.t[2] + acc.t[k]);
    acc = { r, t };
  }
  return acc;
}
function applyTransform(pos, nor, w) {
  const { r, t } = w;
  // normals take the rotation without the translation. Length is restored
  // per-vertex, which also absorbs any uniform scale in r.
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i], y = pos[i+1], z = pos[i+2];
    pos[i]   = r[0]*x + r[3]*y + r[6]*z + t[0];
    pos[i+1] = r[1]*x + r[4]*y + r[7]*z + t[1];
    pos[i+2] = r[2]*x + r[5]*y + r[8]*z + t[2];
    const nx = nor[i], ny = nor[i+1], nz = nor[i+2];
    let ax = r[0]*nx + r[3]*ny + r[6]*nz;
    let ay = r[1]*nx + r[4]*ny + r[7]*nz;
    let az = r[2]*nx + r[5]*ny + r[8]*nz;
    const L = Math.hypot(ax, ay, az) || 1;
    nor[i] = ax/L; nor[i+1] = ay/L; nor[i+2] = az/L;
  }
}

const [, , inFile, outFile, gridArg] = process.argv;
const grid = +(gridArg || 80);
const { json, bin } = readGLB(inFile);
const p = json.meshes[0].primitives[0];

// Float32Array copies, because the accessor may be a view straight onto the
// GLB's own buffer and applyTransform writes in place.
const rawPos = Float32Array.from(accessor(json, bin, p.attributes.POSITION));
const rawNor = Float32Array.from(accessor(json, bin, p.attributes.NORMAL));
const world = meshWorldTransform(json);
if (world) {
  const r = world.r;
  const det = r[0]*(r[4]*r[8]-r[5]*r[7]) - r[3]*(r[1]*r[8]-r[2]*r[7]) + r[6]*(r[1]*r[5]-r[2]*r[4]);
  if (det < 0) throw new Error('node transform mirrors the mesh (det ' + det.toFixed(3) + '); triangle winding would need reversing');
  applyTransform(rawPos, rawNor, world);
  const rot = (json.nodes.find((n) => n.mesh !== undefined) || {}).rotation;
  if (rot) console.log('  node rotation applied:', rot.map((v) => +v.toFixed(4)).join(', '));
}

const d = decimate(rawPos, rawNor, accessor(json, bin, p.indices), grid);

const nv = d.pos.length / 3, nt = d.idx.length / 3;
if (nv > 65535) throw new Error('too many vertices for uint16 indices: ' + nv);

// centre on the bbox and scale the longest axis to 1, so the viewer needs no
// per-model framing constants
const cen = [d.min[0] + d.size[0]/2, d.min[1] + d.size[1]/2, d.min[2] + d.size[2]/2];
const span = Math.max(d.size[0], d.size[1], d.size[2]);
const half = span / 2;

const header = 32;
const posBytes = nv * 6, norBytes = nv * 3;
const pad = (n) => (4 - (n % 4)) % 4;
// Pad against the ABSOLUTE offset, not the normals block alone: with an odd
// vertex count nv*6 is 2 mod 4 and the index array would land unaligned.
const norPad = pad(header + posBytes + norBytes);
const total = header + posBytes + norBytes + norPad + nt * 6;
const buf = Buffer.alloc(total + pad(total));
buf.write('JMM1', 0, 'ascii');
buf.writeUInt32LE(nv, 4);
buf.writeUInt32LE(nt, 8);
buf.writeFloatLE(half, 12);              // world half-extent of the int16 range
buf.writeFloatLE(d.size[0]/span, 16);    // per-axis fraction, for aspect
buf.writeFloatLE(d.size[1]/span, 20);
buf.writeFloatLE(d.size[2]/span, 24);
buf.writeUInt32LE(header + posBytes + norBytes + norPad, 28);  // where indices start

const P = new Int16Array(nv * 3), N = new Int8Array(nv * 3);
for (let i = 0; i < nv; i++) {
  for (let c = 0; c < 3; c++) {
    const v = (d.pos[i*3+c] - cen[c]) / half;              // -1..1
    P[i*3+c] = Math.max(-32767, Math.min(32767, Math.round(v * 32767)));
    N[i*3+c] = Math.max(-127, Math.min(127, Math.round(d.nor[i*3+c] * 127)));
  }
}
Buffer.from(P.buffer, P.byteOffset, posBytes).copy(buf, header);
Buffer.from(N.buffer, N.byteOffset, norBytes).copy(buf, header + posBytes);
const I = new Uint16Array(d.idx);
Buffer.from(I.buffer, I.byteOffset, nt * 6).copy(buf, header + posBytes + norBytes + norPad);

fs.writeFileSync(outFile, buf);
console.log(`${outFile.split('/').pop()}  ${nv} verts  ${nt} tris  ${(buf.length/1024).toFixed(0)}KB`);
