const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');

// Reset global data
const initRegex = /globalThis\.__forzaAnalytics = \{[\s\S]*?\};/;
const newInit = \globalThis.__forzaAnalytics = {
      toplamZiyaret: 0,
      tekilZiyaret: 0,
      bugunZiyaret: 0,
      anlikCanliKullanici: 1,
      kategoriBakilma: { sari: 0, mavi: 0, yesil: 0 },
      cihazDagilimi: { mobil: 0, masaustu: 0 },
      pageViews: { home: 0, ozellikler: 0, hakkimizda: 0 },
      clicks: { map: 0, phone: 0 },
      history: [],
      sonGuncelleme: new Date().toISOString(),
    };\;
content = content.replace(initRegex, newInit);

// Replace track functions
const trackRegex = /export function trackClick[\s\S]*?return an;\s*\}/;
const newTrack = \
function getTodayHistory(an) {
  const today = new Date().toISOString().split('T')[0];
  if (!an.history) an.history = [];
  let dayStat = an.history.find(h => h.date === today);
  if (!dayStat) {
    dayStat = { date: today, views: 0, mapClicks: 0, phoneClicks: 0 };
    an.history.push(dayStat);
  }
  // Keep only last 30 days
  if (an.history.length > 30) an.history.shift();
  return dayStat;
}

export function trackClick(type: "map" | "phone") {
  const an = globalThis.__forzaAnalytics!;
  if (an.clicks[type] !== undefined) an.clicks[type] += 1;
  
  const dayStat = getTodayHistory(an);
  if (type === "map") dayStat.mapClicks += 1;
  if (type === "phone") dayStat.phoneClicks += 1;
  
  an.sonGuncelleme = new Date().toISOString();
  return an;
}

export function trackPageView(page: "home" | "ozellikler" | "hakkimizda") {
  const an = globalThis.__forzaAnalytics!;
  if (an.pageViews[page] !== undefined) {
    an.pageViews[page] += 1;
    an.toplamZiyaret += 1;
    an.bugunZiyaret += 1;
    
    const dayStat = getTodayHistory(an);
    dayStat.views += 1;
  }
  an.sonGuncelleme = new Date().toISOString();
  return an;
}\;
content = content.replace(trackRegex, newTrack);

fs.writeFileSync('lib/data.ts', content);
console.log("data.ts updated with real history tracking");
