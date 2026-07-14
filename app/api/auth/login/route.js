import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { comparePassword, generateToken, validateApiKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Unauthorized API Key' }, { status: 401 });
  }

  try {
    const { email, username, password } = await request.json();
    const identifier = email || username;

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Email/username dan password wajib diisi' }, { status: 422 });
    }

    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1',
      args: [identifier, identifier]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Kredensial tidak cocok dengan data kami' }, { status: 401 });
    }

    const user = result.rows[0];

    // Check active status
    if (user.is_active === 0 || user.is_active === false) {
      return NextResponse.json({ message: 'Akun Anda belum diaktifkan/disetujui oleh Super Admin.' }, { status: 403 });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Kredensial tidak cocok dengan data kami' }, { status: 401 });
    }

    const token = generateToken({
      id: user.id,
      name: user.username,
      email: user.email,
      username: user.username,
      role: user.role
    });

    const userPayload = {
      id: user.id,
      name: user.username,
      email: user.email,
      username: user.username,
      role: user.role,
      profile_image: user.profile_image
    };

    return NextResponse.json({
      message: 'Login berhasil',
      token,
      user: userPayload
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
