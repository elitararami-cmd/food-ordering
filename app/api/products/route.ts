import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  const db = getDb();
  const products = db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY name').all();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
  }

  const { name, description, price, unit } = await req.json();

  if (!name || !price || !unit) {
    return NextResponse.json({ error: 'שדות חסרים' }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare('INSERT INTO products (name, description, price, unit) VALUES (?, ?, ?, ?)')
    .run(name, description || '', price, unit);

  return NextResponse.json({ id: result.lastInsertRowid });
}
