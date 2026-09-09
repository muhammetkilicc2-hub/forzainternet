const fs = require('fs');
let content = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

// Remove the contact block at the bottom
const contactBlockRegex = /<div style=\{\{\s*background: "linear-gradient\(135deg, rgba\(255, 215, 0, 0\.1\)[\s\S]*?<\/main>/;
content = content.replace(contactBlockRegex, '        </div>\\n      </main>');

// Enhance Sarı Masa card style
content = content.replace(
  /background: "rgba\(14, 18, 26, 0\.88\)", border: "1px solid rgba\(255, 215, 0, 0\.35\)", borderRadius: "24px", padding: "28px 24px"/,
  'background: "linear-gradient(145deg, rgba(20, 25, 35, 0.95) 0%, rgba(30, 25, 10, 0.95) 100%)", border: "1px solid rgba(255, 215, 0, 0.6)", borderRadius: "24px", padding: "32px 28px", boxShadow: "0 10px 40px rgba(255, 215, 0, 0.15)", position: "relative", overflow: "hidden"'
);

// Add a glowing orb inside Sari Masa
content = content.replace(
  /STANDART GAMING<\/span>\s*<\/div>/,
  'STANDART GAMING</span>\\n              </div>\\n              <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0) 70%)", borderRadius: "50%", pointerEvents: "none" }}></div>'
);

// Enhance Mavi Masa card style
content = content.replace(
  /background: "rgba\(14, 18, 26, 0\.88\)", border: "1px solid rgba\(56, 189, 248, 0\.35\)", borderRadius: "24px", padding: "28px 24px"/,
  'background: "linear-gradient(145deg, rgba(20, 25, 35, 0.95) 0%, rgba(10, 25, 40, 0.95) 100%)", border: "1px solid rgba(56, 189, 248, 0.6)", borderRadius: "24px", padding: "32px 28px", boxShadow: "0 10px 40px rgba(56, 189, 248, 0.15)", position: "relative", overflow: "hidden"'
);

// Add a glowing orb inside Mavi Masa
content = content.replace(
  /PRO ESPOR GAMING<\/span>\s*<\/div>/,
  'PRO ESPOR GAMING</span>\\n              </div>\\n              <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%)", borderRadius: "50%", pointerEvents: "none" }}></div>'
);

// Enhance Yesil Masa card style
content = content.replace(
  /background: "rgba\(14, 18, 26, 0\.88\)", border: "2px solid rgba\(52, 211, 153, 0\.45\)", borderRadius: "24px", padding: "28px 24px", position: "relative", display: "flex", flexDirection: "column"/,
  'background: "linear-gradient(145deg, rgba(20, 25, 35, 0.95) 0%, rgba(10, 30, 20, 0.95) 100%)", border: "2px solid rgba(52, 211, 153, 0.7)", borderRadius: "24px", padding: "32px 28px", boxShadow: "0 10px 50px rgba(52, 211, 153, 0.2)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"'
);

// Add a glowing orb inside Yesil Masa
content = content.replace(
  /ULTRA VIP ESPOR<\/span>\s*<\/div>/,
  'ULTRA VIP ESPOR</span>\\n              </div>\\n              <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, rgba(52, 211, 153, 0) 70%)", borderRadius: "50%", pointerEvents: "none" }}></div>'
);

// Enhance the buttons inside cards (make them pop on hover? they are already good)
// Let's add a nice background for the specs area.
content = content.replace(/background: "rgba\(255, 255, 255, 0\.03\)", borderRadius: "16px", border: "1px solid rgba\(255, 255, 255, 0\.06\)"/g, 'background: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)"');

fs.writeFileSync('app/ozellikler/page.tsx', content);
