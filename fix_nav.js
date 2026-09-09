const fs = require('fs');
let nav = fs.readFileSync('components/public/Navbar.tsx', 'utf8');
nav = nav.replace(/<span className="logo-sub">.*?<\/span>/, '<span className="logo-sub">E-SPORTS &amp; GAMING CAFE</span>');
fs.writeFileSync('components/public/Navbar.tsx', nav);
console.log("Navbar updated");
