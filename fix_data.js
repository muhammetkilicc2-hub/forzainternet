const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');

// remove createInitialPcList
content = content.replace(/function createInitialPcList\(\)[\s\S]*?return list\.sort\(\(a, b\) => a\.no - b\.no\);\n}\n/g, '');

// remove SARI_IDS, MAVI_IDS, YESIL_IDS
content = content.replace(/const SARI_IDS[\s\S]*?const YESIL_IDS.*?\n/g, '');

// remove getComputers
content = content.replace(/export async function getComputers\(\)[\s\S]*?return initial;\n}\n/g, '');

// remove updateComputerStatus
content = content.replace(/export async function updateComputerStatus[\s\S]*?return lastUpdated;\n}\n/g, '');

// remove getReservations
content = content.replace(/export async function getReservations\(\)[\s\S]*?return Array\.isArray\(dbData\) \? dbData : \[\];\n}\n/g, '');

// remove createReservation
content = content.replace(/export async function createReservation[\s\S]*?return newRez;\n}\n/g, '');

// remove updateReservationStatus
content = content.replace(/export async function updateReservationStatus[\s\S]*?return rez;\n}\n/g, '');

// remove markAllReservationsRead
content = content.replace(/export async function markAllReservationsRead\(\)[\s\S]*?await writeData\("reservations", "rezervasyon_state\.json", list\);\n}\n/g, '');

// replace getStats
content = content.replace(/export async function getStats\(\): Promise<AdminStats> \{[\s\S]*?};\n}/g, 'export async function getStats(): Promise<any> {\n  return { ok: true };\n}');

fs.writeFileSync('lib/data.ts', content);
