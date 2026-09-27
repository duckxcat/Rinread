// 创建桌面快捷方式：指向 dist/win-unpacked/粼青之海.exe，使用圆形图标
const { execFileSync } = require('child_process');

const exe = 'C:\\Users\\liuch\\Desktop\\claudecode\\dist\\win-unpacked\\粼青之海.exe';
const workDir = 'C:\\Users\\liuch\\Desktop\\claudecode\\dist\\win-unpacked';
const icon = 'C:\\Users\\liuch\\Desktop\\claudecode\\build\\icon-circular.ico';
const lnk = 'C:\\Users\\liuch\\Desktop\\粼青之海.lnk';

const ps = [
  "$W = New-Object -ComObject WScript.Shell",
  "$S = $W.CreateShortcut('" + lnk + "')",
  "$S.TargetPath = '" + exe + "'",
  "$S.WorkingDirectory = '" + workDir + "'",
  "$S.IconLocation = '" + icon + ",0'",
  "$S.Description = '粼青之海'",
  "$S.Save()",
].join('\n');

// 用 UTF-16LE base64 传给 -EncodedCommand，避免中文编码问题
const b64 = Buffer.from(ps, 'utf16le').toString('base64');
execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', b64], { stdio: 'inherit' });
console.log('DONE');
