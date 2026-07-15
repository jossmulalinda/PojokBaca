import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const formData = await request.formData();
    const judul = formData.get('judul');
    const kategori = formData.get('kategori') || 'Dokumentasi';
    const tanggal = formData.get('tanggal') || new Date().toISOString().slice(0, 10);

    if (!judul) {
      return NextResponse.json({ message: 'Judul dokumentasi wajib diisi' }, { status: 422 });
    }

    const rawFiles = formData.getAll('fotos[]').length > 0 ? formData.getAll('fotos[]') : [formData.get('foto')].filter(Boolean);

    const validFiles = rawFiles.filter(f => f && typeof f === 'object' && typeof f.arrayBuffer === 'function' && f.size > 0);

    if (validFiles.length === 0) {
      return NextResponse.json({ message: 'Setidaknya 1 foto valid wajib diunggah' }, { status: 422 });
    }

    const db = getDb();
    const createdItems = [];

    for (const file of validFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = await uploadToR2(buffer, 'galeri', file.name || 'galeri.jpg');

      const insertResult = await db.execute({
        sql: 'INSERT INTO galeri (judul, foto, kategori, tanggal, created_at, updated_at) VALUES (?, ?, ?, ?, DATETIME("now"), DATETIME("now"))',
        args: [judul, key, kategori, tanggal]
      });

      createdItems.push({
        id: Number(insertResult.lastInsertRowid),
        judul,
        foto: key,
        kategori,
        tanggal
      });
    }

    return NextResponse.json({
      message: `${createdItems.length} foto galeri berhasil ditambahkan`,
      data: createdItems
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
