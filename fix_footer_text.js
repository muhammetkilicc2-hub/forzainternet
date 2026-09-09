const fs = require('fs');
let footer = fs.readFileSync('components/public/Footer.tsx', 'utf8');
footer = footer.replace(/FORZA INTERNET &amp; CAFE/g, 'FORZA E-SPORTS &amp; GAMING CAFE');
footer = footer.replace(/FORZA nternet &amp; Cafe/g, 'FORZA E-SPORTS &amp; GAMING CAFE');
footer = footer.replace(/Forza nternet %26 Cafe/g, 'Forza E-Sports %26 Gaming Cafe');
footer = footer.replace(/Forza Internet Cafe/g, 'Forza E-Sports Gaming Cafe'); // In map links, keep space? It's fine for maps, but sure.
fs.writeFileSync('components/public/Footer.tsx', footer);
console.log("Footer updated");
