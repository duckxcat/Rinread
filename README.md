# 粼青之海

> 一款纯本地的桌面电子书阅读器，支持 EPUB / TXT，无后端、无账号、数据全部保存在你自己的电脑上。

粼青之海是一个基于 Electron 的本地阅读器，界面清爽，专注阅读本身。导入本地书籍后即可阅读，阅读进度、划线、书签、笔记都会自动保存到本地，离线可用，不会上传任何数据。

## ✨ 特性

- **本地导入**：一键导入 EPUB / TXT 书籍，自动解析书名、作者与封面。
- **两种阅读引擎**
  - TXT：智能分章、双栏分页，按窗口尺寸自适应重排。
  - EPUB：基于 epub.js 渲染，保留排版与多级目录。
- **完整阅读体验**
  - 目录抽屉、全书搜索、书签、进度条拖拽跳转。
  - 划词弹出菜单：划线、写想法、复制。
  - 笔记面板三合一：摘录与笔记 / 书签 / 感想。
- **可自定义排版**：字号、行距、边距、字重，以及 7 套阅读主题（日间、米色、护眼绿、浅灰、雾蓝、夜间、纸质感）。
- **书籍管理**：自定义封面、重命名、修改作者、删除。
- **键盘操作**：`←` / `→` 翻页，`Esc` 关闭面板 / 返回。
- **纯本地存储**：书籍内容存 IndexedDB，进度与笔记存 localStorage，无网络依赖、无隐私顾虑。

## 🧱 技术栈

| 层 | 技术 |
| --- | --- |
| 桌面框架 | Electron 31 |
| 打包 | electron-builder 24 |
| EPUB 解析 | epub.js 0.3.93（CDN 加载） |
| 存储 | localStorage + IndexedDB |

纯前端实现（HTML / CSS / 原生 JS），主进程仅负责创建窗口，无任何后端服务。

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/)（建议 18+）
- npm

### 安装与运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm start
```

首次使用：点击书架右上角「＋ 导入书籍」，选择本地 EPUB 或 TXT 文件即可开始阅读。内置了一本《金阁寺》演示书，用于体验各项功能。

## 📦 打包

```bash
# 生成未打包目录（用于调试，输出到 dist/win-unpacked）
npm run pack

# 生成 Windows 便携版 exe（输出 dist/粼青之海.exe）
npm run dist
```

### 国内网络打包提示

直接打包时，Electron 与打包工具的二进制文件从 GitHub 下载容易超时。可通过环境变量走 npmmirror 镜像：

```bash
ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" \
ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/" \
npm run dist
```

> 已知坑：`winCodeSign` 解压时，其中 macOS 的 `.dylib` 文件是符号链接，在非管理员且未开启开发者模式的 Windows 上可能报 `Cannot create symbolic link` 导致打包失败。若遇到，可尝试以**管理员身份**运行打包命令，或开启 Windows「开发者模式」。

## 📁 项目结构

```
claudecode/
├── index.html       # 界面结构（书架页 + 阅读页 + 各面板/弹窗）
├── style.css        # 全部样式（含 7 套阅读主题）
├── app.js           # 核心逻辑（存储、分页、EPUB 渲染、划词、笔记、搜索等）
├── main.js          # Electron 主进程
├── package.json     # 项目配置与打包配置
├── build/           # 图标与打包中间产物（已 gitignore）
└── dist/            # 打包输出（已 gitignore）
```

## 🔒 数据与隐私

- 所有数据（书籍内容、进度、划线、笔记、书签）均保存在本机，**不联网、不上传**。
- 唯一的网络请求是首次加载 epub.js 库（来自 jsDelivr CDN）；如需完全离线，可将其下载到本地 `lib/` 并修改 [index.html](index.html) 中的 `script` 地址。

## 📄 许可

[MIT](LICENSE)
