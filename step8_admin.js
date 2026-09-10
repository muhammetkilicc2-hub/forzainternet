const fs = require('fs');

let page = fs.readFileSync('app/admin/kampanya/page.tsx', 'utf8');

// 1. Initial State
page = page.replace(
  /const \[pricing, setPricing\] = useState<PricingConfig>\(\{\n\s*sari: \{ saatlik: 60, besSaatlik: 200, gunluk: 400 \},\n\s*mavi: \{ saatlik: 70, besSaatlik: 250, gunluk: 500 \},\n\s*yesil: \{ saatlik: 90, besSaatlik: 350, gunluk: 700 \},\n\s*\}\);/,
  const [pricing, setPricing] = useState<PricingConfig>({
    sari: { saatlik: 60, besSaatlik: 200, gunluk: 400 },
    mavi: { saatlik: 70, besSaatlik: 250, onSaatlik: 450, gunluk: 500 },
    yesil: { saatlik: 90, besSaatlik: 350, onSaatlik: 650, gunluk: 700 },
  });
);

// 2. handlePriceChange typing
page = page.replace(
  /const handlePriceChange = \(kategori: PcKategori, field: "saatlik" \| "besSaatlik" \| "gunluk", value: number\) => {/,
  const handlePriceChange = (kategori: PcKategori, field: "saatlik" | "besSaatlik" | "onSaatlik" | "gunluk", value: number) => {
);

// 3. Inject the input field
const onSaatlikBlock = 
              {cat.id !== "sari" && (
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    <Zap size={14} style={{ color: "#a855f7" }} />
                    <span>10 Saat Paket (₺)</span>
                  </label>
                  <input
                    type="number"
                    className="settings-input"
                    value={pricing[cat.id].onSaatlik || 0}
                    onChange={(e) => handlePriceChange(cat.id, "onSaatlik", parseInt(e.target.value) || 0)}
                    style={{ fontSize: "16px", fontWeight: 800 }}
                  />
                </div>
              )}
;

page = page.replace(
  /<div className="form-group" style=\{\{ display: "flex", flexDirection: "column", gap: "6px" \}\}>\n\s*<label style=\{\{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" \}\}>\n\s*<SunMedium size=\{14\} style=\{\{ color: "#34d399" \}\} \/>\n\s*<span>Gün Boyu Paket \(₺\)<\/span>\n\s*<\/label>\n\s*<input\n\s*type="number"\n\s*className="settings-input"\n\s*value=\{pricing\[cat\.id\]\.gunluk\}\n\s*onChange=\{\(e\) => handlePriceChange\(cat\.id, "gunluk", parseInt\(e\.target\.value\) \|\| 0\)\}\n\s*style=\{\{ fontSize: "16px", fontWeight: 800 \}\}\n\s*\/>\n\s*<\/div>/,
  onSaatlikBlock + 
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <SunMedium size={14} style={{ color: "#34d399" }} />
                  <span>Gün Boyu Paket (₺)</span>
                </label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].gunluk}
                  onChange={(e) => handlePriceChange(cat.id, "gunluk", parseInt(e.target.value) || 0)}
                  style={{ fontSize: "16px", fontWeight: 800 }}
                />
              </div>
);

fs.writeFileSync('app/admin/kampanya/page.tsx', page);
console.log("updated");
