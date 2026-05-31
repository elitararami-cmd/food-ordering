import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'store.db');
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const db = new Database(dbPath);

const products = [
  { name: 'מרק עוף', description: 'מרק עוף ביתי עם ירקות ואטריות', price: 35, unit: 'box', image_path: '/food/dish9.jpg' },
  { name: 'אורז בסמטי', description: 'אורז מבושם עם עשבי תיבול', price: 25, unit: 'kg', image_path: '/food/dish5.jpg' },
  { name: 'עוף בתנור', description: 'עוף שלם צלוי עם ירקות שורש', price: 65, unit: 'box', image_path: '/food/braised-meat.jpg' },
  { name: 'קציצות בשר', description: 'קציצות בשר טחון ברוטב עגבניות', price: 55, unit: 'box', image_path: '/food/dish7.jpg' },
  { name: 'סלט ירקות', description: 'סלט ירקות טרי קצוץ דק', price: 20, unit: 'kg', image_path: '/food/beet-salad.jpg' },
  { name: 'חומוס ביתי', description: 'חומוס טחון טרי עם טחינה ושמן זית', price: 30, unit: 'box', image_path: '/food/tahini-sauce.jpg' },
  { name: 'טחינה גולמית', description: 'טחינה ביתית קרמית', price: 28, unit: 'kg', image_path: '/food/tahini-sauce.jpg' },
  { name: 'עלי גפן', description: 'עלי גפן ממולאים באורז ובשר', price: 45, unit: 'box', image_path: '/food/dish13.jpg' },
  { name: 'כרוב ממולא', description: 'כרוב ממולא בבשר וירקות ברוטב חמוץ-מתוק', price: 50, unit: 'box', image_path: '/food/dish11.jpg' },
];

const insert = db.prepare(
  'INSERT OR IGNORE INTO products (name, description, price, unit, image_path, active) VALUES (?, ?, ?, ?, ?, 1)'
);

for (const p of products) {
  insert.run(p.name, p.description, p.price, p.unit, p.image_path);
  console.log('Added:', p.name);
}

db.close();
console.log('Done!');
