import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, generateToken, validateApiKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Unauthorized API Key' }, { status: 401 });
  }

  try {
    const { name, email, username, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Semua bidang wajib diisi' }, { status: 422 });
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
    const userRole = 'admin'; // default role
    const isActive = 0; // Perlu persetujuan super admin

    const insertResult = await db.execute({
      sql: 'INSERT INTO users (name, email, username, password, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, DATETIME("now"), DATETIME("now"))',
      args: [name, email, username || email.split('@')[0], hashedPassword, userRole, isActive]
    });

    return NextResponse.json({
      message: 'Pendaftaran berhasil. Silakan tunggu persetujuan Super Admin untuk mengaktifkan akun Anda.',
      is_active: false
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
