import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  if (user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Hanya Super Admin yang berhak memperbarui admin.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT * FROM users WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    const userOld = existing.rows[0];
    const { name, email, username, password, role } = await request.json();

    let hashedPassword = userOld.password;
    if (password && password.trim() !== '') {
      hashedPassword = await hashPassword(password);
    }

    const finalUsername = username || name || userOld.username;
    const finalEmail = email || userOld.email;
    const finalRole = role || userOld.role;

    await db.execute({
      sql: 'UPDATE users SET username = ?, email = ?, password = ?, role = ?, updated_at = DATETIME("now") WHERE id = ?',
      args: [
        finalUsername,
        finalEmail,
        hashedPassword,
        finalRole,
        id
      ]
    });

    return NextResponse.json({ message: 'Data admin berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request, context) {
  return PUT(request, context);
}

export async function DELETE(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  if (user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Hanya Super Admin yang berhak menghapus akun admin.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });
    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
