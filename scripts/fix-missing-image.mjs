import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, '..', 'data', 'store.db'));

db.prepare("UPDATE products SET image_path = '/food/dish10.jpg' WHERE name = 'כרוב ממולא'").run();
db.prepare("UPDATE products SET image_path = '/food/cooking1.jpg' WHERE name = 'מרק עוף'").run();
console.log('Fixed image paths');
db.close();
