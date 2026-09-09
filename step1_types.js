const fs = require('fs');

let types = fs.readFileSync('lib/types.ts', 'utf8');
if (!types.includes('AnalyticsData')) {
    types += \\n\nexport interface AnalyticsData {
  visitors: {
    total: number;
    today: number;
    lastDate: string;
  };
  pageViews: Record<string, number>;
  clicks: {
    map: number;
    phone: number;
  };
}\n\;
    fs.writeFileSync('lib/types.ts', types);
}
