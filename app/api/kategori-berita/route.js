import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json([
    { id: 1, slug: 'berita-umum', judul_kategori: 'Berita Umum' },
    { id: 2, slug: 'akademik', judul_kategori: 'Akademik' },
    { id: 3, slug: 'kegiatan', judul_kategori: 'Kegiatan' },
    { id: 4, slug: 'prestasi', judul_kategori: 'Prestasi' },
  ]);
}
