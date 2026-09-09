const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');
content = content.replace(/<Link href="\/rezerve" className="primary-btn"([^>]*)>([\s\S]*?)<\/Link>/g, 
  '<a href="tel:05464659693" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "block" }}>Hemen Bizi Ara</a>'
);
fs.writeFileSync('app/page.tsx', content);
