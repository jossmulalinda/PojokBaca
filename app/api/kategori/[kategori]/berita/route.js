import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { kategori } = await params;

  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '6');
    const offset = (page - 1) * perPage;

    let countSql = 'SELECT COUNT(*) as total FROM berita WHERE is_published = 1';
    let querySql = 'SELECT * FROM berita WHERE is_published = 1';
    const queryArgs = [];

    if (kategori && kategori !== 'semua-berita') {
      countSql += ' AND kategori = ?';
      querySql += ' AND kategori = ?';
      queryArgs.push(kategori);
    }

    querySql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const countResult = await db.execute({ sql: countSql, args: queryArgs });
    const total = countResult.rows[0].total;

    const result = await db.execute({ sql: querySql, args: [...queryArgs, perPage, offset] });

    const data = result.rows.map(item => ({
      ...item,
      gambar: item.thumbnail
    }));

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
