import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')?.trim();
  if (!phone) return NextResponse.json({ isFirst: false, orderCount: 0 });

  const db = getDb();
  const result = db.prepare('SELECT COUNT(*) as count FROM orders WHERE customer_phone = ?').get(phone) as { count: number };
  return NextResponse.json({ isFirst: result.count === 0, orderCount: result.count });
}
