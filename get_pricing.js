const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');
let match = content.match(/<section className="home-section" id="fiyatlar"[\s\S]*?<\/section>/);
if(match) console.log(match[0]);
