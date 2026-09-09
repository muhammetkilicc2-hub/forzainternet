const fs = require('fs');
let content = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

const sariSpecs = 
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-microchip" style={{ color: "#ffd700", width: "16px" }}></i> Nvidia RTX 3060 & Intel i5
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-memory" style={{ color: "#ffd700", width: "16px" }}></i> 16GB DDR4 Yüksek Hızlı RAM
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-desktop" style={{ color: "#ffd700", width: "16px" }}></i> 144Hz Espor Monitör
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-wifi" style={{ color: "#ffd700", width: "16px" }}></i> 1000 Mbps Fiber İnternet
                </li>
              </ul>
;
content = content.replace(/<p style=\{\{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px", lineHeight: 1\.5 \}\}>\s*<i className="fa-solid fa-microchip"[\s\S]*?<\/p>/, sariSpecs);

const maviSpecs = 
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-microchip" style={{ color: "#38bdf8", width: "16px" }}></i> RTX 3060 OC & Intel i5 Gaming
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-memory" style={{ color: "#38bdf8", width: "16px" }}></i> 16GB DDR4 Yüksek Hızlı RAM
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-desktop" style={{ color: "#38bdf8", width: "16px" }}></i> 240Hz Espor Monitör
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-headphones" style={{ color: "#38bdf8", width: "16px" }}></i> Pro Espor Ekipmanları
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-wifi" style={{ color: "#38bdf8", width: "16px" }}></i> 1000 Mbps Fiber İnternet
                </li>
              </ul>
;
content = content.replace(/<p style=\{\{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px", lineHeight: 1\.5 \}\}>\s*<i className="fa-solid fa-microchip"[\s\S]*?<\/p>/, maviSpecs);

const yesilSpecs = 
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-microchip" style={{ color: "#34d399", width: "16px" }}></i> RTX 3070 Ti / 5060 & Ryzen 7 7800X3D
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-memory" style={{ color: "#34d399", width: "16px" }}></i> 32GB DDR5 Yüksek Frekans RAM
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-desktop" style={{ color: "#34d399", width: "16px" }}></i> 540Hz Turnuva Monitörü
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-crown" style={{ color: "#34d399", width: "16px" }}></i> Özel VIP Turnuva Odası
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-wifi" style={{ color: "#34d399", width: "16px" }}></i> 1000 Mbps Fiber İnternet
                </li>
              </ul>
;
content = content.replace(/<p style=\{\{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px", lineHeight: 1\.5 \}\}>\s*<i className="fa-solid fa-microchip"[\s\S]*?<\/p>/, yesilSpecs);

fs.writeFileSync('app/ozellikler/page.tsx', content);
