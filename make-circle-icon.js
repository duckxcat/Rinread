// 把 build/source.jpg 处理成圆形图标（透明圆角），生成多尺寸 ICO
const { nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'build', 'source.jpg');
const outIco = path.join(__dirname, 'build', 'icon-circular.ico');
const outPng = path.join(__dirname, 'build', 'icon-circular.png');

try {
  const img = nativeImage.createFromPath(src);
  if (img.isEmpty()) throw new Error('无法读取源图: ' + src);

  const { width, height } = img.getSize();
  console.log('源图尺寸:', width, 'x', height);

  // 居中裁剪成正方形
  let sq = img;
  if (width > height) sq = img.crop({ x: Math.round((width - height) / 2), y: 0, width: height, height: height });
  else if (height > width) sq = img.crop({ x: 0, y: Math.round((height - width) / 2), width: width, height: height });

  // 放大到 512 处理，应用圆形 alpha 遮罩
  const SIZE = 512;
  const big = sq.resize({ width: SIZE, height: SIZE });
  const bmp = big.toBitmap(); // BGRA
  const cx = SIZE / 2, cy = SIZE / 2, r = SIZE / 2 - 1;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // 1px 羽化边缘，圆外透明
      const a = Math.max(0, Math.min(255, Math.round((r - dist + 0.5) * 255)));
      bmp[(y * SIZE + x) * 4 + 3] = a; // alpha
    }
  }
  const circular = nativeImage.createFromBitmap(bmp, { width: SIZE, height: SIZE });

  // 自检：角落应为透明，中心应为不透明
  const check = circular.toBitmap();
  const cornerA = check[3];
  const centerA = check[(SIZE / 2 * SIZE + SIZE / 2) * 4 + 3];
  console.log('自检 alpha —— 角点(0,0):', cornerA, ' 中心:', centerA);

  fs.writeFileSync(outPng, circular.toPNG());

  // 组装多尺寸 ICO
  const sizes = [256, 128, 64, 48, 32, 24, 16];
  const pngs = [];
  let offset = 6 + 16 * sizes.length;
  for (const size of sizes) {
    const png = circular.resize({ width: size, height: size }).toPNG();
    pngs.push({ size, png, offset });
    offset += png.length;
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  const dir = Buffer.alloc(16 * sizes.length);
  pngs.forEach((e, i) => {
    const b = i * 16;
    const d = e.size === 256 ? 0 : e.size;
    dir.writeUInt8(d, b + 0);
    dir.writeUInt8(d, b + 1);
    dir.writeUInt8(0, b + 2);
    dir.writeUInt8(0, b + 3);
    dir.writeUInt16LE(1, b + 4);
    dir.writeUInt16LE(32, b + 6);
    dir.writeUInt32LE(e.png.length, b + 8);
    dir.writeUInt32LE(e.offset, b + 12);
  });
  fs.writeFileSync(outIco, Buffer.concat([header, dir, ...pngs.map((e) => e.png)]));
  console.log('完成:', outIco, '=', fs.statSync(outIco).size, 'bytes,', sizes.length, '个尺寸');
  process.exit(0);
} catch (err) {
  console.error('错误:', err.message);
  process.exit(1);
}
