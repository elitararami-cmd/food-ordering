import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
  }

  const { id } = await params;
  const { name, description, price, unit, active } = await req.json();
  const db = getDb();

  db.prepare(
    'UPDATE products SET name=?, description=?, price=?, unit=?, active=? WHERE id=?'
  ).run(name, description || '', price, unit, active ? 1 : 0, id);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
