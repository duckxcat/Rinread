// 生成标准多尺寸 ICO：PNG-in-ICO，每个尺寸的 PNG 与目录声明严格一致
const { nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'build', 'source.jpg');
const out = path.join(__dirname, 'build', 'icon.ico');

try {
  if (!fs.existsSync(src)) throw new Error('源图不存在: ' + src);

  const img = nativeImage.createFromPath(src);
  if (img.isEmpty()) throw new Error('无法读取图片: ' + src);

  const { width, height } = img.getSize();
  console.log('源图尺寸:', width, 'x', height);

  // 居中裁剪成正方形
  let sq = img;
  if (width > height) {
    sq = img.crop({ x: Math.round((width - height) / 2), y: 0, width: height, height: height });
  } else if (height > width) {
    sq = img.crop({ x: 0, y: Math.round((height - width) / 2), width: width, height: width });
  }

  const sizes = [256, 128, 64, 48, 32, 24, 16];
  const pngs = [];
  let offset = 6 + 16 * sizes.length;

  for (const size of sizes) {
    const png = sq.resize({ width: size, height: size }).toPNG();
    pngs.push({ size, png, offset });
    console.log('  ' + size + 'x' + size + ' -> ' + png.length + ' bytes @ offset ' + offset);
    offset += png.length;
  }

  // 组装 ICO：6 字节头 + N×16 字节目录 + PNG 数据
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type = icon
  header.writeUInt16LE(sizes.length, 4); // count

  const dir = Buffer.alloc(16 * sizes.length);
  pngs.forEach((e, i) => {
    const b = i * 16;
    const d = e.size === 256 ? 0 : e.size; // 256 用 0 表示
    dir.writeUInt8(d, b + 0);             // width
    dir.writeUInt8(d, b + 1);             // height
    dir.writeUInt8(0, b + 2);             // colorCount
    dir.writeUInt8(0, b + 3);             // reserved
    dir.writeUInt16LE(1, b + 4);          // planes
    dir.writeUInt16LE(32, b + 6);         // bitCount
    dir.writeUInt32LE(e.png.length, b + 8); // bytesInRes
    dir.writeUInt32LE(e.offset, b + 12);  // imageOffset
  });

  const ico = Buffer.concat([header, dir, ...pngs.map((e) => e.png)]);
  fs.writeFileSync(out, ico);
  console.log('完成:', out, '=', ico.length, 'bytes,', sizes.length, '个尺寸');
  process.exit(0);
} catch (err) {
  console.error('错误:', err.message);
  process.exit(1);
}
