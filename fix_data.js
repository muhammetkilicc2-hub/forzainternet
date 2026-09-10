const fs = require('fs');

let dataFile = fs.readFileSync('lib/data.ts', 'utf8');

const codeToInsert = "declare global {\\n  var __forzaAnalytics: import('./types').AnalyticsData | undefined;\\n}\\n\\nif (!globalThis.__forzaAnalytics) {\\n  const initDate = new Date().toISOString().split('T')[0];\\n  globalThis.__forzaAnalytics = {\\n    toplamZiyaret: 0,\\n    tekilZiyaret: 0,\\n    bugunZiyaret: 0,\\n    anlikCanliKullanici: 1,\\n    kategoriBakilma: { sari: 0, mavi: 0, yesil: 0 },\\n    cihazDagilimi: { mobil: 0, masaustu: 0 },\\n    pageViews: { home: 0, ozellikler: 0, hakkimizda: 0 },\\n    clicks: { map: 0, phone: 0 },\\n    history: [{ date: initDate, views: 0, mapClicks: 0, phoneClicks: 0 }],\\n    sonGuncelleme: new Date().toISOString(),\\n  };\\n}\\n\\nexport function getAnalytics() {\\n  const an = globalThis.__forzaAnalytics!;\\n  const saat = new Date().getHours();\\n  const baz = (saat >= 16 && saat <= 24) ? 22 : 12;\\n  an.anlikCanliKullanici = Math.max(6, baz + Math.floor(Math.random() * 5) - 2);\\n  \\n  const today = new Date().toISOString().split('T')[0];\\n  if (!an.history) an.history = [];\\n  if (an.history.length === 0 || an.history[an.history.length - 1].date !== today) {\\n    an.bugunZiyaret = 0;\\n    an.history.push({ date: today, views: 0, mapClicks: 0, phoneClicks: 0 });\\n    if (an.history.length > 30) an.history.shift();\\n  }\\n  return an;\\n}\\n";

// Replace old getAnalytics and any trace of the old object
dataFile = dataFile.replace(/an\.anlikCanliKullanici = Math\.max\([\s\S]*?return an;\n\}/, codeToInsert);

// Fix tracking functions
const trackClick = "export function trackClick(type: 'map' | 'phone') {\\n  const an = getAnalytics();\\n  if (an.clicks[type] !== undefined) an.clicks[type] += 1;\\n  if (an.history.length > 0) {\\n    if (type === 'map') an.history[an.history.length - 1].mapClicks += 1;\\n    if (type === 'phone') an.history[an.history.length - 1].phoneClicks += 1;\\n  }\\n  an.sonGuncelleme = new Date().toISOString();\\n  return an;\\n}";
const trackPage = "export function trackPageView(page: 'home' | 'ozellikler' | 'hakkimizda') {\\n  const an = getAnalytics();\\n  if (an.pageViews[page] !== undefined) {\\n    an.pageViews[page] += 1;\\n    an.toplamZiyaret += 1;\\n    an.bugunZiyaret += 1;\\n    if (an.history.length > 0) {\\n      an.history[an.history.length - 1].views += 1;\\n    }\\n  }\\n  an.sonGuncelleme = new Date().toISOString();\\n  return an;\\n}";

dataFile = dataFile.replace(/export function trackClick\([\s\S]*?return an;\n\}/, trackClick);
dataFile = dataFile.replace(/export function trackPageView\([\s\S]*?return an;\n\}/, trackPage);

fs.writeFileSync('lib/data.ts', dataFile);
