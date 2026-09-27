// 生成 64px 圆形 logo（来自 source.jpg），以 base64 注入到 index.html 书架标题左侧
const { nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'build', 'source.jpg');
const htmlPath = path.join(__dirname, 'index.html');

const img = nativeImage.createFromPath(src);
if (img.isEmpty()) { console.error('无法读取源图'); process.exit(1); }

const { width, height } = img.getSize();
let sq = img;
if (width > height) sq = img.crop({ x: Math.round((width - height) / 2), y: 0, width: height, height: height });
else if (height > width) sq = img.crop({ x: 0, y: Math.round((height - width) / 2), width: width, height: height });

const SIZE = 64;
const big = sq.resize({ width: SIZE, height: SIZE });
const bmp = big.toBitmap();
const cx = SIZE / 2, cy = SIZE / 2, r = SIZE / 2 - 1;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const a = Math.max(0, Math.min(255, Math.round((r - dist + 0.5) * 255)));
    bmp[(y * SIZE + x) * 4 + 3] = a;
  }
}
const circular = nativeImage.createFromBitmap(bmp, { width: SIZE, height: SIZE });
const dataUrl = 'data:image/png;base64,' + circular.toPNG().toString('base64');

let html = fs.readFileSync(htmlPath, 'utf-8');
if (html.includes('shelf-logo')) {
  console.log('已存在 shelf-logo，跳过注入');
} else {
  const logo = `<img class="shelf-logo" src="${dataUrl}" alt="">`;
  if (!html.includes('<div class="shelf-title">书架</div>')) {
    console.error('未找到书架标题节点');
    process.exit(1);
  }
  html = html.replace('<div class="shelf-title">书架</div>', `<div class="shelf-title">${logo}书架</div>`);
  fs.writeFileSync(htmlPath, html);
  console.log('已注入 logo，dataUrl 长度:', dataUrl.length);
}
process.exit(0);
