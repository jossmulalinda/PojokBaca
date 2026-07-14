import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '6');
    const offset = (page - 1) * perPage;

    const countResult = await db.execute('SELECT COUNT(*) as total FROM berita WHERE is_published = 1');
    const total = countResult.rows[0].total;

    const result = await db.execute({
      sql: 'SELECT * FROM berita WHERE is_published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?',
      args: [perPage, offset]
    });

    const data = result.rows.map(item => {
      let fotoTambahan = [];
      if (item.foto_tambahan) {
        try {
          fotoTambahan = typeof item.foto_tambahan === 'string' ? JSON.parse(item.foto_tambahan) : item.foto_tambahan;
        } catch {
          fotoTambahan = [];
        }
      }
      return {
        ...item,
        gambar: item.thumbnail, // alias for legacy frontend compatibility
        foto_tambahan: fotoTambahan
      };
    });

    return NextResponse.json({
      data,
      current_page: page,
      per_page: perPage,
      total,
      last_page: Math.ceil(total / perPage)
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
