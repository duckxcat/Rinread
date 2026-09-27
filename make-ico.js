// 把 7 个尺寸的 PNG 组装成标准多尺寸 ICO（PNG-in-ICO，尺寸声明严格一致）
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'build');
const sizes = [256, 128, 64, 48, 32, 24, 16];

const pngs = sizes.map((s) => ({
  size: s,
  data: fs.readFileSync(path.join(dir, 'ico_' + s + '.png')),
}));

let offset = 6 + 16 * sizes.length;

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);            // reserved
header.writeUInt16LE(1, 2);            // type = icon
header.writeUInt16LE(sizes.length, 4); // count

const dirBuf = Buffer.alloc(16 * sizes.length);
pngs.forEach((e, i) => {
  const b = i * 16;
  const d = e.size === 256 ? 0 : e.size;
  dirBuf.writeUInt8(d, b + 0);           // width
  dirBuf.writeUInt8(d, b + 1);           // height
  dirBuf.writeUInt8(0, b + 2);           // colorCount
  dirBuf.writeUInt8(0, b + 3);           // reserved
  dirBuf.writeUInt16LE(1, b + 4);        // planes
  dirBuf.writeUInt16LE(32, b + 6);       // bitCount
  dirBuf.writeUInt32LE(e.data.length, b + 8); // bytesInRes
  dirBuf.writeUInt32LE(offset, b + 12);  // imageOffset
  offset += e.data.length;
});

const out = path.join(dir, 'icon.ico');
fs.writeFileSync(out, Buffer.concat([header, dirBuf, ...pngs.map((e) => e.data)]));
console.log('ICO written:', out, '=', fs.statSync(out).size, 'bytes,', sizes.length, 'sizes');
