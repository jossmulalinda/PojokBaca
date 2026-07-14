import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { deleteFromR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT * FROM galeri WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Galeri tidak ditemukan' }, { status: 404 });
    }

    const item = existing.rows[0];
    if (item.foto) await deleteFromR2(item.foto);

    await db.execute({ sql: 'DELETE FROM galeri WHERE id = ?', args: [id] });

    return NextResponse.json({ message: 'Foto galeri berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
