import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import getDb from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
  }

  const { id } = await params;
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'לא נבחרה תמונה' }, { status: 400 });
  }

  const ext = file.name.split('.').pop();
  const filename = `product_${id}_${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'products');

  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

  const imagePath = `/products/${filename}`;
  const db = getDb();
  db.prepare('UPDATE products SET image_path = ? WHERE id = ?').run(imagePath, id);

  return NextResponse.json({ image_path: imagePath });
}
