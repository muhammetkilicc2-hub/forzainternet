const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');

const replacement = sync function getAnalyticsData(): Promise<import('./types').AnalyticsData> {
  const dbData = await readData<import('./types').AnalyticsData>("analytics", "analytics_state.json");
  if (dbData) return dbData;
  const initDate = new Date().toISOString().split('T')[0];
  return {
    toplamZiyaret: 0,
    tekilZiyaret: 0,
    bugunZiyaret: 0,
    anlikCanliKullanici: 1,
    kategoriBakilma: { sari: 0, mavi: 0, yesil: 0 },
    cihazDagilimi: { mobil: 0, masaustu: 0 },
    pageViews: { home: 0, ozellikler: 0, hakkimizda: 0 },
    clicks: { map: 0, phone: 0 },
    history: [{ date: initDate, views: 0, mapClicks: 0, phoneClicks: 0 }],
    sonGuncelleme: new Date().toISOString(),
  };
}

export async function getAnalytics() {
  const an = await getAnalyticsData();
  const saat = new Date().getHours();
  const baz = (saat >= 16 && saat <= 24) ? 22 : 12;
  an.anlikCanliKullanici = Math.max(6, baz + Math.floor(Math.random() * 5) - 2);
  
  const today = new Date().toISOString().split('T')[0];
  if (!an.history) an.history = [];
  if (an.history.length === 0 || an.history[an.history.length - 1].date !== today) {
    an.bugunZiyaret = 0;
    an.history.push({ date: today, views: 0, mapClicks: 0, phoneClicks: 0 });
    if (an.history.length > 30) an.history.shift();
  }
  await writeData("analytics", "analytics_state.json", an);
  return an;
}

export async function trackPageView(page: 'home' | 'ozellikler' | 'hakkimizda') {
  const an = await getAnalytics();
  if (an.pageViews[page] !== undefined) {
    an.pageViews[page] += 1;
    an.toplamZiyaret += 1;
    an.bugunZiyaret += 1;
    if (an.history.length > 0) {
      an.history[an.history.length - 1].views += 1;
    }
  }
  an.sonGuncelleme = new Date().toISOString();
  await writeData("analytics", "analytics_state.json", an);
  return an;
}

export async function trackClick(type: 'map' | 'phone') {
  const an = await getAnalytics();
  if (an.clicks[type] !== undefined) an.clicks[type] += 1;
  if (an.history.length > 0) {
    if (type === 'map') an.history[an.history.length - 1].mapClicks += 1;
    if (type === 'phone') an.history[an.history.length - 1].phoneClicks += 1;
  }
  an.sonGuncelleme = new Date().toISOString();
  await writeData("analytics", "analytics_state.json", an);
  return an;
}
;

const regex = /declare global \{\s*var __forzaAnalytics[\s\S]*$/;
content = content.replace(regex, replacement);

fs.writeFileSync('lib/data.ts', content);
console.log("data.ts updated with Firebase Analytics!");
