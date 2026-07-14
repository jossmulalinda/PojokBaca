import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getR2Url } from '@/lib/r2';

export const dynamic = 'force-dynamic';

const KATEGORI_TITLES = {
  'semua-berita': 'Semua Berita',
  'berita-umum': 'Berita Umum',
  'akademik': 'Akademik',
  'kegiatan': 'Kegiatan',
  'prestasi': 'Prestasi',
};

const KATEGORI_KEYS = Object.keys(KATEGORI_TITLES);

function formatBerita(b) {
  if (!b) return null;
  const kategoriSlug = b.kategori ?? 'berita-umum';
  const kategoriTitle = KATEGORI_TITLES[kategoriSlug] ?? kategoriSlug;
  const kategoriId = KATEGORI_KEYS.indexOf(kategoriSlug) + 1;

  let fotoTambahan = [];
  if (b.foto_tambahan) {
    try {
      const parsed = typeof b.foto_tambahan === 'string' ? JSON.parse(b.foto_tambahan) : b.foto_tambahan;
      if (Array.isArray(parsed)) fotoTambahan = parsed.map(p => getR2Url(p));
    } catch {}
  }

  return {
    id: b.id,
    judul: b.judul,
    slug: b.slug,
    konten: b.konten,
    excerpt: b.excerpt,
    gambar: getR2Url(b.thumbnail),
    foto_tambahan: fotoTambahan,
    penulis: b.penulis ?? 'Admin HMTI',
    created_at: b.created_at,
    updated_at: b.updated_at,
    dibaca: b.views ?? 0,
    kategori: {
      id: kategoriId,
      slug: kategoriSlug,
      judul_kategori: kategoriTitle,
    },
  };
}

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('cari') || searchParams.get('q') || '';

    const result = await db.execute({
      sql: `SELECT * FROM berita WHERE is_published = 1 AND (judul LIKE ? OR konten LIKE ?) ORDER BY created_at DESC`,
      args: [`%${keyword}%`, `%${keyword}%`],
    });

    return NextResponse.json(result.rows.map(formatBerita));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
