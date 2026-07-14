import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '12');
    const sort = searchParams.get('sort') || 'terbaru';
    const offset = (page - 1) * perPage;

    const countResult = await db.execute('SELECT COUNT(*) as total FROM galeri');
    const total = countResult.rows[0].total;

    const orderSql = sort === 'terlama' ? 'ASC' : 'DESC';
    const result = await db.execute({
      sql: `SELECT * FROM galeri ORDER BY created_at ${orderSql} LIMIT ? OFFSET ?`,
      args: [perPage, offset]
    });

    return NextResponse.json({
      data: result.rows,
      current_page: page,
      per_page: perPage,
      total,
      last_page: Math.ceil(total / perPage)
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
