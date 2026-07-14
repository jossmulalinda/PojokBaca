import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { uploadToR2, getR2Url } from '@/lib/r2';

export const dynamic = 'force-dynamic';

// POST — tambah pengurus baru
export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const formData = await request.formData();

    const nama = formData.get('nama');
    const jabatan = formData.get('jabatan');
    const bidang = formData.get('bidang') || '-';
    const angkatan = formData.get('angkatan') || null;
    const periode = formData.get('periode') || null;
    const urutan = parseInt(formData.get('urutan') || '0');

    if (!nama || !jabatan) {
      return NextResponse.json({ error: 'Nama dan jabatan wajib diisi.' }, { status: 422 });
    }

    const now = new Date().toISOString();
    let fotoKey = null;

    const fotoFile = formData.get('foto');
    if (fotoFile && fotoFile.size > 0) {
      const buffer = Buffer.from(await fotoFile.arrayBuffer());
      fotoKey = await uploadToR2(buffer, 'pengurus', fotoFile.name);
    }

    const result = await db.execute({
      sql: 'INSERT INTO pengurus (nama, jabatan, bidang, foto, angkatan, periode, urutan, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [nama, jabatan, bidang, fotoKey, angkatan, periode, urutan, now, now],
    });

    const newId = Number(result.lastInsertRowid);
    return NextResponse.json({
      id: newId, nama, jabatan, bidang, foto: getR2Url(fotoKey), angkatan, periode, urutan,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
