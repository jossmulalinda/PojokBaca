import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;

  try {
    const { bidang_id, nama_divisi, urutan } = await request.json();
    const db = getDb();

    await db.execute({
      sql: 'UPDATE divisi SET bidang_id = ?, nama_divisi = ?, urutan = ?, updated_at = DATETIME("now") WHERE id = ?',
      args: [bidang_id, nama_divisi, urutan || 0, id]
    });

    return NextResponse.json({ id: Number(id), bidang_id, nama_divisi, urutan: urutan || 0 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;

  try {
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM divisi WHERE id = ?', args: [id] });
    return NextResponse.json({ message: 'Divisi berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
