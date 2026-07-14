import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getR2Url } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori');
    const perPage = parseInt(searchParams.get('per_page') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * perPage;

    let sql = 'SELECT * FROM projects WHERE 1=1';
    const args = [];

    if (kategori) { sql += ' AND kategori = ?'; args.push(kategori); }

    const countResult = await db.execute({ sql: sql.replace('SELECT *', 'SELECT COUNT(*) as count'), args: [...args] });
    const total = Number(countResult.rows[0].count);

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    args.push(perPage, offset);

    const result = await db.execute({ sql, args });
    const data = result.rows.map(p => ({
      ...p,
      thumbnail: getR2Url(p.thumbnail),
      tags: p.tags ? (typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags) : [],
    }));

    return NextResponse.json({
      data,
      current_page: page,
      per_page: perPage,
      total,
      last_page: Math.ceil(total / perPage),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
