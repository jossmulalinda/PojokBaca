import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM berita WHERE is_published = 1 ORDER BY dibaca DESC, created_at DESC LIMIT 3');
    const data = result.rows.map(item => ({
      ...item,
      gambar: item.thumbnail
    }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
