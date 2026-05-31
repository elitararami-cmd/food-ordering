import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);

  return NextResponse.json({ ...order as object, items });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();
  const db = getDb();
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);

  return NextResponse.json({ ok: true });
}
