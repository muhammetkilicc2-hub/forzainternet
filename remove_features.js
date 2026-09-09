const fs = require('fs');
let content = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

// Remove the features array
content = content.replace(/const features = \[\s*\{[\s\S]*?\}\s*\];/g, '');

// Remove the features mapping grid
content = content.replace(/<div style=\{\{\s*display: "grid",\s*gridTemplateColumns: "repeat\(auto-fit, minmax\(300px, 1fr\)\)",\s*gap: "24px",\s*marginBottom: "60px"\s*\}\}>[\s\S]*?\{\/\* DETAILED PRICING CARDS \*\/\}/g, '{/* DETAILED PRICING CARDS */}');

// Adjust the header
content = content.replace(/Neden Forza Gaming\?/g, 'Sistem Özellikleri');
content = content.replace(/ÖZELLİKLER & HİZMETLERİMİZ/g, 'BİLGİSAYAR ÖZELLİKLERİ VE FİYATLAR');
content = content.replace(/Antalya'nın en iyi espor deneyimini yaşamanız için tüm detayları düşündük. Kesintisiz oyun, turnuva seviyesi ekipmanlar ve üst düzey rahatlığınız için buradayız./g, 'Kafemizdeki masaların donanım özelliklerini ve detaylı fiyat paketlerini aşağıdan inceleyebilirsiniz.');

// Remove the redundant "Detaylı Masa Fiyatları & Paketler" header since the main page header covers it now
content = content.replace(/<div style=\{\{ textAlign: "center", marginBottom: "40px", marginTop: "40px" \}\}>[\s\S]*?<\/div>\s*<div style=\{\{ display: "grid"/g, '<div style={{ display: "grid"');

fs.writeFileSync('app/ozellikler/page.tsx', content);
