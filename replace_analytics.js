const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');

// Replace the Analytics Memory code with Firebase async code

const oldBlockStart = "declare global {\\s*var __forzaAnalytics:";
const oldBlockEnd = "return an;\\s*}\\s*$"; // Needs precise regex or just string replacement

// Let's use a simpler node script strategy
