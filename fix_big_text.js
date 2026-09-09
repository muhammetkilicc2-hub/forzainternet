const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');
page = page.replace(/FORZA GAMING &amp; INTERNET CAFE/g, 'FORZA E-SPORTS &amp; GAMING CAFE');
page = page.replace(/Forza Gaming &amp; İnternet Cafe'ye Bekleriz/g, "Forza E-Sports &amp; Gaming Cafe'ye Bekleriz");
fs.writeFileSync('app/page.tsx', page);
console.log("Big text fixed.");
