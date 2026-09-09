const fs = require('fs');

let dataFile = fs.readFileSync('lib/data.ts', 'utf8');

const analyticsCode = \

// ------------------------------------------------------------------
// ANALYTICS LAYER
// ------------------------------------------------------------------

const DEFAULT_ANALYTICS: import('./types').AnalyticsData = {
  visitors: { total: 0, today: 0, lastDate: new Date().toISOString().split('T')[0] },
  pageViews: { home: 0, ozellikler: 0, hakkimizda: 0 },
  clicks: { map: 0, phone: 0 }
};

export async function getAnalytics(): Promise<import('./types').AnalyticsData> {
  try {
    const dbData = await readData<import('./types').AnalyticsData>("analytics", "site_analytics.json");
    
    // Check if a new day has started to reset the 'today' counter
    const currentDate = new Date().toISOString().split('T')[0];
    if (dbData && dbData.visitors && dbData.visitors.lastDate !== currentDate) {
      dbData.visitors.today = 0;
      dbData.visitors.lastDate = currentDate;
      await writeData("analytics", "site_analytics.json", dbData);
    }
    
    if (dbData && dbData.visitors) return dbData;
    return DEFAULT_ANALYTICS;
  } catch (err) {
    return DEFAULT_ANALYTICS;
  }
}

export async function incrementAnalytics(action: 'pageview' | 'click', pathOrType: string): Promise<import('./types').AnalyticsData> {
  const current = await getAnalytics();
  
  if (action === 'pageview') {
    current.visitors.total += 1;
    current.visitors.today += 1;
    
    if (pathOrType === '/' || pathOrType === 'home') {
      current.pageViews.home += 1;
    } else if (pathOrType.includes('ozellikler')) {
      current.pageViews.ozellikler += 1;
    } else if (pathOrType.includes('hakkimizda')) {
      current.pageViews.hakkimizda += 1;
    }
  } else if (action === 'click') {
    if (pathOrType === 'map') {
      current.clicks.map += 1;
    } else if (pathOrType === 'phone') {
      current.clicks.phone += 1;
    }
  }

  await writeData("analytics", "site_analytics.json", current);
  return current;
}
\;

if(!dataFile.includes('incrementAnalytics')) {
    fs.appendFileSync('lib/data.ts', analyticsCode);
}
console.log("data.ts updated with analytics functions");
