import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getR2Url } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const bidang = searchParams.get('bidang');
    const periode = searchParams.get('periode');

    let sql = 'SELECT * FROM pengurus WHERE 1=1';
    const args = [];

    if (bidang) { sql += ' AND bidang = ?'; args.push(bidang); }
    if (periode) { sql += ' AND periode = ?'; args.push(periode); }

    sql += ' ORDER BY urutan ASC';

    const result = await db.execute({ sql, args });
    const data = result.rows.map(p => ({
      ...p,
      foto: getR2Url(p.foto),
    }));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
