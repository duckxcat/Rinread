/* ==========================================================================
 * 微信读书风格阅读器 —— 逻辑
 * 纯前端，无后端；数据本地存储（localStorage + IndexedDB）。
 * 功能：书架 / 导入 TXT+EPUB / 分页翻页 / 目录 / 进度记忆 / 划线·笔记 / 书签 / 三套主题。
 * ========================================================================== */

'use strict';

/* ============================ 内置示例书籍 ============================ */
/* 说明：《金阁寺》小说原文受版权保护，此处内置的是原创演示文本，
 * 内容为关于金阁寺（鹿苑寺）历史与建筑的真实史料介绍，仅用于演示阅读器功能。
 * 你可以通过书架「导入书籍」导入自己拥有的真实《金阁寺》TXT / EPUB。 */
const BUILTIN_BOOK = {
  id: 'builtin-jingeisi', title: '金阁寺', author: '三岛由纪夫',
  type: 'txt', builtin: true, cover: null, addedAt: Date.now()
};

const BUILTIN_CHAPTERS = [
  { title: '写在前面（演示说明）', text:
`本页是演示文本，用于完整展示这款阅读器的各项功能。

你可以试着用鼠标框选任意文字，会弹出「划线 / 写想法 / 复制」菜单；在阅读页点击中间区域可以呼出或隐藏顶部与底部工具栏；底部工具栏可以打开目录、笔记、设置面板。

真实的《金阁寺》小说原文受版权保护，无法内置。请点击书架右上角的「导入书籍」，选择你本地拥有的 EPUB 或 TXT 文件，即可用它进行完整阅读。` },
  { title: '金阁寺的历史', text:
`金阁寺的正式名称为鹿苑寺，位于京都市北区，是临济宗相国寺派的一所寺院。它的核心建筑舍利殿通体覆以金箔，因此被俗称为金阁寺。

这座寺院的历史可以追溯到镰仓时代。此地原本是西园寺公经的一座山庄，名为北山第。公元1397年，室町幕府第三代将军足利义满以这片土地与西园寺家交换，将其改建为自己的别墅，称为北山殿。

足利义满去世后，遵照其遗愿，北山殿被改建为禅寺，取义满的法号「鹿苑院」，命名为鹿苑寺。舍利殿金阁则是当时唯一留存下来的建筑。

此后数百年间，鹿苑寺历经战乱与火灾的反复洗礼。应仁之乱中，寺内大部分建筑被毁，唯有金阁奇迹般地保存了下来。它静静矗立在镜湖池畔，见证着京都的兴衰。` },
  { title: '舍利殿的建筑', text:
`金阁是一座三层的楼阁式建筑，三层分别采用了三种不同的建筑风格，这在日本建筑史上极为罕见。

第一层称为「法水院」，采用平安时代贵族住宅的寝殿造风格，内部供奉着释迦牟尼佛与足利义满的坐像。这一层以木板铺就，未施金箔，显得古朴而沉静。

第二层称为「潮音洞」，采用武家住宅的武家造风格，内部供奉着岩屋观音。从这一层开始，墙壁、立柱与栏杆都贴上了金箔，金光初现。

第三层称为「究竟顶」，采用中国禅宗风格的禅宗佛殿造，顶部立着一只展翅欲飞的铜制金凤凰。整个楼阁自下而上，从朴素渐次走向绚烂，最终在金顶处达到极致。

整座金阁以镜湖池为前景，三层楼阁倒映于水中，金光与波影交相辉映，构成了日本最具代表性的园林景观之一。` },
  { title: '镜湖池与庭园', text:
`金阁寺的庭园是一座典型的池泉回游式庭园，其核心就是舍利殿前的镜湖池。池水常年平静如镜，倒映着金阁的轮廓，因此得名「镜湖池」。

池中错落分布着大小不一的岛屿，其中有的是自然形成的，有的则是人工堆砌而成。这些岛屿象征着传说中的蓬莱仙境，寄托了古人对于长生与理想的向往。

池岸点缀着许多奇石，其中不乏从各地搜集而来的名石。每一块石头的位置都经过精心设计，与池水、岛屿、松树共同构成一幅立体的画卷。

镜湖池是整座庭园的精神中心，而金阁则是这幅画卷的主角。无论是晨雾初起的清晨，还是夕阳西下的黄昏，金阁在水中的倒影都呈现出截然不同的气质。

庭园中还保留着许多历史遗迹，如足利义满当年洗手的岩下水、银河泉等。漫步其间，仿佛能够触摸到六百年前的时光。` },
  { title: '四季的金阁', text:
`金阁寺之美，在于它随着四季的更替而呈现出不同的面貌，每一个季节都有一番独属于自己的风韵。

春日里，樱花在池畔盛开，粉白的花瓣落在金色的屋脊之上，柔和而明媚。新绿的松枝与金箔相互映衬，生机盎然。

夏日是最耀眼的季节。强烈的阳光下，金箔反射出刺目的光芒，整座楼阁仿佛燃烧起来。池水映着蓝天与白云，金阁倒影清晰得近乎虚幻。

秋日则是色彩最浓烈的时节。寺内的枫叶渐次染红，金阁的金黄与枫叶的深红交织在一起，构成了京都秋天最经典的画面。层林尽染之际，游人如织。

冬日，若逢降雪，金阁便披上了一层洁白。金色的楼阁、白色的积雪与青黑色的池水，三种颜色冷峻而纯粹。雪后初晴的金阁，被认为是最接近「极乐净土」的景象。` },
  { title: '尾声', text:
`1950年7月2日凌晨，金阁寺被一场人为的大火焚毁，成为日本战后文化史上的一桩著名事件。作家三岛由纪夫以此为原型，创作了长篇小说《金阁寺》。

今日我们看到的金阁，是1955年依照原样重建的建筑。重建时重新贴敷的金箔，比历史上任何时期都要更加耀眼。

在小说《金阁寺》中，金阁不再只是一座建筑，而成为美本身的象征。它映照出人心的执念、挣扎与幻灭，也引发了无数读者关于「美与毁灭」的思考。

感谢你使用这款阅读器。希望你能在这里，开启一段属于自己的阅读时光。` }
];

/* ============================ 存储层 ============================ */
const Store = {
  get(key, def) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch (e) { console.warn('localStorage 写入失败', e); }
  }
};

// 书籍内容（TXT 章节 / EPUB 二进制）放入 IndexedDB，避免超出 localStorage 5MB 限制
const DB = {
  _db: null,
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('wereader_db', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('books');
      req.onsuccess = () => { this._db = req.result; resolve(this._db); };
      req.onerror = () => reject(req.error);
    });
  },
  async put(id, data) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction('books', 'readwrite');
      tx.objectStore('books').put(data, id);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  },
  async get(id) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction('books', 'readonly');
      const r = tx.objectStore('books').get(id);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  },
  async del(id) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction('books', 'readwrite');
      tx.objectStore('books').delete(id);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  }
};

/* ============================ 全局状态 ============================ */
const state = {
  books: [],            // 书架元数据
  currentBook: null,
  chapters: [],         // TXT：章节列表 [{title,text}]
  chapterOffsets: [],   // TXT：各章节起始全局偏移
  pages: [],            // TXT：扁平分页 [{chapterIndex,start,end}]
  pageStarts: [],       // TXT：每页起始全局偏移（二分定位）
  currentPage: 0,       // TXT：当前页索引
  epub: null,           // EPUB：{ book, rendition }
  epubTocTree: [],      // EPUB：多级目录树
  selection: null,      // 当前划词 {text,chapterIndex,start,end} 或 EPUB {text,cfi,isEpub}
  uiVisible: false,     // 工具栏是否显示
  notesTab: 'highlights'
};

const defaultSettings = { fontSize: 20, lineHeight: 1.8, margin: 64, theme: 'day', fontWeight: 400 };
let settings = Store.get('wxread_settings', defaultSettings);
const THEME_KEYS = ['day', 'sepia', 'green', 'gray', 'blue', 'night', 'paper'];
let pendingRenameId = null;   // 待重命名的书籍 id
let bookMenuTargetId = null;  // 右键菜单目标书籍 id
let pendingCoverId = null;    // 待设置封面的书籍 id
let selectingText = false;    // 刚完成划词选择，用于阻止随后的 click 触发翻页

/* ============================ 工具函数 ============================ */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function stripExt(name) { return name.replace(/\.[^.\/\\]+$/, ''); }

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1600);
}

function fmtTime(t) {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ============================ DOM 引用 ============================ */
let $ = (id) => document.getElementById(id);
let shelf, shelfGrid, fileInput, btnImport;
let reader, readerTopbar, readerBottombar, readerTitle, btnBookmark, btnBack;
let readerContent, txtPage, epubView, epubZoneLeft, epubZoneRight, chapterLabel;
let btnToc, panelToc, tocList, btnNotes, panelNotes, notesList;
let btnSettings, panelSettings, fontDec, fontInc, fontSizeVal, lineHeightSlider, lineHeightVal, marginSlider, marginVal;
let progressSlider, progressLabel, pageIndicator, pageCorner;
let selectionMenu, noteModal, noteQuote, noteInput, noteClose, noteCancel, noteSave, overlay;
let renameModal, renameInput, renameAuthor, renameClose, renameCancel, renameSave, bookMenu, coverInput;
let btnSearch, searchPanel, searchInput, searchResults, searchClose;

/* ============================ 初始化 ============================ */
document.addEventListener('DOMContentLoaded', init);

function init() {
  cacheDom();
  loadSettings();
  applySettingsToCSS();
  loadBooks();
  renderShelf();
  bindEvents();
}

function cacheDom() {
  shelf = $('bookshelf'); shelfGrid = $('shelf-grid'); fileInput = $('file-input'); btnImport = $('btn-import');
  reader = $('reader'); readerTopbar = $('reader-topbar'); readerBottombar = $('reader-bottombar');
  readerTitle = $('reader-title'); btnBookmark = $('btn-bookmark'); btnBack = $('btn-back');
  readerContent = $('reader-content'); txtPage = $('txt-page'); epubView = $('epub-view');
  epubZoneLeft = $('epub-zone-left'); epubZoneRight = $('epub-zone-right'); chapterLabel = $('chapter-label');
  btnToc = $('btn-toc'); panelToc = $('panel-toc'); tocList = $('toc-list');
  btnNotes = $('btn-notes'); panelNotes = $('panel-notes'); notesList = $('notes-list');
  btnSettings = $('btn-settings'); panelSettings = $('panel-settings');
  fontDec = $('font-dec'); fontInc = $('font-inc'); fontSizeVal = $('font-size-val');
  lineHeightSlider = $('line-height-slider'); lineHeightVal = $('line-height-val');
  marginSlider = $('margin-slider'); marginVal = $('margin-val');
  progressSlider = $('progress-slider'); progressLabel = $('progress-label'); pageIndicator = $('page-indicator'); pageCorner = $('page-corner');
  selectionMenu = $('selection-menu'); noteModal = $('note-modal'); noteQuote = $('note-quote');
  noteInput = $('note-input'); noteClose = $('note-close'); noteCancel = $('note-cancel'); noteSave = $('note-save');
  overlay = $('overlay');
  renameModal = $('rename-modal'); renameInput = $('rename-input'); renameAuthor = $('rename-author');
  renameClose = $('rename-close'); renameCancel = $('rename-cancel'); renameSave = $('rename-save');
  bookMenu = $('book-menu'); coverInput = $('cover-input');
  btnSearch = $('btn-search'); searchPanel = $('search-panel'); searchInput = $('search-input');
  searchResults = $('search-results'); searchClose = $('search-close');
}

/* ============================ 设置 ============================ */
function loadSettings() {
  settings = Object.assign({}, defaultSettings, Store.get('wxread_settings', {}));
}
function saveSettings() { Store.set('wxread_settings', settings); }

function applySettingsToCSS() {
  const root = document.documentElement.style;
  root.setProperty('--font-size', settings.fontSize + 'px');
  root.setProperty('--line-height', settings.lineHeight);
  root.setProperty('--para-spacing', (settings.lineHeight * 0.6).toFixed(2) + 'em');
  root.setProperty('--margin-x', settings.margin + 'px');
  root.setProperty('--font-weight', settings.fontWeight);
  applyTheme(settings.theme);
  // 同步设置面板的控件值
  fontSizeVal.textContent = settings.fontSize;
  lineHeightSlider.value = settings.lineHeight; lineHeightVal.textContent = settings.lineHeight.toFixed(1);
  marginSlider.value = settings.margin; marginVal.textContent = settings.margin;
  syncWeightButtons();
}

function applyTheme(theme) {
  THEME_KEYS.forEach(k => reader.classList.remove('theme-' + k));
  reader.classList.add('theme-' + theme);
  document.querySelectorAll('.theme-swatch').forEach(s => s.classList.toggle('active', s.dataset.theme === theme));
}

function syncWeightButtons() {
  document.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.weight, 10) === settings.fontWeight));
}

/* ============================ 书架 ============================ */
function loadBooks() {
  state.books = Store.get('wxread_books', null);
  if (!state.books) {
    state.books = [BUILTIN_BOOK];
    Store.set('wxread_books', state.books);
  } else if (!state.books.find(b => b.id === BUILTIN_BOOK.id)) {
    state.books.unshift(BUILTIN_BOOK);
    Store.set('wxread_books', state.books);
  }
}

function progressMap() { return Store.get('wxread_progress', {}); }

function coverGradient(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return `background:linear-gradient(135deg,hsl(${h % 360},50%,42%),hsl(${(h + 45) % 360},55%,28%))`;
}

function renderShelf() {
  shelfGrid.innerHTML = '';
  const pm = progressMap();
  state.books.forEach(b => {
    const p = pm[b.id];
    const pct = p ? Math.round(p.percent * 100) : 0;
    const cover = b.cover
      ? `<img src="${b.cover}" alt="">`
      : `<div class="cover-text" style="${coverGradient(b.title)}"><span>${esc(b.title)}</span></div>`;
    const del = b.builtin ? '' : '<button class="book-delete" title="删除">×</button>';
    shelfGrid.insertAdjacentHTML('beforeend', `
      <div class="book-card" data-id="${esc(b.id)}">
        <div class="book-cover">${cover}</div>
        <div class="book-meta">
          <div class="book-title">${esc(b.title)}</div>
          <div class="book-author">${esc(b.author || '佚名')}</div>
        </div>
        <div class="book-progress">
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span class="progress-text">${pct}%</span>
        </div>
        <button class="book-rename" title="重命名">✎</button>
        ${del}
      </div>`);
  });
  shelf.classList.toggle('empty', state.books.length === 0);
}

/* ============================ 导入书籍 ============================ */
async function handleFile(file) {
  if (!file) return;
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith('.txt')) {
      const text = await readTxtFile(file);
      await importTxt(text, file.name);
      toast('已导入 TXT 书籍');
    } else if (name.endsWith('.epub')) {
      if (!window.ePub) { toast('epub.js 未加载，请联网后重试'); return; }
      const buffer = await file.arrayBuffer();
      await importEpub(buffer, file.name);
      toast('已导入 EPUB 书籍');
    } else {
      toast('仅支持 TXT / EPUB 文件');
    }
  } catch (e) {
    console.error(e);
    toast('导入失败：' + e.message);
  }
}

// 读取 TXT：优先 UTF-8，失败则回退 GBK（中文 TXT 常见编码）
function readTxtFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(fr.error);
    fr.onload = () => {
      const buf = fr.result;
      try { resolve(new TextDecoder('utf-8', { fatal: true }).decode(buf)); }
      catch (e) {
        try { resolve(new TextDecoder('gbk').decode(buf)); }
        catch (e2) { resolve(new TextDecoder('utf-8').decode(buf)); }
      }
    };
    fr.readAsArrayBuffer(file);
  });
}

// 标题层级识别：卷/部/篇 → 1 级，章/回 → 2 级，节/讲 → 3 级，序/楔子/后记等 → 2 级
function headingLevel(t) {
  if (/^第[0-9零一二三四五六七八九十百千万]+[卷部篇集]/.test(t)) return 1;
  if (/^第[0-9零一二三四五六七八九十百千万]+[章回]/.test(t)) return 2;
  if (/^第[0-9零一二三四五六七八九十百千万]+[节讲]/.test(t)) return 3;
  if (/^(序章|序言|自序|楔子|引子|前言|引言|导读|后记|尾声|结语|番外|附录)/.test(t)) return 2;
  if (/^Chapter\s+\d+/i.test(t)) return 2;
  return 0;
}

// 章节识别：按标题层级切分，level 用于构建多级目录树
function parseChapters(text) {
  const norm = text.replace(/\r\n?/g, '\n');
  const lines = norm.split('\n');
  const chapters = [];
  let cur = { title: '正文', text: '', level: 1 };
  for (const line of lines) {
    const t = line.trim();
    const lvl = headingLevel(t);
    if (lvl > 0) {
      if (cur.text.trim()) chapters.push(cur);
      cur = { title: t, text: '', level: lvl };
    } else {
      cur.text += line + '\n';
    }
  }
  if (cur.text.trim()) chapters.push(cur);
  if (chapters.length === 0) chapters.push({ title: '正文', text: norm, level: 1 });
  // 无章节的超大文件，切分为若干部分，避免单章过大
  const out = [];
  for (const c of chapters) out.push(...chunkChapter(c.title, c.text, c.level));
  return out;
}

function chunkChapter(title, text, level) {
  const MAX = 50000;
  if (text.length <= MAX) return [{ title, text, level }];
  const parts = [];
  const paras = text.split('\n');
  let buf = '', idx = 1;
  for (const p of paras) {
    buf += p + '\n';
    if (buf.length >= MAX) { parts.push({ title: `${title}（${idx++}）`, text: buf, level }); buf = ''; }
  }
  if (buf.trim()) parts.push({ title: `${title}（${idx}）`, text: buf, level });
  return parts;
}

async function importTxt(text, fileName) {
  const chapters = parseChapters(text);
  const book = { id: 'txt-' + uid(), title: stripExt(fileName), author: '未知', type: 'txt', builtin: false, cover: null, addedAt: Date.now() };
  state.books.push(book);
  Store.set('wxread_books', state.books);
  await DB.put(book.id, { chapters });
  renderShelf();
}

// 解析 EPUB 元数据（书名 / 作者 / 封面）
async function extractEpubMeta(buffer) {
  const book = ePub(buffer);
  await book.ready;
  const meta = book.packaging.metadata || book.loaded.metadata || {};
  const title = meta.title || '';
  const author = meta.creator || meta.author || '';
  let cover = null;
  try {
    const url = await book.coverUrl();
    if (url) cover = await urlToDataURL(url);
  } catch (e) { /* 无封面则忽略 */ }
  book.destroy();
  return { title, author, cover };
}

async function urlToDataURL(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

async function importEpub(buffer, fileName) {
  const meta = await extractEpubMeta(buffer);
  const book = {
    id: 'epub-' + uid(),
    title: meta.title || stripExt(fileName),
    author: meta.author || '佚名',
    type: 'epub', builtin: false, cover: meta.cover, addedAt: Date.now()
  };
  state.books.push(book);
  Store.set('wxread_books', state.books);
  await DB.put(book.id, { buffer });
  renderShelf();
}

async function deleteBook(id) {
  const b = state.books.find(x => x.id === id);
  if (!b || b.builtin) return;
  if (!confirm(`确定删除《${b.title}》吗？阅读进度、笔记等也将一并清除。`)) return;
  state.books = state.books.filter(x => x.id !== id);
  Store.set('wxread_books', state.books);
  await DB.del(id);
  // 清理关联数据
  ['wxread_progress', 'wxread_highlights', 'wxread_bookmarks', 'wxread_reflections'].forEach(k => {
    const m = Store.get(k, {});
    if (m[id]) { delete m[id]; Store.set(k, m); }
  });
  renderShelf();
}

/* ============================ 书籍信息编辑（重命名 / 修改作者） ============================ */
function editBook(id, title, author) {
  const b = state.books.find(x => x.id === id);
  if (!b) return;
  const t = (title || '').trim();
  if (t) b.title = t;
  b.author = (author || '').trim() || '佚名';
  Store.set('wxread_books', state.books);
  if (state.currentBook && state.currentBook.id === id) {
    state.currentBook.title = b.title;
    state.currentBook.author = b.author;
    readerTitle.textContent = b.title;
  }
  renderShelf();
  toast('已保存');
}

function openEditModal(id, focusField) {
  const b = state.books.find(x => x.id === id);
  if (!b) return;
  pendingRenameId = id;
  renameInput.value = b.title;
  renameAuthor.value = b.author || '';
  renameModal.classList.remove('hidden');
  const target = focusField === 'author' ? renameAuthor : renameInput;
  target.focus();
  target.select();
}

function closeRenameModal() {
  renameModal.classList.add('hidden');
  pendingRenameId = null;
}

function confirmEdit() {
  if (pendingRenameId) editBook(pendingRenameId, renameInput.value, renameAuthor.value);
  closeRenameModal();
}

/* ---- 书籍右键菜单 ---- */
function openBookMenu(id, x, y) {
  bookMenuTargetId = id;
  bookMenu.classList.remove('hidden');
  const rect = bookMenu.getBoundingClientRect();
  bookMenu.style.left = Math.max(8, Math.min(x, window.innerWidth - rect.width - 8)) + 'px';
  bookMenu.style.top = Math.max(8, Math.min(y, window.innerHeight - rect.height - 8)) + 'px';
}

function closeBookMenu() {
  bookMenu.classList.add('hidden');
  bookMenuTargetId = null;
}

// 打开图片选择器，为指定书籍设置封面
function openCoverPicker(id) {
  pendingCoverId = id;
  coverInput.click();
}

function setCover(id, dataUrl) {
  const b = state.books.find(x => x.id === id);
  if (!b) return;
  b.cover = dataUrl;
  Store.set('wxread_books', state.books);
  renderShelf();
  toast('封面已更新');
}

// 读取图片并压缩为封面缩略图（避免撑爆 localStorage）
function readImageAsCover(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(fr.error);
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('图片解析失败'));
      img.onload = () => {
        const MAX = 360;
        const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        try { resolve(canvas.toDataURL('image/jpeg', 0.85)); }
        catch (e) { resolve(fr.result); }
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* ============================ 打开 / 关闭书籍 ============================ */
async function openBook(book) {
  state.currentBook = book;
  readerTitle.textContent = book.title;
  reader.classList.remove('hidden');
  shelf.classList.add('hidden');
  toggleUI(false);
  if (book.type === 'epub') {
    await openEpub(book);
  } else {
    await openTxt(book);
  }
  restoreProgress();
  updateBookmarkBtn();
}

function closeReader() {
  saveProgress();
  if (state.epub) {
    try { state.epub.rendition.destroy(); state.epub.book.destroy(); } catch (e) {}
    state.epub = null;
  }
  state.currentBook = null;
  reader.classList.add('hidden');
  shelf.classList.remove('hidden');
  renderShelf();
  closeAllPanels();
  clearSelection();
  hideSelectionMenu();
}

/* ============================ TXT 阅读 ============================ */
async function openTxt(book) {
  state.epub = null;
  epubView.classList.add('hidden');
  epubZoneLeft.classList.add('hidden');
  epubZoneRight.classList.add('hidden');
  txtPage.classList.remove('hidden');
  if (book.builtin) {
    state.chapters = BUILTIN_CHAPTERS.map(c => ({ title: c.title, text: c.text, level: 1 }));
  } else {
    const data = await DB.get(book.id);
    state.chapters = data.chapters;
  }
  computeChapterOffsets();
  paginateBook();
  renderToc();
}

function computeChapterOffsets() {
  const offs = [0];
  for (const c of state.chapters) offs.push(offs[offs.length - 1] + c.text.length);
  state.chapterOffsets = offs;
}

/* ---- 分页核心 ---- */
const measurerEl = (function () {
  const el = document.createElement('div');
  el.className = 'measure-host';
  document.body.appendChild(el);
  return el;
})();

function getLayout() {
  const cs = getComputedStyle(txtPage);
  const padTop = parseFloat(cs.paddingTop);
  const padBottom = parseFloat(cs.paddingBottom);
  const padLeft = parseFloat(cs.paddingLeft);
  const padRight = parseFloat(cs.paddingRight);
  const contentWidth = txtPage.clientWidth - padLeft - padRight;
  const contentHeight = txtPage.clientHeight - padTop - padBottom;
  const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--column-gap')) || 48;
  return {
    contentWidth,
    contentHeight,
    columnWidth: (contentWidth - gap) / 2,
    gap
  };
}

function makeParagraph(text) {
  const p = document.createElement('p');
  p.className = 'page-paragraph';
  p.textContent = text;
  return p;
}

// 将章节文本按行切分为段落，返回每段的 [start, end) 全局字符区间
function splitParagraphsWithRanges(text) {
  const ranges = [];
  const lines = text.split('\n');
  let pos = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed) {
      const lead = line.length - line.replace(/^\s*/, '').length;
      ranges.push({ start: pos + lead, end: pos + lead + trimmed.length });
    }
    pos += line.length + 1;
  }
  return ranges;
}

// 二分查找单段文本中能放进 maxHeight 的最大字符数
function fitChars(text, el, maxHeight) {
  const p = makeParagraph('');
  el.innerHTML = '';
  el.appendChild(p);
  let lo = 0, hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    p.textContent = text.slice(0, mid);
    if (el.scrollHeight <= maxHeight) lo = mid; else hi = mid - 1;
  }
  return lo;
}

// 对单个章节分页，返回 [{start,end}]（章节内字符区间）
function paginateChapter(chapterText, layout) {
  measurerEl.style.width = layout.columnWidth + 'px';
  const maxHeight = layout.contentHeight;
  const paras = splitParagraphsWithRanges(chapterText);
  const pages = [];
  let pageStart = 0, i = 0;
  while (i < paras.length) {
    let curEnd = pageStart, filled = false;
    measurerEl.innerHTML = '';
    while (i < paras.length) {
      const pr = paras[i];
      const pEl = makeParagraph(chapterText.slice(pr.start, pr.end));
      measurerEl.appendChild(pEl);
      if (measurerEl.scrollHeight > maxHeight) { measurerEl.removeChild(pEl); break; }
      curEnd = pr.end; filled = true; i++;
    }
    if (filled) {
      pages.push({ start: pageStart, end: curEnd });
      pageStart = curEnd;
    } else {
      const pr = paras[i];
      const n = Math.max(1, fitChars(chapterText.slice(pr.start, pr.end), measurerEl, maxHeight));
      const splitAt = pr.start + n;
      pages.push({ start: pageStart, end: splitAt });
      pageStart = splitAt;
      paras[i] = { start: splitAt, end: pr.end };
    }
  }
  if (pageStart < chapterText.length) pages.push({ start: pageStart, end: chapterText.length });
  return pages;
}

function paginateBook() {
  const layout = getLayout();
  state.pages = [];
  for (let ci = 0; ci < state.chapters.length; ci++) {
    const pgs = paginateChapter(state.chapters[ci].text, layout);
    for (const p of pgs) state.pages.push({ chapterIndex: ci, start: p.start, end: p.end });
  }
  state.pageStarts = state.pages.map(p => state.chapterOffsets[p.chapterIndex] + p.start);
  if (state.pages.length === 0) state.pages.push({ chapterIndex: 0, start: 0, end: 0 });
}

/* ---- 渲染页面（含划线） ---- */
function highlightsForChapter(bookId, chapterIndex) {
  const list = Store.get('wxread_highlights', {})[bookId] || [];
  return list.filter(h => !h.isEpub && h.chapterIndex === chapterIndex)
             .map(h => ({ id: h.id, start: h.start, end: h.end }));
}

function renderLineWithHighlights(lineText, gStart, gEnd, hlRanges, ci) {
  const spans = hlRanges
    .map(h => ({ s: Math.max(h.start, gStart) - gStart, e: Math.min(h.end, gEnd) - gStart, id: h.id }))
    .filter(h => h.s < h.e)
    .sort((a, b) => a.s - b.s);
  let html = '', pos = 0;
  for (const s of spans) {
    if (s.s > pos) html += esc(lineText.slice(pos, s.s));
    html += `<span class="highlight" data-hl="${s.id}">${esc(lineText.slice(s.s, s.e))}</span>`;
    pos = s.e;
  }
  if (pos < lineText.length) html += esc(lineText.slice(pos));
  return `<p class="page-paragraph" data-start="${gStart}" data-end="${gEnd}" data-chapter="${ci}">${html}</p>`;
}

function buildPageHtml(chapterText, start, end, hlRanges, ci) {
  const seg = chapterText.slice(start, end);
  const lines = seg.split('\n');
  const htmls = [];
  let lineStart = start;
  for (const line of lines) {
    const lineEnd = lineStart + line.length;
    if (line.trim()) htmls.push(renderLineWithHighlights(line, lineStart, lineEnd, hlRanges, ci));
    lineStart = lineEnd + 1;
  }
  return htmls.join('');
}

function renderTxtPage(pageIndex, dir) {
  state.currentPage = Math.max(0, Math.min(state.pages.length - 1, pageIndex));
  const left = state.pages[state.currentPage];
  const right = state.pages[state.currentPage + 1];
  const bookId = state.currentBook.id;

  const leftCh = state.chapters[left.chapterIndex];
  const leftHtml = buildPageHtml(leftCh.text, left.start, left.end, highlightsForChapter(bookId, left.chapterIndex), left.chapterIndex);

  let rightHtml = '';
  if (right) {
    const rightCh = state.chapters[right.chapterIndex];
    rightHtml = buildPageHtml(rightCh.text, right.start, right.end, highlightsForChapter(bookId, right.chapterIndex), right.chapterIndex);
  }

  txtPage.innerHTML = `<div class="col col-left">${leftHtml}</div><div class="col col-right">${rightHtml}</div>`;

  txtPage.classList.remove('anim-next', 'anim-prev');
  void txtPage.offsetWidth;
  if (dir === 'next') txtPage.classList.add('anim-next');
  else if (dir === 'prev') txtPage.classList.add('anim-prev');
  updateProgressUI();
  showChapterLabel(left.chapterIndex);
  saveProgress();
}

function nextPage() {
  if (state.currentPage + 2 < state.pages.length) renderTxtPage(state.currentPage + 2, 'next');
  else toast('已是最后一页');
}
function prevPage() {
  if (state.currentPage > 0) renderTxtPage(state.currentPage - 2, 'prev');
  else toast('已是第一页');
}

// 按全局字符偏移跳转
function goToGlobalOffset(offset) {
  const total = state.chapterOffsets[state.chapterOffsets.length - 1] || 1;
  offset = Math.max(0, Math.min(total - 1, offset));
  let lo = 0, hi = state.pages.length - 1, ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (state.pageStarts[mid] <= offset) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  ans -= ans % 2; // 对齐到左栏（双栏跨页的左半页）
  renderTxtPage(ans);
}

function goToChapter(chapterIndex) {
  goToGlobalOffset(state.chapterOffsets[chapterIndex]);
}

function showChapterLabel(ci) {
  const title = state.chapters[ci] ? state.chapters[ci].title : '';
  if (!title) return;
  chapterLabel.textContent = title;
  chapterLabel.classList.add('show');
  clearTimeout(showChapterLabel._t);
  showChapterLabel._t = setTimeout(() => chapterLabel.classList.remove('show'), 1400);
}

function updateProgressUI() {
  const total = state.chapterOffsets[state.chapterOffsets.length - 1] || 1;
  const page = state.pages[state.currentPage];
  const offset = state.chapterOffsets[page.chapterIndex] + page.start;
  const pct = offset / total;
  progressSlider.value = Math.round(pct * 1000);
  progressLabel.textContent = (pct * 100).toFixed(1) + '%';
  const spread = Math.floor(state.currentPage / 2) + 1;
  const totalSpreads = Math.ceil(state.pages.length / 2);
  const pageText = `第 ${spread} / ${totalSpreads} 页`;
  pageIndicator.textContent = pageText;
  pageCorner.textContent = pageText;
}

/* ============================ EPUB 阅读 ============================ */
async function openEpub(book) {
  const data = await DB.get(book.id);
  const bk = ePub(data.buffer);
  const rendition = bk.renderTo(epubView, { width: '100%', height: '100%', spread: 'auto' });
  state.epub = { book: bk, rendition };
  txtPage.classList.add('hidden');
  epubView.classList.remove('hidden');
  epubZoneLeft.classList.remove('hidden');
  epubZoneRight.classList.remove('hidden');

  await bk.ready;
  await bk.locations.generate(1000);
  await loadEpubToc();
  renderToc();
  applyEpubSettings();

  rendition.on('relocated', (loc) => {
    const pct = (loc.start.percentage || 0);
    progressSlider.value = Math.round(pct * 1000);
    progressLabel.textContent = (pct * 100).toFixed(1) + '%';
    if (loc.start.displayed) {
      const pageText = `第 ${loc.start.displayed.page} / ${loc.start.displayed.total} 页`;
      pageIndicator.textContent = pageText;
      pageCorner.textContent = pageText;
    }
    const pm = progressMap();
    pm[book.id] = { cfi: loc.start.cfi, percent: pct };
    Store.set('wxread_progress', pm);
    applyEpubHighlights();
  });

  attachEpubSelection();

  // 恢复进度
  const p = progressMap()[book.id];
  const startCfi = (p && p.cfi) ? p.cfi : null;
  rendition.display(startCfi);
}

function applyEpubSettings() {
  const r = state.epub.rendition;
  const themeCss = {
    day:   { body: { color: '#333 !important', background: '#ffffff !important' } },
    sepia: { body: { color: '#5b5344 !important', background: '#f5efdc !important' } },
    green: { body: { color: '#3b4a3b !important', background: '#dce8d8 !important' } },
    gray:  { body: { color: '#3a4046 !important', background: '#eef0f1 !important' } },
    blue:  { body: { color: '#35424e !important', background: '#e6edf3 !important' } },
    night: { body: { color: '#9a9a9a !important', background: '#0a0a0a !important' } },
    paper: { body: { color: '#3c3328 !important', 'background-color': '#f4ecd8 !important', 'background-image': 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjAuMDgiLz48L3N2Zz4=") !important', 'background-repeat': 'repeat' } }
  };
  try {
    THEME_KEYS.forEach(k => r.themes.register(k, themeCss[k]));
    r.themes.select(settings.theme);
    r.themes.fontSize(settings.fontSize + 'px');
    r.themes.lineHeight(settings.lineHeight);
    r.themes.override('font-weight', String(settings.fontWeight));
  } catch (e) { /* 主题 API 兼容性兜底 */ }
}

// EPUB 划词：在 iframe 文档上监听 mouseup
function attachEpubSelection() {
  const rendition = state.epub.rendition;
  let contents = [];
  try { contents = rendition.getContents(); } catch (e) {}
  const doc = contents[0] ? contents[0].document : null;
  if (!doc) return;
  doc.addEventListener('mouseup', (e) => {
    setTimeout(() => {
      const sel = doc.getSelection ? doc.getSelection() : null;
      if (!sel || sel.isCollapsed || !sel.toString().trim()) { hideSelectionMenu(); return; }
      let cfi = null;
      try {
        const base = rendition.currentLocation().start.cfi;
        const range = sel.getRangeAt(0);
        if (window.ePub && ePub.EpubCFI) cfi = ePub.EpubCFI.fromRange(range, base).toString();
      } catch (err) {}
      if (!cfi) cfi = rendition.currentLocation().start.cfi;
      state.selection = { text: sel.toString(), cfi, isEpub: true };
      positionMenuAtEvent(e, doc);
    }, 0);
  });
  // EPUB 右键呼出/隐藏工具栏
  doc.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    toggleUI(!state.uiVisible);
  });
}

function applyEpubHighlights() {
  const list = Store.get('wxread_highlights', {})[state.currentBook.id] || [];
  list.filter(h => h.isEpub && h.cfi).forEach(h => {
    try { state.epub.rendition.annotations.highlight(h.cfi); } catch (e) {}
  });
}

/* ============================ 进度保存 / 恢复 ============================ */
function saveProgress() {
  if (!state.currentBook) return;
  const id = state.currentBook.id;
  if (state.currentBook.type === 'epub') return; // EPUB 在 relocated 中保存
  const page = state.pages[state.currentPage];
  if (!page) return;
  const total = state.chapterOffsets[state.chapterOffsets.length - 1] || 1;
  const offset = state.chapterOffsets[page.chapterIndex] + page.start;
  const pm = progressMap();
  pm[id] = { offset, percent: offset / total };
  Store.set('wxread_progress', pm);
}

function restoreProgress() {
  if (!state.currentBook) return;
  if (state.currentBook.type === 'epub') return; // 已在 openEpub 中处理
  const p = progressMap()[state.currentBook.id];
  const offset = (p && typeof p.offset === 'number') ? p.offset : 0;
  goToGlobalOffset(offset);
}

/* ============================ 目录 ============================ */
function renderToc() {
  tocList.innerHTML = '';
  const tree = state.currentBook.type === 'epub' ? state.epubTocTree : buildTxtTocTree();
  const pageOf = state.currentBook.type === 'epub' ? epubPageOf : buildTxtPageMap();
  renderTocTree(tocList, tree, 0, pageOf);
  markActiveToc();
}

// TXT：由扁平章节（带 level）构建多级目录树
function buildTxtTocTree() {
  const roots = [];
  const stack = [];
  state.chapters.forEach((c, i) => {
    const level = c.level || 1;
    const node = { title: c.title, chapterIndex: i, level, children: [] };
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    if (stack.length === 0) roots.push(node);
    else stack[stack.length - 1].node.children.push(node);
    stack.push({ level, node });
  });
  return roots;
}

// TXT：计算每个章节起始页码（按跨页编号，与右下角页码一致）
function buildTxtPageMap() {
  const map = {};
  state.pages.forEach((pg, i) => {
    if (!(pg.chapterIndex in map)) map[pg.chapterIndex] = Math.floor(i / 2) + 1;
  });
  return (node) => (node.chapterIndex !== undefined ? map[node.chapterIndex] : null);
}

// EPUB：根据目录 href 估算章节起始页码（epub.js 分页动态，页码为近似值）
function epubPageOf(node) {
  if (!node.href || !state.epub || !state.epub.book) return null;
  try {
    const locations = state.epub.book.locations;
    if (!locations || typeof locations.get !== 'function') return null;
    const entry = locations.get(node.href);
    const startCfi = entry && (typeof entry.start === 'string' ? entry.start : (entry.start && entry.start.cfi));
    if (!startCfi) return null;
    let pct = null;
    if (typeof locations.percentageFromCfi === 'function') {
      pct = locations.percentageFromCfi(startCfi);
    } else {
      const loc = locations.locationFromCfi(startCfi);
      pct = loc && loc.start && loc.start.percentage;
    }
    if (typeof pct !== 'number') return null;
    const total = locations.total || (typeof locations.length === 'function' ? locations.length() : 0) || 0;
    if (!total) return null;
    return Math.round(pct * total) + 1;
  } catch (e) { return null; }
}

// EPUB：由导航构建多级目录树
async function loadEpubToc() {
  const bk = state.epub.book;
  let toc = [];
  try {
    const nav = bk.loaded.navigation;
    if (nav && nav.toc && nav.toc.length) toc = nav.toc;
    else toc = await bk.navigation.toc;
  } catch (e) {}
  state.epubTocTree = toc.map(item => epubTocNode(item));
}

function epubTocNode(item) {
  const node = { title: (item.label || '').trim(), href: item.href, children: [] };
  if (item.subitems && item.subitems.length) node.children = item.subitems.map(epubTocNode);
  return node;
}

// 递归渲染目录树
function renderTocTree(container, nodes, depth, pageOf) {
  nodes.forEach(node => {
    const hasChildren = node.children && node.children.length > 0;
    const row = document.createElement('div');
    row.className = 'toc-item' + (hasChildren ? ' has-children' : '');
    row.style.paddingLeft = (14 + depth * 18) + 'px';
    const page = pageOf ? pageOf(node) : null;
    const pageHtml = (page != null) ? `<span class="toc-page">第 ${page} 页</span>` : '';
    if (hasChildren) {
      row.innerHTML = `<span class="toc-arrow">▸</span><span class="toc-label">${esc(node.title)}</span>${pageHtml}`;
      row.dataset.toggle = '1';
    } else {
      row.innerHTML = `<span class="toc-label">${esc(node.title)}</span>${pageHtml}`;
      if (node.chapterIndex !== undefined) row.dataset.idx = node.chapterIndex;
      else if (node.href) row.dataset.href = node.href;
    }
    container.appendChild(row);
    if (hasChildren) {
      const wrap = document.createElement('div');
      wrap.className = 'toc-children';
      renderTocTree(wrap, node.children, depth + 1, pageOf);
      container.appendChild(wrap);
    }
  });
}

function markActiveToc() {
  if (state.currentBook.type === 'epub') return;
  const ci = state.pages[state.currentPage].chapterIndex;
  tocList.querySelectorAll('.toc-item[data-idx]').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.idx, 10) === ci);
  });
}

/* ============================ 划线 / 笔记 ============================ */
function closestParagraph(node) {
  let n = node.nodeType === 1 ? node : node.parentNode;
  while (n && n !== document) {
    if (n.classList && n.classList.contains('page-paragraph')) return n;
    n = n.parentNode;
  }
  return null;
}

// 由 DOM 选区还原出章节内的纯文本字符区间
function getSelectionOffsets() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  const startP = closestParagraph(range.startContainer);
  const endP = closestParagraph(range.endContainer);
  if (!startP || !endP) return null;
  const ci = parseInt(startP.dataset.chapter, 10);
  const a = pOffset(startP, range.startContainer, range.startOffset);
  const b = pOffset(endP, range.endContainer, range.endOffset);
  return { chapterIndex: ci, start: Math.min(a, b), end: Math.max(a, b), text: sel.toString() };
}

function pOffset(pEl, node, offset) {
  const base = parseInt(pEl.dataset.start, 10);
  const r = document.createRange();
  r.setStart(pEl, 0);
  r.setEnd(node, offset);
  return base + r.toString().length;
}

function handleTextSelection(e) {
  if (!state.currentBook || state.currentBook.type === 'epub') return;
  if (e.target.closest && (e.target.closest('#selection-menu') || e.target.closest('.modal'))) return;
  if (!readerContent.contains(e.target)) return;
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.toString().trim()) { hideSelectionMenu(); return; }
  const off = getSelectionOffsets();
  if (!off) { hideSelectionMenu(); return; }
  state.selection = off;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  positionMenuAtRect(rect);
  selectingText = true;
}

function positionMenuAtRect(rect) {
  selectionMenu.classList.remove('hidden');
  const w = selectionMenu.offsetWidth, h = selectionMenu.offsetHeight;
  let left = rect.left + rect.width / 2 - w / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
  let top = rect.top - h - 8;
  if (top < 8) top = rect.bottom + 8;
  selectionMenu.style.left = left + 'px';
  selectionMenu.style.top = top + 'px';
}

function positionMenuAtEvent(e, iframeDoc) {
  selectionMenu.classList.remove('hidden');
  const w = selectionMenu.offsetWidth, h = selectionMenu.offsetHeight;
  let mx = e.clientX, my = e.clientY;
  try {
    const f = iframeDoc.defaultView.frameElement;
    const r = f.getBoundingClientRect();
    mx += r.left; my += r.top;
  } catch (err) {}
  selectionMenu.style.left = Math.max(8, Math.min(mx - w / 2, window.innerWidth - w - 8)) + 'px';
  selectionMenu.style.top = (my - h - 10) + 'px';
}

function hideSelectionMenu() { selectionMenu.classList.add('hidden'); }

function currentPercent() {
  if (state.currentBook.type === 'epub') return (progressSlider.value / 1000);
  const total = state.chapterOffsets[state.chapterOffsets.length - 1] || 1;
  const page = state.pages[state.currentPage];
  return (state.chapterOffsets[page.chapterIndex] + page.start) / total;
}

function addHighlight(noteText) {
  const s = state.selection;
  if (!s || !state.currentBook) return;
  const map = Store.get('wxread_highlights', {});
  (map[state.currentBook.id] || (map[state.currentBook.id] = [])).push({
    id: uid(),
    bookId: state.currentBook.id,
    text: s.text,
    note: noteText || '',
    percent: currentPercent(),
    time: Date.now(),
    // TXT 定位信息
    chapterIndex: s.chapterIndex,
    start: s.start,
    end: s.end,
    // EPUB 定位信息
    isEpub: !!s.isEpub,
    cfi: s.cfi
  });
  Store.set('wxread_highlights', map);
  clearSelection();
  hideSelectionMenu();
  if (state.currentBook.type !== 'epub') renderTxtPage(state.currentPage);
  toast(noteText ? '已添加想法' : '已划线');
}

function deleteHighlight(id) {
  const map = Store.get('wxread_highlights', {});
  const list = map[state.currentBook.id] || [];
  map[state.currentBook.id] = list.filter(h => h.id !== id);
  Store.set('wxread_highlights', map);
  renderNotesPanel();
  if (state.currentBook.type !== 'epub') renderTxtPage(state.currentPage);
  toast('已删除');
}

function clearSelection() {
  if (window.getSelection) window.getSelection().removeAllRanges();
}

/* ============================ 书签 ============================ */
function bookmarksForBook(bookId) { return Store.get('wxread_bookmarks', {})[bookId] || []; }

function toggleBookmark() {
  if (!state.currentBook) return;
  const id = state.currentBook.id;
  const map = Store.get('wxread_bookmarks', {});
  let list = map[id] || [];
  let removed = false;
  if (state.currentBook.type === 'epub') {
    const cfi = state.epub.rendition.currentLocation().start.cfi;
    const idx = list.findIndex(b => b.cfi === cfi);
    if (idx >= 0) { list.splice(idx, 1); removed = true; }
    else list.push({ id: uid(), cfi, percent: currentPercent(), time: Date.now(), snippet: getEpubSnippet() });
  } else {
    const page = state.pages[state.currentPage];
    const offset = state.chapterOffsets[page.chapterIndex] + page.start;
    const idx = list.findIndex(b => b.chapterIndex === page.chapterIndex && b.start === page.start);
    if (idx >= 0) { list.splice(idx, 1); removed = true; }
    else list.push({ id: uid(), chapterIndex: page.chapterIndex, start: page.start, percent: currentPercent(), time: Date.now(), snippet: getTxtSnippet(offset) });
  }
  map[id] = list;
  Store.set('wxread_bookmarks', map);
  updateBookmarkBtn();
  toast(removed ? '已删除书签' : '已添加书签');
}

function getTxtSnippet(offset) {
  const total = state.chapterOffsets[state.chapterOffsets.length - 1];
  let text = '';
  for (let i = 0; i < state.chapters.length; i++) {
    const len = state.chapters[i].text.length;
    const start = state.chapterOffsets[i];
    if (offset >= start && offset < start + len) {
      text = state.chapters[i].text.slice(offset - start, offset - start + 60).replace(/\n/g, ' ');
      break;
    }
  }
  return text || '第 ' + Math.round(offset / Math.max(total, 1) * 100) + '% 处';
}

function getEpubSnippet() {
  try {
    const contents = state.epub.rendition.getContents();
    const body = contents[0] ? contents[0].document.body : null;
    if (body) return body.innerText.slice(0, 60).replace(/\s+/g, ' ');
  } catch (e) {}
  return '';
}

function updateBookmarkBtn() {
  if (!state.currentBook) return;
  const id = state.currentBook.id;
  const list = bookmarksForBook(id);
  let active = false;
  if (state.currentBook.type === 'epub' && state.epub) {
    const cfi = state.epub.rendition.currentLocation().start.cfi;
    active = list.some(b => b.cfi === cfi);
  } else {
    const page = state.pages[state.currentPage];
    active = list.some(b => b.chapterIndex === page.chapterIndex && b.start === page.start);
  }
  btnBookmark.classList.toggle('active', active);
}

function jumpToBookmark(bm) {
  closeAllPanels();
  if (state.currentBook.type === 'epub') {
    state.epub.rendition.display(bm.cfi);
  } else {
    goToGlobalOffset(state.chapterOffsets[bm.chapterIndex] + bm.start);
  }
}

function jumpToHighlight(hl) {
  closeAllPanels();
  if (state.currentBook.type === 'epub') {
    state.epub.rendition.display(hl.cfi);
  } else {
    goToGlobalOffset(state.chapterOffsets[hl.chapterIndex] + hl.start);
  }
}

/* ============================ 笔记面板 ============================ */
function renderNotesPanel() {
  notesList.innerHTML = '';
  const tab = state.notesTab;
  if (tab === 'highlights') {
    const list = Store.get('wxread_highlights', {})[state.currentBook.id] || [];
    if (list.length === 0) { notesList.innerHTML = '<div class="empty-tip">暂无划线或笔记</div>'; return; }
    groupHighlightsByChapter(list).forEach(g => {
      notesList.insertAdjacentHTML('beforeend', `<div class="note-group-title">${esc(g.title)}</div>`);
      g.items.forEach(h => {
        const noteHtml = h.note ? `<div class="note-body">${esc(h.note)}</div>` : '';
        notesList.insertAdjacentHTML('beforeend', `
          <div class="note-item" data-hl="${h.id}">
            <div class="note-excerpt">${esc(h.text)}</div>
            ${noteHtml}
            <div class="note-meta">${(h.percent * 100).toFixed(1)}% · ${fmtTime(h.time)}</div>
            <button class="note-del" data-del="${h.id}">删除</button>
          </div>`);
      });
    });
  } else if (tab === 'reflections') {
    renderReflections();
  } else {
    const list = bookmarksForBook(state.currentBook.id);
    if (list.length === 0) { notesList.innerHTML = '<div class="empty-tip">暂无书签</div>'; return; }
    list.slice().reverse().forEach(b => {
      notesList.insertAdjacentHTML('beforeend', `
        <div class="note-item" data-bm="${b.id}">
          <div class="note-excerpt">${esc(b.snippet || '（空）')}</div>
          <div class="note-meta">${(b.percent * 100).toFixed(1)}% · ${fmtTime(b.time)}</div>
          <button class="note-del" data-delbm="${b.id}">删除</button>
        </div>`);
    });
  }
}

function chapterTitleOf(h) {
  if (h.isEpub) return '本书';
  const c = state.chapters[h.chapterIndex];
  return c ? c.title : '';
}

// 按章节分组摘录/笔记，方便按章查询
function groupHighlightsByChapter(list) {
  if (list.length && list[0].isEpub) {
    return [{ key: 'epub', title: '本书', items: list.slice().sort((a, b) => a.time - b.time) }];
  }
  const groups = [];
  const map = new Map();
  for (const h of list) {
    if (!map.has(h.chapterIndex)) {
      const g = { key: h.chapterIndex, title: chapterTitleOf(h) || '正文', items: [] };
      map.set(h.chapterIndex, g);
      groups.push(g);
    }
    map.get(h.chapterIndex).items.push(h);
  }
  groups.sort((a, b) => a.key - b.key);
  groups.forEach(g => g.items.sort((a, b) => (a.start - b.start) || (a.time - b.time)));
  return groups;
}

function deleteBookmark(id) {
  const map = Store.get('wxread_bookmarks', {});
  map[state.currentBook.id] = (map[state.currentBook.id] || []).filter(b => b.id !== id);
  Store.set('wxread_bookmarks', map);
  renderNotesPanel();
  updateBookmarkBtn();
  toast('已删除');
}

/* ============================ 感想（自由记录） ============================ */
function reflectionsForBook(bookId) { return Store.get('wxread_reflections', {})[bookId] || []; }

function renderReflections() {
  const list = reflectionsForBook(state.currentBook.id).slice().sort((a, b) => b.time - a.time);
  notesList.insertAdjacentHTML('beforeend', `
    <div class="reflect-editor">
      <textarea id="reflect-input" class="reflect-input" placeholder="写下你的感想…"></textarea>
      <button id="reflect-save" class="reflect-save">记录感想</button>
    </div>`);
  if (list.length === 0) { notesList.insertAdjacentHTML('beforeend', '<div class="empty-tip">还没有感想，写下第一条吧</div>'); return; }
  list.forEach(r => {
    notesList.insertAdjacentHTML('beforeend', `
      <div class="reflect-item">
        <div class="reflect-text">${esc(r.text)}</div>
        <div class="reflect-meta">${fmtTime(r.time)}</div>
        <button class="reflect-del" data-delreflect="${r.id}">删除</button>
      </div>`);
  });
}

function addReflection(text) {
  const t = (text || '').trim();
  if (!t) { toast('感想内容为空'); return; }
  if (!state.currentBook) return;
  const map = Store.get('wxread_reflections', {});
  (map[state.currentBook.id] || (map[state.currentBook.id] = [])).push({ id: uid(), text: t, time: Date.now() });
  Store.set('wxread_reflections', map);
  renderNotesPanel();
  toast('已记录感想');
}

function deleteReflection(id) {
  const map = Store.get('wxread_reflections', {});
  map[state.currentBook.id] = (map[state.currentBook.id] || []).filter(r => r.id !== id);
  Store.set('wxread_reflections', map);
  renderNotesPanel();
  toast('已删除');
}

/* ============================ 搜索 ============================ */
let searchResultsData = [];

function openSearch() {
  searchPanel.classList.remove('hidden');
  searchInput.value = '';
  searchResults.innerHTML = '';
  searchResultsData = [];
  toggleUI(false);
  closeAllPanels();
  searchInput.focus();
}

function closeSearch() {
  searchPanel.classList.add('hidden');
  searchResults.innerHTML = '';
  searchResultsData = [];
}

function onSearchInput() {
  clearTimeout(onSearchInput._t);
  onSearchInput._t = setTimeout(() => doSearch(searchInput.value), 300);
}

async function doSearch(query) {
  const q = (query || '').trim();
  if (!q) { searchResults.innerHTML = ''; searchResultsData = []; return; }
  searchResults.innerHTML = '<div class="search-empty">搜索中…</div>';
  let results = [];
  try {
    if (state.currentBook.type === 'epub') results = await searchEpub(q);
    else results = searchTxt(q);
  } catch (e) { results = []; }
  renderSearchResults(q, results);
}

// TXT：逐章 indexOf，返回章节标题 + 片段 + 全局偏移
function searchTxt(query) {
  const q = query.toLowerCase();
  const results = [];
  for (let ci = 0; ci < state.chapters.length && results.length < 300; ci++) {
    const text = state.chapters[ci].text;
    const title = state.chapters[ci].title || ('第 ' + (ci + 1) + ' 章');
    let idx = 0;
    while (results.length < 300) {
      idx = text.toLowerCase().indexOf(q, idx);
      if (idx < 0) break;
      results.push({
        title,
        snippet: text.slice(Math.max(0, idx - 18), idx + q.length + 28).replace(/\n+/g, ' '),
        globalOffset: state.chapterOffsets[ci] + idx
      });
      idx += q.length;
    }
  }
  return results;
}

function txtSpreadOfOffset(globalOffset) {
  let lo = 0, hi = state.pages.length - 1, ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (state.pageStarts[mid] <= globalOffset) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return Math.floor(ans / 2) + 1;
}

function stripHtml(s) { return String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }

function epubHrefTitleMap() {
  const map = {};
  (function walk(nodes) {
    (nodes || []).forEach(n => { if (n.href && !map[n.href]) map[n.href] = n.title; if (n.children) walk(n.children); });
  })(state.epubTocTree || []);
  return map;
}

// EPUB：遍历 spine 各章节，用 section.find 搜索，返回 cfi 用于跳转
async function searchEpub(query) {
  const bk = state.epub.book;
  const results = [];
  let sections = [];
  try { sections = (bk.spine && bk.spine.spineItems) || []; } catch (e) {}
  if (!sections.length) return results;
  const titleOf = epubHrefTitleMap();
  for (const sec of sections) {
    if (results.length >= 300) break;
    try {
      let matches = sec.find ? sec.find(query) : [];
      if (matches && typeof matches.then === 'function') matches = await matches;
      if (matches && matches.length) {
        results.push({
          title: titleOf[sec.href] || '正文',
          snippet: stripHtml(matches[0].excerpt || matches[0].text || ''),
          cfi: matches[0].cfi,
          href: sec.href
        });
      }
    } catch (e) { /* 跳过无法搜索的章节 */ }
  }
  return results;
}

function highlightSnippet(snippet, query) {
  const text = String(snippet || '');
  const idx = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (idx < 0) return esc(text);
  return esc(text.slice(0, idx)) + '<span class="match">' + esc(text.slice(idx, idx + query.length)) + '</span>' + esc(text.slice(idx + query.length));
}

function renderSearchResults(query, results) {
  searchResultsData = results;
  searchResults.innerHTML = '';
  if (!results.length) {
    searchResults.innerHTML = '<div class="search-empty">未找到「' + esc(query) + '」相关内容</div>';
    return;
  }
  searchResults.insertAdjacentHTML('beforeend', '<div class="search-count">共 ' + results.length + ' 处结果</div>');
  results.forEach((r, i) => {
    const pageStr = (r.globalOffset != null) ? ' · 第 ' + txtSpreadOfOffset(r.globalOffset) + ' 页' : '';
    searchResults.insertAdjacentHTML('beforeend',
      '<div class="search-item" data-i="' + i + '">' +
        '<div class="search-item-title">' + esc(r.title) + pageStr + '</div>' +
        '<div class="search-item-snippet">' + highlightSnippet(r.snippet, query) + '</div>' +
      '</div>');
  });
}

function jumpToSearchResult(r) {
  closeSearch();
  if (!r) return;
  if (state.currentBook.type === 'epub') {
    if (r.cfi) state.epub.rendition.display(r.cfi);
    else if (r.href) state.epub.rendition.display(r.href);
  } else {
    goToGlobalOffset(r.globalOffset);
  }
}

/* ============================ UI 面板控制 ============================ */
function toggleUI(show) {
  state.uiVisible = show;
  readerTopbar.classList.toggle('hidden', !show);
  readerBottombar.classList.toggle('hidden', !show);
  if (!show) closeAllPanels();
}

function closeAllPanels() {
  panelToc.classList.add('hidden');
  panelNotes.classList.add('hidden');
  panelSettings.classList.add('hidden');
  overlay.classList.add('hidden');
  hideSelectionMenu();
}

function togglePanel(panel, others) {
  const willOpen = panel.classList.contains('hidden');
  closeAllPanels();
  if (willOpen) {
    panel.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }
  if (panel === panelNotes && willOpen) renderNotesPanel();
}

function openNoteModal() {
  if (!state.selection) return;
  noteQuote.textContent = state.selection.text;
  noteInput.value = '';
  noteModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  noteInput.focus();
}
function closeNoteModal() {
  noteModal.classList.add('hidden');
  overlay.classList.add('hidden');
  clearSelection();
  hideSelectionMenu();
}

/* ============================ 事件绑定 ============================ */
function bindEvents() {
  btnImport.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => { handleFile(e.target.files[0]); e.target.value = ''; });

  // 封面上传
  coverInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file || !pendingCoverId) return;
    const id = pendingCoverId;
    pendingCoverId = null;
    readImageAsCover(file)
      .then(dataUrl => setCover(id, dataUrl))
      .catch(err => toast('封面设置失败：' + (err && err.message ? err.message : '未知错误')));
  });

  // 书架卡片：打开 / 重命名 / 删除
  shelfGrid.addEventListener('click', (e) => {
    const del = e.target.closest('.book-delete');
    if (del) { e.stopPropagation(); const card = del.closest('.book-card'); deleteBook(card.dataset.id); return; }
    const ren = e.target.closest('.book-rename');
    if (ren) { e.stopPropagation(); const card = ren.closest('.book-card'); openEditModal(card.dataset.id, 'title'); return; }
    const card = e.target.closest('.book-card');
    if (card) openBook(state.books.find(b => b.id === card.dataset.id));
  });

  // 书籍右键菜单：重命名 / 修改作者
  shelfGrid.addEventListener('contextmenu', (e) => {
    const card = e.target.closest('.book-card');
    if (!card) { closeBookMenu(); return; }
    e.preventDefault();
    openBookMenu(card.dataset.id, e.clientX, e.clientY);
  });
  bookMenu.addEventListener('click', (e) => {
    const item = e.target.closest('.book-menu-item');
    if (!item) return;
    const action = item.dataset.action;
    const targetId = bookMenuTargetId;
    closeBookMenu();
    if (!targetId) return;
    if (action === 'cover') openCoverPicker(targetId);
    else openEditModal(targetId, action === 'author' ? 'author' : 'title');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#book-menu')) closeBookMenu();
  });

  btnBack.addEventListener('click', closeReader);
  btnBookmark.addEventListener('click', toggleBookmark);

  // 阅读区点击：左半屏上一页、右半屏下一页，中部窄带呼出/隐藏工具栏
  readerContent.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('.side-panel,.bottom-panel,.selection-menu,.modal,.epub-zone')) return;
    if (!state.currentBook) return;
    if (selectingText) { selectingText = false; return; } // 划词松手后的 click，不翻页
    if (state.currentBook.type !== 'epub') {
      const rect = readerContent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width * 0.45) prevPage();
      else if (x > rect.width * 0.55) nextPage();
      else toggleUI(!state.uiVisible);
    } else {
      toggleUI(!state.uiVisible);
    }
  });

  // 右键也呼出/隐藏工具栏（不用非得点中间空白处）
  readerContent.addEventListener('contextmenu', (e) => {
    if (e.target.closest && e.target.closest('.side-panel,.bottom-panel,.selection-menu,.modal,.search-panel')) return;
    if (!state.currentBook) return;
    e.preventDefault();
    toggleUI(!state.uiVisible);
  });

  epubZoneLeft.addEventListener('click', () => state.epub && state.epub.rendition.prev());
  epubZoneRight.addEventListener('click', () => state.epub && state.epub.rendition.next());

  // 底部栏
  btnToc.addEventListener('click', () => { togglePanel(panelToc); markActiveToc(); });
  btnNotes.addEventListener('click', () => togglePanel(panelNotes));
  btnSettings.addEventListener('click', () => togglePanel(panelSettings));

  // 目录点击：展开/折叠 或 跳转
  tocList.addEventListener('click', (e) => {
    const item = e.target.closest('.toc-item');
    if (!item) return;
    if (item.dataset.toggle) {
      const wrap = item.nextElementSibling;
      if (wrap && wrap.classList.contains('toc-children')) {
        const collapsed = wrap.classList.toggle('collapsed');
        item.classList.toggle('collapsed', collapsed);
      }
      return;
    }
    if (state.currentBook.type === 'epub') {
      state.epub.rendition.display(item.dataset.href);
      closeAllPanels();
    } else {
      goToChapter(parseInt(item.dataset.idx, 10));
      closeAllPanels();
    }
  });

  // 笔记面板：跳转 / 删除 / tab 切换
  panelNotes.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.tab');
    if (tabBtn) {
      state.notesTab = tabBtn.dataset.tab;
      panelNotes.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tabBtn));
      renderNotesPanel();
      return;
    }
    const saveReflect = e.target.closest('#reflect-save');
    if (saveReflect) { const input = document.getElementById('reflect-input'); addReflection(input ? input.value : ''); return; }
    const delReflect = e.target.closest('[data-delreflect]');
    if (delReflect) { e.stopPropagation(); deleteReflection(delReflect.dataset.delreflect); return; }
    const del = e.target.closest('[data-del]');
    if (del) { e.stopPropagation(); deleteHighlight(del.dataset.del); return; }
    const delbm = e.target.closest('[data-delbm]');
    if (delbm) { e.stopPropagation(); deleteBookmark(delbm.dataset.delbm); return; }
    const hl = e.target.closest('[data-hl]');
    if (hl) { const h = (Store.get('wxread_highlights', {})[state.currentBook.id] || []).find(x => x.id === hl.dataset.hl); if (h) jumpToHighlight(h); return; }
    const bm = e.target.closest('[data-bm]');
    if (bm) { const b = bookmarksForBook(state.currentBook.id).find(x => x.id === bm.dataset.bm); if (b) jumpToBookmark(b); }
  });

  // 设置面板
  fontDec.addEventListener('click', () => changeFont(-1));
  fontInc.addEventListener('click', () => changeFont(1));
  lineHeightSlider.addEventListener('input', () => changeLineHeight(parseFloat(lineHeightSlider.value)));
  marginSlider.addEventListener('input', () => changeMargin(parseInt(marginSlider.value, 10)));
  document.querySelectorAll('.theme-swatch').forEach(sw => {
    sw.addEventListener('click', () => changeTheme(sw.dataset.theme));
  });
  document.querySelectorAll('.seg-btn').forEach(b => {
    b.addEventListener('click', () => changeFontWeight(parseInt(b.dataset.weight, 10)));
  });

  // 进度条
  progressSlider.addEventListener('input', () => {
    const pct = progressSlider.value / 1000;
    progressLabel.textContent = (pct * 100).toFixed(1) + '%';
  });
  progressSlider.addEventListener('change', () => {
    if (!state.currentBook) return;
    const pct = progressSlider.value / 1000;
    if (state.currentBook.type === 'epub') {
      const cfi = state.epub.book.locations.cfiFromPercentage(pct);
      if (cfi) state.epub.rendition.display(cfi);
    } else {
      const total = state.chapterOffsets[state.chapterOffsets.length - 1] || 1;
      goToGlobalOffset(Math.round(pct * total));
    }
  });

  // 划词
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('mousedown', (e) => {
    selectingText = false;
    if (e.target.closest && !e.target.closest('#selection-menu')) hideSelectionMenu();
  });

  selectionMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'highlight') addHighlight(null);
    else if (action === 'note') openNoteModal();
    else if (action === 'copy') copyText(state.selection ? state.selection.text : '');
  });

  // 笔记弹窗
  noteSave.addEventListener('click', () => addHighlight(noteInput.value.trim()));
  noteCancel.addEventListener('click', closeNoteModal);
  noteClose.addEventListener('click', closeNoteModal);

  // 搜索
  btnSearch.addEventListener('click', openSearch);
  searchClose.addEventListener('click', closeSearch);
  searchInput.addEventListener('input', onSearchInput);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { clearTimeout(onSearchInput._t); doSearch(searchInput.value); }
  });
  searchResults.addEventListener('click', (e) => {
    const item = e.target.closest('.search-item');
    if (!item) return;
    jumpToSearchResult(searchResultsData[parseInt(item.dataset.i, 10)]);
  });

  // 编辑书籍信息弹窗
  renameSave.addEventListener('click', confirmEdit);
  renameCancel.addEventListener('click', closeRenameModal);
  renameClose.addEventListener('click', closeRenameModal);
  const editKeydown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmEdit(); }
    else if (e.key === 'Escape') closeRenameModal();
  };
  renameInput.addEventListener('keydown', editKeydown);
  renameAuthor.addEventListener('keydown', editKeydown);
  renameModal.addEventListener('click', (e) => { if (e.target === renameModal) closeRenameModal(); });

  // 遮罩点击关闭
  overlay.addEventListener('click', () => {
    closeAllPanels();
    closeNoteModal();
    toggleUI(false);
  });

  // 键盘翻页
  window.addEventListener('keydown', (e) => {
    if (!state.currentBook) return;
    if (!searchPanel.classList.contains('hidden')) { if (e.key === 'Escape') closeSearch(); return; }
    const t = e.target.tagName;
    if (t === 'TEXTAREA' || t === 'INPUT') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); if (state.currentBook.type === 'epub') state.epub.rendition.next(); else nextPage(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); if (state.currentBook.type === 'epub') state.epub.rendition.prev(); else prevPage(); }
    else if (e.key === 'Escape') { if (!noteModal.classList.contains('hidden')) closeNoteModal(); else toggleUI(false); }
  });

  // 窗口尺寸变化：重排并回到当前进度
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!state.currentBook || state.currentBook.type === 'epub') return;
      const total = state.chapterOffsets[state.chapterOffsets.length - 1] || 1;
      const page = state.pages[state.currentPage];
      const offset = state.chapterOffsets[page.chapterIndex] + page.start;
      paginateBook();
      goToGlobalOffset(offset);
    }, 250);
  });
}

/* ============================ 设置变更 ============================ */
function changeFont(delta) {
  settings.fontSize = Math.max(14, Math.min(32, settings.fontSize + delta));
  applySettingsToCSS(); saveSettings(); afterSettingsChange();
}
function changeLineHeight(v) {
  settings.lineHeight = v; lineHeightVal.textContent = v.toFixed(1);
  applySettingsToCSS(); saveSettings(); afterSettingsChange();
}
function changeMargin(v) {
  settings.margin = v; marginVal.textContent = v;
  applySettingsToCSS(); saveSettings(); afterSettingsChange();
}
function changeTheme(t) {
  settings.theme = t; applyTheme(t); saveSettings();
  if (state.epub) applyEpubSettings();
}
function changeFontWeight(w) {
  settings.fontWeight = w;
  applySettingsToCSS(); saveSettings(); afterSettingsChange();
}

// 设置变化后：TXT 重排并保持当前位置；EPUB 应用字号行距
function afterSettingsChange() {
  if (!state.currentBook) return;
  if (state.currentBook.type === 'epub') { applyEpubSettings(); return; }
  const total = state.chapterOffsets[state.chapterOffsets.length - 1] || 1;
  const page = state.pages[state.currentPage];
  const offset = state.chapterOffsets[page.chapterIndex] + page.start;
  paginateBook();
  goToGlobalOffset(offset);
}

/* ============================ 复制文本 ============================ */
function copyText(t) {
  if (!t) { toast('未选中文字'); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t).then(() => toast('已复制')).catch(() => fallbackCopy(t));
  } else {
    fallbackCopy(t);
  }
}
function fallbackCopy(t) {
  const ta = document.createElement('textarea');
  ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast('已复制'); } catch (e) { toast('复制失败'); }
  document.body.removeChild(ta);
}
