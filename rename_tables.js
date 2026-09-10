const fs = require('fs');
const files = [
  'app/page.tsx',
  'app/ozellikler/page.tsx',
  'app/admin/kampanya/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace Sarı Masalar -> Silver Masalar
  content = content.replace(/Sarı Masalar/g, "Silver Masalar");
  
  // Replace Mavi Masalar -> Gold Pro Masalar
  content = content.replace(/Mavi Masalar/g, "Gold Pro Masalar");
  
  // Replace Yeşil Masalar -> Platinum Masalar
  content = content.replace(/Yeşil Masalar/g, "Platinum Masalar");
  
  fs.writeFileSync(file, content);
}

console.log("Text updated.");
