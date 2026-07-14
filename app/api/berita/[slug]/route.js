import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    const db = getDb();
    
    // Increment view count
    await db.execute({
      sql: 'UPDATE berita SET dibaca = COALESCE(dibaca, 0) + 1 WHERE slug = ?',
      args: [slug]
    });

    const result = await db.execute({
      sql: 'SELECT * FROM berita WHERE slug = ? LIMIT 1',
      args: [slug]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 });
    }

    const item = result.rows[0];
    let fotoTambahan = [];
    if (item.foto_tambahan) {
      try {
        fotoTambahan = typeof item.foto_tambahan === 'string' ? JSON.parse(item.foto_tambahan) : item.foto_tambahan;
      } catch {
        fotoTambahan = [];
      }
    }

    return NextResponse.json({
      ...item,
      gambar: item.thumbnail,
      foto_tambahan: fotoTambahan
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
