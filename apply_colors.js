const fs = require('fs');

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // SILVER (was Yellow)
  content = content.replace(/255,\s*215,\s*0/g, "148, 163, 184");
  content = content.replace(/#ffd700/g, "#cbd5e1");
  content = content.replace(/#dfb758/g, "#94a3b8");
  
  // GOLD PRO (was Blue)
  content = content.replace(/56,\s*189,\s*248/g, "251, 191, 36");
  content = content.replace(/#38bdf8/g, "#fbbf24");
  
  // PLATINUM (was Green)
  content = content.replace(/52,\s*211,\s*153/g, "168, 85, 247");
  content = content.replace(/#34d399/g, "#c084fc");
  content = content.replace(/#10b981/g, "#9333ea"); // gradient start
  content = content.replace(/#059669/g, "#7e22ce"); // gradient end

  fs.writeFileSync(filePath, content);
}

replaceColors('app/page.tsx');
replaceColors('app/ozellikler/page.tsx');
replaceColors('app/admin/kampanya/page.tsx');

console.log("Colors replaced successfully.");
