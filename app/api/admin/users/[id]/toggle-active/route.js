import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  if (user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Hanya Super Admin yang berhak merubah status akses.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT * FROM users WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    const currentStatus = existing.rows[0].is_active;
    const newStatus = (currentStatus === 1 || currentStatus === true) ? 0 : 1;

    await db.execute({
      sql: 'UPDATE users SET is_active = ?, updated_at = DATETIME("now") WHERE id = ?',
      args: [newStatus, id]
    });

    return NextResponse.json({
      message: newStatus === 1 ? 'Akun berhasil diaktifkan/disetujui' : 'Akun berhasil dinonaktifkan',
      is_active: Boolean(newStatus)
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
