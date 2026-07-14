import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getR2Url } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const db = getDb();
    const { slug } = params;

    const result = await db.execute({
      sql: 'SELECT * FROM projects WHERE slug = ? LIMIT 1',
      args: [slug],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });
    }

    const p = result.rows[0];
    return NextResponse.json({
      ...p,
      thumbnail: getR2Url(p.thumbnail),
      tags: p.tags ? (typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags) : [],
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
