import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q) {
      return NextResponse.json({ berita: [], galeri: [], events: [] });
    }

    const searchTerm = `%${q}%`;

    const beritaResult = await db.execute({
      sql: 'SELECT id, judul, slug, thumbnail as gambar, created_at FROM berita WHERE is_published = 1 AND (judul LIKE ? OR konten LIKE ?) LIMIT 5',
      args: [searchTerm, searchTerm]
    });

    const galeriResult = await db.execute({
      sql: 'SELECT id, judul, foto, created_at FROM galeri WHERE judul LIKE ? LIMIT 5',
      args: [searchTerm]
    });

    const eventsResult = await db.execute({
      sql: 'SELECT id, judul, slug, poster as gambar, tanggal FROM events WHERE judul LIKE ? OR deskripsi LIKE ? LIMIT 5',
      args: [searchTerm, searchTerm]
    });

    return NextResponse.json({
      berita: beritaResult.rows,
      galeri: galeriResult.rows,
      events: eventsResult.rows
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
