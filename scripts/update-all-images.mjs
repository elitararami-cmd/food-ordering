import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'Food Photos');
const dest = join(root, 'public', 'food');

mkdirSync(dest, { recursive: true });

// Copy all photos with clean names
const copies = [
  ['Fried_Potato.jpg',                              'fried-potato.jpg'],
  ['Gargirei_Hummus.jpg',                           'gargirei-hummus.jpg'],
  ['Hamuzim.jpg',                                   'hamuzim.jpg'],
  ['Hummus.jpg',                                    'hummus.jpg'],
  ['Kruv_Aim_Tiras.jpg',                            'kruv-tiras.jpg'],
  ['Marroco_Fish_1.jpg',                            'marroco-fish-1.jpg'],
  ['Marroco_Fish_2.jpg',                            'marroco-fish-2.jpg'],
  ['Metuganim.jpg',                                 'metuganim.jpg'],
  ['Olives.jpg',                                    'olives.jpg'],
  ['Selek.jpeg',                                    'selek.jpg'],
  ['Tehina.jpg',                                    'tehina.jpg'],
  ['Tomato_Salad.jpg',                              'tomato-salad.jpg'],
  ['WhatsApp Image 2026-05-29 at 16.46.00.jpeg',    'veggies-pickled.jpg'],
  ['WhatsApp Image 2026-05-29 at 16.46.01 (7).jpeg','dish7.jpg'],
];

for (const [from, to] of copies) {
  try {
    copyFileSync(join(src, from), join(dest, to));
    console.log(`Copied: ${from} → ${to}`);
  } catch (e) {
    console.error(`Failed: ${from} → ${e.message}`);
  }
}

// Update product images in DB
const db = new Database(join(root, 'data', 'store.db'));

const updates = [
  ['שניצל עוף',   '/food/metuganim.jpg'],
  ['מרק עוף',     '/food/marroco-fish-1.jpg'],
  ['אורז בסמטי',  '/food/gargirei-hummus.jpg'],
  ['עוף בתנור',   '/food/marroco-fish-2.jpg'],
  ['קציצות בשר',  '/food/fried-potato.jpg'],
  ['סלט ירקות',   '/food/tomato-salad.jpg'],
  ['חומוס ביתי',  '/food/hummus.jpg'],
  ['טחינה גולמית','/food/tehina.jpg'],
  ['עלי גפן',     '/food/olives.jpg'],
  ['כרוב ממולא',  '/food/kruv-tiras.jpg'],
];

for (const [name, path] of updates) {
  const r = db.prepare('UPDATE products SET image_path = ? WHERE name = ?').run(path, name);
  console.log(`DB: ${name} → ${path} (${r.changes} rows)`);
}

db.close();
console.log('\nDone! Clear image cache next.');
