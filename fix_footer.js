const fs = require('fs');
let content = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

content = content.replace(/\\n/g, '\n');
content = content.replace(/<\/div>\n\s*<\/main>[\s\S]*?<Footer \/>/, '        </div>\n      </main>\n      <Footer />');

fs.writeFileSync('app/ozellikler/page.tsx', content);
