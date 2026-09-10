const fs = require('fs');
let file = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

// 1. Fix the fetch bug
file = file.replace(
  /if\(data && data\.sari\) setPricing\(data\);/,
  "if(data && data.pricing && data.pricing.sari) setPricing(data.pricing);"
);

// 2. Wrap pricing values in pill-shaped badges

// Helper for replacement
function makePill(color, innerHTML) {
  return <strong style={{ fontSize: "16px", fontWeight: 900, color: "", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", padding: "4px 14px", borderRadius: "20px", display: "inline-block" }}></strong>;
}

function makeColoredPill(color, bgRGB, borderRGB, innerHTML) {
  return <strong style={{ fontSize: "18px", fontWeight: 900, color: "", background: "rgba(, 0.15)", border: "1px solid rgba(, 0.4)", padding: "6px 16px", borderRadius: "20px", display: "inline-block", boxShadow: "0 2px 10px rgba(, 0.2)" }}></strong>;
}

// SARI
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#ffffff", fontWeight: 800 \}\}>₺\{pricing\.sari\.saatlik\} <span[\s\S]*?<\/span><\/strong>/g,
  makePill("#ffffff", "₺{pricing.sari.saatlik} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>/ saat</span>")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#ffd700", fontWeight: 800 \}\}>₺\{pricing\.sari\.besSaatlik\}<\/strong>/g,
  makeColoredPill("#ffd700", "255, 215, 0", "255, 215, 0", "₺{pricing.sari.besSaatlik}")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#ffd700", fontWeight: 800 \}\}>₺\{pricing\.sari\.onSaatlik \|\| 200\}<\/strong>/g,
  makeColoredPill("#ffd700", "255, 215, 0", "255, 215, 0", "₺{pricing.sari.onSaatlik || 200}")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#ffd700", fontWeight: 800 \}\}>₺\{pricing\.sari\.gunluk\}<\/strong>/g,
  makeColoredPill("#ffd700", "255, 215, 0", "255, 215, 0", "₺{pricing.sari.gunluk}")
);

// MAVI
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#ffffff", fontWeight: 800 \}\}>₺\{pricing\.mavi\.saatlik\} <span[\s\S]*?<\/span><\/strong>/g,
  makePill("#ffffff", "₺{pricing.mavi.saatlik} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>/ saat</span>")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 \}\}>₺\{pricing\.mavi\.besSaatlik\}<\/strong>/g,
  makeColoredPill("#38bdf8", "56, 189, 248", "56, 189, 248", "₺{pricing.mavi.besSaatlik}")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 \}\}>₺\{pricing\.mavi\.onSaatlik \|\| 450\}<\/strong>/g,
  makeColoredPill("#38bdf8", "56, 189, 248", "56, 189, 248", "₺{pricing.mavi.onSaatlik || 450}")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 \}\}>₺\{pricing\.mavi\.gunluk\}<\/strong>/g,
  makeColoredPill("#38bdf8", "56, 189, 248", "56, 189, 248", "₺{pricing.mavi.gunluk}")
);

// YESIL
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#ffffff", fontWeight: 800 \}\}>₺\{pricing\.yesil\.saatlik\} <span[\s\S]*?<\/span><\/strong>/g,
  makePill("#ffffff", "₺{pricing.yesil.saatlik} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>/ saat</span>")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#34d399", fontWeight: 800 \}\}>₺\{pricing\.yesil\.besSaatlik\}<\/strong>/g,
  makeColoredPill("#34d399", "52, 211, 153", "52, 211, 153", "₺{pricing.yesil.besSaatlik}")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#34d399", fontWeight: 800 \}\}>₺\{pricing\.yesil\.onSaatlik \|\| 650\}<\/strong>/g,
  makeColoredPill("#34d399", "52, 211, 153", "52, 211, 153", "₺{pricing.yesil.onSaatlik || 650}")
);
file = file.replace(
  /<strong style=\{\{ fontSize: "18px", color: "#34d399", fontWeight: 800 \}\}>₺\{pricing\.yesil\.gunluk\}<\/strong>/g,
  makeColoredPill("#34d399", "52, 211, 153", "52, 211, 153", "₺{pricing.yesil.gunluk}")
);

// Adjust container spacing so pills don't clash (add gap)
file = file.replace(/<div style=\{\{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px"/g, 
  '<div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "20px"');

fs.writeFileSync('app/ozellikler/page.tsx', file);
console.log("Prices updated to pill shape and fetch logic fixed.");
