const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');
let ozellikler = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

const m = 'onClick={() => { fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "click", type: "map" }) }) }} ';
const p = 'onClick={() => { fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "click", type: "phone" }) }) }} ';

page = page.split('<a href="tel:05464659693"').join('<a ' + p + ' href="tel:05464659693"');
page = page.split('<a href="https://maps.google.com').join('<a ' + m + ' href="https://maps.google.com');
fs.writeFileSync('app/page.tsx', page);

ozellikler = ozellikler.split('<a href="tel:05464659693"').join('<a ' + p + ' href="tel:05464659693"');
fs.writeFileSync('app/ozellikler/page.tsx', ozellikler);

console.log("Clicks added");
