import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT * FROM events WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Event tidak ditemukan' }, { status: 404 });
    }

    const eventOld = existing.rows[0];
    const formData = await request.formData();

    const judul = formData.get('judul') || eventOld.judul;
    const deskripsi = formData.has('deskripsi') ? formData.get('deskripsi') : eventOld.deskripsi;
    const tanggal = formData.has('tanggal') ? formData.get('tanggal') : eventOld.tanggal;
    const waktu = formData.has('waktu') ? formData.get('waktu') : eventOld.waktu;
    const lokasi = formData.has('lokasi') ? formData.get('lokasi') : eventOld.lokasi;
    const linkPendaftaran = formData.has('link_pendaftaran') ? formData.get('link_pendaftaran') : eventOld.link_pendaftaran;
    const slug = judul ? judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : eventOld.slug;

    let posterKey = eventOld.poster;
    const posterFile = formData.get('poster') || formData.get('gambar');
    if (posterFile && typeof posterFile === 'object' && typeof posterFile.arrayBuffer === 'function' && posterFile.size > 0) {
      if (eventOld.poster) await deleteFromR2(eventOld.poster);
      const buffer = Buffer.from(await posterFile.arrayBuffer());
      posterKey = await uploadToR2(buffer, 'events', posterFile.name || 'event.jpg');
    }

    let isPublished = eventOld.is_published;
    if (formData.has('is_published')) {
      isPublished = formData.get('is_published') === '1' || formData.get('is_published') === 'true' ? 1 : 0;
    }

    await db.execute({
      sql: `UPDATE events SET 
            judul = ?, slug = ?, deskripsi = ?, tanggal = ?, waktu = ?, lokasi = ?, 
            poster = ?, link_pendaftaran = ?, is_published = ?, updated_at = DATETIME("now")
            WHERE id = ?`,
      args: [judul, slug, deskripsi, tanggal, waktu, lokasi, posterKey, linkPendaftaran, isPublished, id]
    });

    return NextResponse.json({
      id: Number(id),
      judul,
      slug,
      deskripsi,
      tanggal,
      waktu,
      lokasi,
      poster: posterKey,
      link_pendaftaran: linkPendaftaran,
      is_published: Boolean(isPublished)
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request, context) {
  return PUT(request, context);
}

export async function DELETE(request, { params }) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT * FROM events WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Event tidak ditemukan' }, { status: 404 });
    }

    const item = existing.rows[0];
    if (item.poster) await deleteFromR2(item.poster);

    await db.execute({ sql: 'DELETE FROM events WHERE id = ?', args: [id] });

    return NextResponse.json({ message: 'Event berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
