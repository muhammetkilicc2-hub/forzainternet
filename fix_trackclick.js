const fs = require('fs');
let data = fs.readFileSync('lib/data.ts', 'utf8');

const trackClickCode = \nexport function trackClick(type: 'map' | 'phone') {
  const an = getAnalytics();
  if (an.clicks[type] !== undefined) an.clicks[type] += 1;
  if (an.history.length > 0) {
    if (type === 'map') an.history[an.history.length - 1].mapClicks += 1;
    if (type === 'phone') an.history[an.history.length - 1].phoneClicks += 1;
  }
  an.sonGuncelleme = new Date().toISOString();
  return an;
}\n;

data = data + trackClickCode;
fs.writeFileSync('lib/data.ts', data);
console.log("trackClick added");
