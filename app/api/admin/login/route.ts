import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getDb from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const db = getDb();

  // Create default admin on first run
  const existing = db.prepare('SELECT * FROM admin WHERE id = 1').get() as { id: number; username: string; password: string } | undefined;
  if (!existing) {
    const hashed = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admin (id, username, password) VALUES (1, ?, ?)').run('admin', hashed);
  }

  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username) as { id: number; username: string; password: string } | undefined;
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return NextResponse.json({ error: 'שם משתמש או סיסמה שגויים' }, { status: 401 });
  }

  const token = signToken({ id: admin.id, username: admin.username });

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', token, { httpOnly: true, maxAge: 60 * 60 * 8 });
  return res;
}
