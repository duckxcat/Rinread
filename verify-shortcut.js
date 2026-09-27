// 读回快捷方式的属性，验证目标与图标是否正确
const { execFileSync } = require('child_process');
const ps = [
  "$W = New-Object -ComObject WScript.Shell",
  "$S = $W.CreateShortcut('C:\\Users\\liuch\\Desktop\\粼青之海.lnk')",
  "$out = 'TARGET=' + $S.TargetPath",
  "$out += [Environment]::NewLine + 'ICON=' + $S.IconLocation",
  "$out += [Environment]::NewLine + 'WORK=' + $S.WorkingDirectory",
  "[System.IO.File]::WriteAllText('C:\\Users\\liuch\\Desktop\\claudecode\\build\\lnk-verify.txt', $out)",
].join('\n');
const b64 = Buffer.from(ps, 'utf16le').toString('base64');
execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', b64], { stdio: 'inherit' });
console.log('VERIFY_WRITTEN');
