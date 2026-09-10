const fs = require('fs');
const files = ['components/public/WhatsAppWidget.tsx', 'components/public/Footer.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/https:\/\/wa\.me\/905464659693\?text=/g, "whatsapp://send?phone=905464659693&text=");
  fs.writeFileSync(file, content);
}
console.log("WhatsApp links updated.");
