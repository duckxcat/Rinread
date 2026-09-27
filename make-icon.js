// 把 build/icon.svg 渲染成 PNG 并打包成 Windows 图标 build/icon.ico
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

function pngToIco(png) {
  // 单个 256x256 PNG 直接内嵌进 ICO（Vista+ 标准格式）
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // 保留
  header.writeUInt16LE(1, 2); // 类型：图标
  header.writeUInt16LE(1, 4); // 数量：1
  const entry = Buffer.alloc(16);
  entry.writeUInt8(0, 0);        // 宽（0 = 256）
  entry.writeUInt8(0, 1);        // 高（0 = 256）
  entry.writeUInt8(0, 2);        // 调色板
  entry.writeUInt8(0, 3);        // 保留
  entry.writeUInt16LE(1, 4);     // 色平面
  entry.writeUInt16LE(32, 6);    // 位深
  entry.writeUInt32LE(png.length, 8); // 数据大小
  entry.writeUInt32LE(22, 12);   // 数据偏移
  return Buffer.concat([header, entry, png]);
}

function render(url, size) {
  return new Promise((resolve, reject) => {
    const win = new BrowserWindow({
      width: size, height: size, show: false, frame: false,
      webPreferences: { offscreen: true }
    });
    win.loadURL(url).then(() => {
      setTimeout(async () => {
        try {
          const img = await win.webContents.capturePage({ x: 0, y: 0, width: size, height: size });
          resolve(img.toPNG());
        } catch (e) { reject(e); } finally { win.destroy(); }
      }, 400);
    }).catch(reject);
  });
}

app.whenReady().then(async () => {
  try {
    const svgPath = path.join(__dirname, 'build', 'icon.svg');
    const svg = fs.readFileSync(svgPath, 'utf-8');
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    const png = await render(dataUrl, 256);
    fs.writeFileSync(path.join(__dirname, 'build', 'icon.png'), png);
    fs.writeFileSync(path.join(__dirname, 'build', 'icon.ico'), pngToIco(png));
    console.log('ICON_DONE', png.length, 'bytes');
  } catch (e) {
    console.error('ICON_ERROR', e);
  }
  app.quit();
});
