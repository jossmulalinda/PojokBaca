import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM events ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const formData = await request.formData();
    const judul = formData.get('judul');
    const deskripsi = formData.get('deskripsi') || '';
    const tanggal = formData.get('tanggal') || new Date().toISOString().slice(0, 10);
    const waktu = formData.get('waktu') || '';
    const lokasi = formData.get('lokasi') || '';
    const linkPendaftaran = formData.get('link_pendaftaran') || null;
    const isPublished = formData.get('is_published') === '1' || formData.get('is_published') === 'true';

    if (!judul) {
      return NextResponse.json({ message: 'Judul event wajib diisi' }, { status: 422 });
    }

    const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let posterKey = '';
    const posterFile = formData.get('poster') || formData.get('gambar');
    if (posterFile && posterFile.size > 0) {
      const buffer = Buffer.from(await posterFile.arrayBuffer());
      posterKey = await uploadToR2(buffer, 'events', posterFile.name);
    }

    const db = getDb();
    const insertResult = await db.execute({
      sql: `INSERT INTO events (judul, slug, deskripsi, tanggal, waktu, lokasi, poster, link_pendaftaran, is_published, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME("now"), DATETIME("now"))`,
      args: [judul, slug, deskripsi, tanggal, waktu, lokasi, posterKey, linkPendaftaran, isPublished ? 1 : 0]
    });

    return NextResponse.json({
      id: Number(insertResult.lastInsertRowid),
      judul,
      slug,
      deskripsi,
      tanggal,
      waktu,
      lokasi,
      poster: posterKey,
      link_pendaftaran: linkPendaftaran,
      is_published: isPublished
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
