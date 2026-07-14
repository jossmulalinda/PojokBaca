import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { uploadToR2, deleteFromR2, getR2Url } from '@/lib/r2';

export const dynamic = 'force-dynamic';

// PUT — update pengurus
export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const { id } = params;
    const now = new Date().toISOString();

    const existing = await db.execute({ sql: 'SELECT * FROM pengurus WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) return NextResponse.json({ error: 'Pengurus tidak ditemukan' }, { status: 404 });

    const pengurus = existing.rows[0];
    const formData = await request.formData();
    const updates = {};

    const nama = formData.get('nama');
    const jabatan = formData.get('jabatan');
    const bidang = formData.get('bidang');
    const angkatan = formData.get('angkatan');
    const periode = formData.get('periode');
    const urutan = formData.get('urutan');

    if (nama) updates.nama = nama;
    if (jabatan) updates.jabatan = jabatan;
    if (bidang !== null && bidang !== undefined) updates.bidang = bidang;
    if (angkatan !== null && angkatan !== undefined) updates.angkatan = angkatan;
    if (periode !== null && periode !== undefined) updates.periode = periode;
    if (urutan !== null && urutan !== undefined) updates.urutan = parseInt(urutan);

    const fotoFile = formData.get('foto');
    if (fotoFile && fotoFile.size > 0) {
      if (pengurus.foto) await deleteFromR2(pengurus.foto);
      const buffer = Buffer.from(await fotoFile.arrayBuffer());
      updates.foto = await uploadToR2(buffer, 'pengurus', fotoFile.name);
    }

    updates.updated_at = now;
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    await db.execute({ sql: `UPDATE pengurus SET ${setClauses} WHERE id = ?`, args: [...Object.values(updates), id] });

    const updated = await db.execute({ sql: 'SELECT * FROM pengurus WHERE id = ?', args: [id] });
    const p = updated.rows[0];
    return NextResponse.json({ ...p, foto: getR2Url(p.foto) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — hapus pengurus
export async function DELETE(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const { id } = params;

    const existing = await db.execute({ sql: 'SELECT * FROM pengurus WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) return NextResponse.json({ error: 'Pengurus tidak ditemukan' }, { status: 404 });

    if (existing.rows[0].foto) await deleteFromR2(existing.rows[0].foto);
    await db.execute({ sql: 'DELETE FROM pengurus WHERE id = ?', args: [id] });
    return NextResponse.json({ message: 'Pengurus berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
