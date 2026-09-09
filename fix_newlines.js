const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

content = content.replace(/\\n/g, '\n');

fs.writeFileSync('app/page.tsx', content);
