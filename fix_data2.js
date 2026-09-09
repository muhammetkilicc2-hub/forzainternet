const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');

content = content.replace(/export async function getComputers[\s\S]*?export async function getGalleryPhotos/g, 'export async function getGalleryPhotos');

fs.writeFileSync('lib/data.ts', content);
