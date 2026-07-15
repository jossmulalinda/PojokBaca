import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM pengurus ORDER BY id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const formData = await request.formData();
    const nama = formData.get('nama');
    const npm = formData.get('npm') || null;
    const jabatan = formData.get('jabatan');
    const bidangId = formData.get('bidang_id') ? parseInt(formData.get('bidang_id')) : null;
    const divisiId = formData.get('divisi_id') ? parseInt(formData.get('divisi_id')) : null;
    const periode = formData.get('periode') || '2024/2025';

    if (!nama || !jabatan) {
      return NextResponse.json({ message: 'Nama dan jabatan pengurus wajib diisi' }, { status: 422 });
    }

    let fotoKey = null;
    const fotoFile = formData.get('foto');
    if (fotoFile && typeof fotoFile === 'object' && typeof fotoFile.arrayBuffer === 'function' && fotoFile.size > 0) {
      const buffer = Buffer.from(await fotoFile.arrayBuffer());
      fotoKey = await uploadToR2(buffer, 'pengurus', fotoFile.name || 'pengurus.jpg');
    }

    const db = getDb();
    const insertResult = await db.execute({
      sql: `INSERT INTO pengurus (nama, npm, jabatan, bidang_id, divisi_id, periode, foto, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME("now"), DATETIME("now"))`,
      args: [nama, npm, jabatan, bidangId, divisiId, periode, fotoKey]
    });

    return NextResponse.json({
      id: Number(insertResult.lastInsertRowid),
      nama,
      npm,
      jabatan,
      bidang_id: bidangId,
      divisi_id: divisiId,
      periode,
      foto: fotoKey
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
