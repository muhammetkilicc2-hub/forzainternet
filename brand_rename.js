const fs = require('fs');

// 1. Update app/page.tsx
let page = fs.readFileSync('app/page.tsx', 'utf8');
page = page.replace(/FORZA GAMING & INTERNET CAFE/g, 'FORZA E-SPORTS & GAMING CAFE');
fs.writeFileSync('app/page.tsx', page);

// 2. Update components/public/Navbar.tsx
let nav = fs.readFileSync('components/public/Navbar.tsx', 'utf8');
nav = nav.replace(/<span className="logo-sub">İnternet&Cafe<\/span>/g, '<span className="logo-sub">E-SPORTS & GAMING CAFE</span>');
nav = nav.replace(/<span className="logo-sub">nternet&amp;Cafe<\/span>/g, '<span className="logo-sub">E-SPORTS & GAMING CAFE</span>');
fs.writeFileSync('components/public/Navbar.tsx', nav);

// 3. Update components/public/Footer.tsx
let footer = fs.readFileSync('components/public/Footer.tsx', 'utf8');
footer = footer.replace(/FORZA İNTERNET & CAFE/g, 'FORZA E-SPORTS & GAMING CAFE');
footer = footer.replace(/FORZA NTERNET &amp; CAFE/g, 'FORZA E-SPORTS & GAMING CAFE');
fs.writeFileSync('components/public/Footer.tsx', footer);

// 4. Update app/layout.tsx
let layout = fs.readFileSync('app/layout.tsx', 'utf8');
layout = layout.replace(/FORZA İnternet & Cafe/g, 'FORZA E-SPORTS & GAMING CAFE');
layout = layout.replace(/FORZA nternet & Cafe/g, 'FORZA E-SPORTS & GAMING CAFE');
layout = layout.replace(/Forza İnternet Cafe'ye/g, "Forza E-Sports & Gaming Cafe'ye");
layout = layout.replace(/Forza nternet Cafe'ye/g, "Forza E-Sports & Gaming Cafe'ye");
fs.writeFileSync('app/layout.tsx', layout);

// 5. Update app/hakkimizda/page.tsx
let hakk = fs.readFileSync('app/hakkimizda/page.tsx', 'utf8');
hakk = hakk.replace(/FORZA GAMING/g, 'FORZA E-SPORTS & GAMING CAFE');
fs.writeFileSync('app/hakkimizda/page.tsx', hakk);

console.log("Replaced brand names.");
