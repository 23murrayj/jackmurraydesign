#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   .jmm -> .glb, so Google's <model-viewer> can be shown the EXACT same mesh
   the hand-rolled viewer draws.

     node tools/jmm-to-glb.js <in.jmm> <out.glb>

   WHY IT CONVERTS BACK rather than reusing Jack's original export. The
   comparison is meant to isolate the RENDERER - our procedural studio
   against model-viewer's image-based lighting - and handing model-viewer
   the 23MB original would compare the geometry too, and flatter it for a
   reason that has nothing to do with shading. Same 38,380 triangles, same
   normals, same material intent: the only variable left is how it is lit.
   (It would also be 23MB on a portfolio page, which is not a thing to put
   in front of a visitor even temporarily.)

   Dequantises int16 positions and int8 normals back to float32, because a
   quantised glTF needs KHR_mesh_quantization and that is a compatibility
   argument this file does not need to have. ~690KB, which is fine for a
   temporary side-by-side and is NOT fine to keep - see the note in
   CLAUDE.md about taking this comparison back out.

   The material mirrors the GLB Jack exported: metallic 0.85, roughness
   0.35, baseColor from the same grey. Matching those matters - most of
   what makes the two look different should be the lighting model, not two
   different ideas of how shiny the object is.
   --------------------------------------------------------------------------- */

const fs = require('fs');

function loadJMM(file) {
  const buf = fs.readFileSync(file);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
  const dv = new DataView(ab);
  const tag = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (tag !== 'JMM1') throw new Error('not a JMM1 mesh');
  const nv = dv.getUint32(4, true), nt = dv.getUint32(8, true);
  const idxOff = dv.getUint32(28, true);
  return {
    nv, nt,
    pos: new Int16Array(ab, 32, nv * 3),
    nor: new Int8Array(ab, 32 + nv * 6, nv * 3),
    idx: new Uint16Array(ab, idxOff, nt * 3),
  };
}

const [, , inFile, outFile] = process.argv;
if (!inFile || !outFile) { console.error('usage: node tools/jmm-to-glb.js <in.jmm> <out.glb>'); process.exit(1); }

const m = loadJMM(inFile);

const pos = new Float32Array(m.nv * 3);
const nor = new Float32Array(m.nv * 3);
const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < m.nv; i++) {
  for (let c = 0; c < 3; c++) {
    const v = m.pos[i * 3 + c] / 32767;
    pos[i * 3 + c] = v;
    if (v < min[c]) min[c] = v;
    if (v > max[c]) max[c] = v;
  }
  let nx = m.nor[i*3] / 127, ny = m.nor[i*3+1] / 127, nz = m.nor[i*3+2] / 127;
  const L = Math.hypot(nx, ny, nz) || 1;        // glTF requires unit normals
  nor[i*3] = nx / L; nor[i*3+1] = ny / L; nor[i*3+2] = nz / L;
}
const idx = new Uint16Array(m.idx);

const pad4 = (n) => (4 - (n % 4)) % 4;
const posBytes = pos.byteLength, norBytes = nor.byteLength, idxBytes = idx.byteLength;
const idxOffset = posBytes + norBytes;
const binLen = idxOffset + idxBytes + pad4(idxBytes);

const json = {
  asset: { version: '2.0', generator: 'jmm-to-glb (jackmurraydesign.com, comparison build)' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: 'pot-clip' }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
  materials: [{
    name: 'Material.001',
    pbrMetallicRoughness: {
      baseColorFactor: [0.5209920406341553, 0.5457251667976379, 0.5840787887573242, 1],
      metallicFactor: 0.85,
      roughnessFactor: 0.35,
    },
    doubleSided: true,
  }],
  accessors: [
    { bufferView: 0, componentType: 5126, count: m.nv, type: 'VEC3', min, max },
    { bufferView: 1, componentType: 5126, count: m.nv, type: 'VEC3' },
    { bufferView: 2, componentType: 5123, count: idx.length, type: 'SCALAR' },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: posBytes, target: 34962 },
    { buffer: 0, byteOffset: posBytes, byteLength: norBytes, target: 34962 },
    { buffer: 0, byteOffset: idxOffset, byteLength: idxBytes, target: 34963 },
  ],
  buffers: [{ byteLength: binLen }],
};

let jsonStr = JSON.stringify(json);
jsonStr += ' '.repeat(pad4(jsonStr.length));        // chunks are 4-byte aligned
const jsonBuf = Buffer.from(jsonStr, 'utf8');

const bin = Buffer.alloc(binLen);
Buffer.from(pos.buffer, pos.byteOffset, posBytes).copy(bin, 0);
Buffer.from(nor.buffer, nor.byteOffset, norBytes).copy(bin, posBytes);
Buffer.from(idx.buffer, idx.byteOffset, idxBytes).copy(bin, idxOffset);

const total = 12 + 8 + jsonBuf.length + 8 + bin.length;
const out = Buffer.alloc(total);
out.write('glTF', 0, 'ascii');
out.writeUInt32LE(2, 4);
out.writeUInt32LE(total, 8);
out.writeUInt32LE(jsonBuf.length, 12);
out.write('JSON', 16, 'ascii');
jsonBuf.copy(out, 20);
const binHdr = 20 + jsonBuf.length;
out.writeUInt32LE(bin.length, binHdr);
out.write('BIN\0', binHdr + 4, 'ascii');
bin.copy(out, binHdr + 8);

fs.writeFileSync(outFile, out);
console.log(`${outFile}  ${m.nv} verts  ${m.nt} tris  ${(out.length / 1024).toFixed(0)}KB`);
