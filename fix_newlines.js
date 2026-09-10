const fs = require('fs');
let data = fs.readFileSync('lib/data.ts', 'utf8');

// Replace literal '\\n' with actual newlines
data = data.replace(/\\n/g, '\n');

fs.writeFileSync('lib/data.ts', data);
console.log("Fixed newlines");
