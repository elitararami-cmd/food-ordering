import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export interface CartItem {
  product_id: number;
  product_name: string;
  unit: 'kg' | 'box';
  quantity: number;
  price: number;
}

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
  }

  const db = getDb();
  const orders = db.prepare(`
    SELECT o.*, GROUP_CONCAT(oi.product_name || ' x' || oi.quantity || ' ' || oi.unit) as items_summary
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `).all();

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const { customer_name, customer_phone, delivery_date, notes, items } = await req.json();

  if (!customer_name || !customer_phone || !delivery_date || !items?.length) {
    return NextResponse.json({ error: 'שדות חסרים' }, { status: 400 });
  }

  const total = (items as CartItem[]).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const db = getDb();
  const order = db.prepare(
    'INSERT INTO orders (customer_name, customer_phone, delivery_date, notes, total) VALUES (?, ?, ?, ?, ?)'
  ).run(customer_name, customer_phone, delivery_date, notes || '', total);

  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, product_name, unit, quantity, price) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (const item of items as CartItem[]) {
    insertItem.run(order.lastInsertRowid, item.product_id, item.product_name, item.unit, item.quantity, item.price);
  }

  return NextResponse.json({ id: order.lastInsertRowid });
}
