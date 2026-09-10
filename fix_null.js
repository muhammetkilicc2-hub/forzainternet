const fs = require('fs');
let raw = fs.readFileSync('lib/data.ts', 'utf8');
let clean = raw.replace(/\x00/g, '');
fs.writeFileSync('lib/data.ts', clean);
