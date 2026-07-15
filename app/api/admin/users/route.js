import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const db = getDb();
    // Exclude super_admin accounts so the main superadmin account cannot be altered/deleted in sub-admin management
    const result = await db.execute("SELECT id, username, email, role, is_active, profile_image, created_at FROM users WHERE role != 'super_admin' ORDER BY created_at DESC");
    const data = result.rows.map(u => ({
      ...u,
      name: u.username
    }));
    return NextResponse.json(data);
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
    const { name, email, username, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan password wajib diisi' }, { status: 422 });
    }

    const finalUsername = username || name || email.split('@')[0];

    const db = getDb();
    const existing = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1',
      args: [email, finalUsername]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ message: 'Email atau username sudah terdaftar' }, { status: 422 });
    }

    const hashedPassword = await hashPassword(password);
    const userRole = 'sub_admin'; // Always force sub_admin for created accounts
    const isActive = 1;

    const insertResult = await db.execute({
      sql: 'INSERT INTO users (username, email, password, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, DATETIME("now"), DATETIME("now"))',
      args: [finalUsername, email, hashedPassword, userRole, isActive]
    });

    return NextResponse.json({
      id: Number(insertResult.lastInsertRowid),
      name: finalUsername,
      username: finalUsername,
      email,
      role: userRole,
      is_active: true,
      message: 'Sub-admin baru berhasil dibuat'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
