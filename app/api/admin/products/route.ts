import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

// Admin sees all products including inactive
export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
  }

  const db = getDb();
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  return NextResponse.json(products);
}
