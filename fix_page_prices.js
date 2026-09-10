const fs = require('fs');
let file = fs.readFileSync('app/page.tsx', 'utf8');

function makePill(color, innerHTML) {
  return <strong style={{ fontSize: "16px", fontWeight: 900, color: "", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: "20px" }}></strong>;
}
function makeColoredPill(color, bgRGB, borderRGB, innerHTML) {
  return <strong style={{ fontSize: "18px", fontWeight: 900, color: "", background: "rgba(, 0.15)", border: "1px solid rgba(, 0.4)", padding: "4px 14px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(, 0.2)" }}></strong>;
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

// Fix flex gap in pricing cards in app/page.tsx
file = file.replace(/<div style=\{\{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px"/g, 
  '<div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px"');

fs.writeFileSync('app/page.tsx', file);
