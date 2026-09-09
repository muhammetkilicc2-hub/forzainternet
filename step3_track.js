const fs = require('fs');
let dataFile = fs.readFileSync('lib/data.ts', 'utf8');

const clickMethod = 
export function trackClick(type: "map" | "phone") {
  const an = globalThis.__forzaAnalytics!;
  if (an.clicks[type] !== undefined) an.clicks[type] += 1;
  an.sonGuncelleme = new Date().toISOString();
  return an;
}

export function trackPageView(page: "home" | "ozellikler" | "hakkimizda") {
  const an = globalThis.__forzaAnalytics!;
  if (an.pageViews[page] !== undefined) {
    an.pageViews[page] += 1;
    an.toplamZiyaret += 1;
    an.bugunZiyaret += 1;
  }
  an.sonGuncelleme = new Date().toISOString();
  return an;
}
;

dataFile = dataFile + '\\n' + clickMethod;
fs.writeFileSync('lib/data.ts', dataFile);
console.log("Tracking added.");
