const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');
content = content.replace(/const SARI_IDS[\s\S]*?function createInitialPcList[\s\S]*?return list\.sort.*?\n}\n/g, '');
content = content.replace(/export async function getStats[\s\S]*?};\n}/g, 'export async function getStats() { return { ok: true }; }');
fs.writeFileSync('lib/data.ts', content);
