import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const db = getDb();
    const result = await db.execute('SELECT id, name, email, username, role, is_active, profile_image, created_at FROM users ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  if (user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Hanya Super Admin yang berhak menambahkan admin baru.' }, { status: 403 });
  }

  try {
    const { name, email, username, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nama, email, dan password wajib diisi' }, { status: 422 });
    }

    const db = getDb();
    const existing = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1',
      args: [email, username || email]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ message: 'Email atau username sudah terdaftar' }, { status: 422 });
    }

    const hashedPassword = await hashPassword(password);
    const userRole = role || 'admin';
    const isActive = 1; // Direct creation by super_admin is active by default

    const insertResult = await db.execute({
      sql: 'INSERT INTO users (name, email, username, password, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, DATETIME("now"), DATETIME("now"))',
      args: [name, email, username || email.split('@')[0], hashedPassword, userRole, isActive]
    });

    return NextResponse.json({
      id: Number(insertResult.lastInsertRowid),
      name,
      email,
      username: username || email.split('@')[0],
      role: userRole,
      is_active: true,
      message: 'Admin baru berhasil dibuat'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
