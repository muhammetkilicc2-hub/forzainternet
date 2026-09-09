const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Replace sari gunluk
content = content.replace(
  /<span style={{ fontSize: "13\.5px", color: "#cbd5e1" }}>Gün Boyu Paket<\/span>\s*<strong style={{ fontSize: "18px", color: "#ffd700", fontWeight: 800 }}>₺\{pricing\.sari\.gunluk\}<\/strong>/g,
  '<span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>\\n                    <strong style={{ fontSize: "18px", color: "#ffd700", fontWeight: 800 }}>₺{pricing.sari.gunluk}</strong>'
);

// Replace mavi gunluk and add 10 saat
content = content.replace(
  /<span style={{ fontSize: "13\.5px", color: "#cbd5e1" }}>Gün Boyu Paket<\/span>\s*<strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺\{pricing\.mavi\.gunluk\}<\/strong>/g,
  '<span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>10 Saatlik Paket</span>\\n                    <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.onSaatlik || 450}</strong>\\n                  </div>\\n                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>\\n                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>\\n                    <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.gunluk}</strong>'
);

// Replace yesil gunluk and add 10 saat
content = content.replace(
  /<span style={{ fontSize: "13\.5px", color: "#cbd5e1" }}>Gün Boyu Paket<\/span>\s*<strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺\{pricing\.yesil\.gunluk\}<\/strong>/g,
  '<span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>10 Saatlik Paket</span>\\n                    <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.onSaatlik || 650}</strong>\\n                  </div>\\n                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>\\n                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>\\n                    <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.gunluk}</strong>'
);

fs.writeFileSync('app/page.tsx', content);
