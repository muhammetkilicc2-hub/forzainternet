const fs = require('fs');
let content = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

// Replace Sari button
const oldSariBtnRegex = /<a href="tel:05464659693" className="primary-btn" style=\{\{ width: "100%"[\s\S]*?<\/a>/;
content = content.replace(oldSariBtnRegex, \<a href="tel:05464659693" className="btn-sari">\\n                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara\\n              </a>\);

// Replace Mavi button
const oldMaviBtnRegex = /<a href="tel:05464659693" className="primary-btn" style=\{\{ width: "100%"[\s\S]*?<\/a>/;
content = content.replace(oldMaviBtnRegex, \<a href="tel:05464659693" className="btn-mavi">\\n                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara\\n              </a>\);

// Replace Yesil button
const oldYesilBtnRegex = /<a href="tel:05464659693" className="primary-btn" style=\{\{ width: "100%"[\s\S]*?<\/a>/;
content = content.replace(oldYesilBtnRegex, \<a href="tel:05464659693" className="btn-yesil">\\n                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara\\n              </a>\);

fs.writeFileSync('app/ozellikler/page.tsx', content);
