import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT * FROM berita WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 });
    }

    const item = existing.rows[0];
    const newStatus = item.is_published === 1 ? 0 : 1;
    const publishedAt = newStatus === 1 ? new Date().toISOString() : null;

    await db.execute({
      sql: 'UPDATE berita SET is_published = ?, published_at = ?, updated_at = DATETIME("now") WHERE id = ?',
      args: [newStatus, publishedAt, id]
    });

    return NextResponse.json({
      message: newStatus === 1 ? 'Artikel berhasil dipublikasikan' : 'Artikel di-unpublish ke draf',
      is_published: Boolean(newStatus),
      published_at: publishedAt
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
