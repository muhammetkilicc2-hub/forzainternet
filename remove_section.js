const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// The section string to remove
const sectionRegex = /<section className="home-section" id="ozellikler"[\s\S]*?<\/section>/;
content = content.replace(sectionRegex, '');

fs.writeFileSync('app/page.tsx', content);
