// Electron 主进程：把纯前端阅读器包装成桌面应用
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '粼青之海',
    backgroundColor: '#f5f5f5',
    autoHideMenuBar: true, // 隐藏菜单栏，按 Alt 可临时显示
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // 加载本地页面（纯前端，localStorage / IndexedDB 均可用）
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  // macOS：点击 Dock 图标且无窗口时重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 所有窗口关闭后退出（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
