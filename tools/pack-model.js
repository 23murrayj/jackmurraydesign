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
  // rebuild triangles, dropping any that collapsed into one or two cells
  const seen = new Set(); const tris = [];
  for (let t = 0; t < idx.length; t += 3) {
    const a = key[idx[t]], b = key[idx[t+1]], c = key[idx[t+2]];
    if (a === b || b === c || a === c) continue;
    const s = [a,b,c].sort((x,y)=>x-y).join(',');
    if (seen.has(s)) continue;
    seen.add(s);
    tris.push(a, b, c);
  }
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

const [, , inFile, outFile, gridArg] = process.argv;
const grid = +(gridArg || 80);
const { json, bin } = readGLB(inFile);
const p = json.meshes[0].primitives[0];
const d = decimate(
  accessor(json, bin, p.attributes.POSITION),
  accessor(json, bin, p.attributes.NORMAL),
  accessor(json, bin, p.indices), grid);

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
