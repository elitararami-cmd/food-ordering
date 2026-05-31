import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'store.db');
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    unit TEXT NOT NULL CHECK(unit IN ('kg', 'box')),
    image_path TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const existing = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (existing.count > 0) {
  console.log('Products already seeded, skipping.');
  db.close();
  process.exit(0);
}

const products = [
  { name: 'תפוח אדמה מטוגן',      description: '5 יחידות תפוחי אדמה מצופים בפירורי לחם', price: 25, unit: 'box', image_path: '/food/metuganim.jpg' },
  { name: 'דג מרוקאי',             description: 'דג מרוקאי חריף בתיבול',                   price: 15, unit: 'box', image_path: '/food/marroco-fish-1.jpg' },
  { name: 'גרגירי חומוס',          description: 'גרגירי חומוס מתובלים',                    price: 15, unit: 'kg',  image_path: '/food/gargirei-hummus.jpg' },
  { name: 'דג מרוקאי אדום',        description: '5 יחידות דג מרוקאי אדום בתיבול חריף',    price: 25, unit: 'box', image_path: '/food/marroco-fish-2.jpg' },
  { name: 'תפוח אדמה בתנור',       description: 'תפוח אדמה קריספי מתובל',                  price: 20, unit: 'box', image_path: '/food/fried-potato.jpg' },
  { name: 'סלט עגבניות פיקנטי',    description: '',                                          price: 20, unit: 'kg',  image_path: '/food/tomato-salad.jpg' },
  { name: 'חומוס ביתי',            description: 'חומוס טחון טרי עם טחינה ושמן זית',        price: 15, unit: 'box', image_path: '/food/hummus.jpg' },
  { name: 'טחינה גולמית',          description: 'טחינה ביתית קרמית',                       price: 28, unit: 'kg',  image_path: '/food/tehina.jpg' },
  { name: 'זיתים סורים מתובלים',   description: '',                                          price: 15, unit: 'box', image_path: '/food/olives.jpg' },
  { name: 'סלט כרוב',              description: 'סלט כרוב עם נגיעות תירס',                 price: 22, unit: 'box', image_path: '/food/kruv-tiras.jpg' },
];

const insert = db.prepare(
  'INSERT INTO products (name, description, price, unit, image_path, active) VALUES (?, ?, ?, ?, ?, 1)'
);

for (const p of products) {
  insert.run(p.name, p.description, p.price, p.unit, p.image_path);
  console.log('Seeded:', p.name);
}

db.close();
console.log('Done seeding products.');
