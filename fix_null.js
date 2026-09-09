const fs = require('fs');
let dataFile = fs.readFileSync('lib/data.ts');
// Convert from possible UTF-16 LE to string if needed, or just clean it.
// Actually, fs.readFileSync with 'utf8' on a utf-16le file is messy.
let str = dataFile.toString('utf16le');
if (str.includes('export function trackClick')) {
  // It's mostly utf16le now? No, the first part was utf8, the appended part was utf16le because of powershell out-file / echo.
}

let raw = fs.readFileSync('lib/data.ts', 'utf8');
let clean = raw.replace(/\x00/g, '');
fs.writeFileSync('lib/data.ts', clean);
console.log("Null bytes removed.");
