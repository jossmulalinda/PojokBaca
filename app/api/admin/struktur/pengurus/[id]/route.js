import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT * FROM pengurus WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Pengurus tidak ditemukan' }, { status: 404 });
    }

    const pengurusOld = existing.rows[0];
    const formData = await request.formData();

    const nama = formData.get('nama') || pengurusOld.nama;
    const npm = formData.has('npm') ? formData.get('npm') : pengurusOld.npm;
    const jabatan = formData.get('jabatan') || pengurusOld.jabatan;
    const bidangId = formData.has('bidang_id') ? (formData.get('bidang_id') ? parseInt(formData.get('bidang_id')) : null) : pengurusOld.bidang_id;
    const divisiId = formData.has('divisi_id') ? (formData.get('divisi_id') ? parseInt(formData.get('divisi_id')) : null) : pengurusOld.divisi_id;
    const periode = formData.get('periode') || pengurusOld.periode;

    let fotoKey = pengurusOld.foto;
    const fotoFile = formData.get('foto');
    if (fotoFile && typeof fotoFile === 'object' && typeof fotoFile.arrayBuffer === 'function' && fotoFile.size > 0) {
      if (pengurusOld.foto) await deleteFromR2(pengurusOld.foto);
      const buffer = Buffer.from(await fotoFile.arrayBuffer());
      fotoKey = await uploadToR2(buffer, 'pengurus', fotoFile.name || 'pengurus.jpg');
    }

    await db.execute({
      sql: `UPDATE pengurus SET 
            nama = ?, npm = ?, jabatan = ?, bidang_id = ?, divisi_id = ?, periode = ?, foto = ?, updated_at = DATETIME("now")
            WHERE id = ?`,
      args: [nama, npm, jabatan, bidangId, divisiId, periode, fotoKey, id]
    });

    return NextResponse.json({
      id: Number(id),
      nama,
      npm,
      jabatan,
      bidang_id: bidangId,
      divisi_id: divisiId,
      periode,
      foto: fotoKey
    });
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

  const { id } = await params;

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT * FROM pengurus WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Pengurus tidak ditemukan' }, { status: 404 });
    }

    const item = existing.rows[0];
    if (item.foto) await deleteFromR2(item.foto);

    await db.execute({ sql: 'DELETE FROM pengurus WHERE id = ?', args: [id] });

    return NextResponse.json({ message: 'Pengurus berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
