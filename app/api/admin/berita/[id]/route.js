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
    const existing = await db.execute({ sql: 'SELECT * FROM berita WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 });
    }

    const beritaOld = existing.rows[0];
    const formData = await request.formData();

    const judul = formData.get('judul') || beritaOld.judul;
    const konten = formData.get('konten') || beritaOld.konten;
    const kategori = formData.get('kategori') || beritaOld.kategori;
    const penulis = formData.get('penulis') || beritaOld.penulis;
    const excerpt = formData.get('excerpt') || beritaOld.excerpt;
    const publishedAtStr = formData.get('published_at');

    const slug = judul ? judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : beritaOld.slug;

    let thumbnailKey = beritaOld.thumbnail;
    const thumbnailFile = formData.get('thumbnail');
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (beritaOld.thumbnail) await deleteFromR2(beritaOld.thumbnail);
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      thumbnailKey = await uploadToR2(buffer, 'berita', thumbnailFile.name);
    }

    let fotoTambahanKeys = [];
    if (beritaOld.foto_tambahan) {
      try {
        fotoTambahanKeys = typeof beritaOld.foto_tambahan === 'string' ? JSON.parse(beritaOld.foto_tambahan) : beritaOld.foto_tambahan;
      } catch {
        fotoTambahanKeys = [];
      }
    }

    const extraFiles = formData.getAll('foto_tambahan[]');
    if (extraFiles.length > 0 && extraFiles[0] && extraFiles[0].size > 0) {
      // Clear old extra photos
      for (const oldKey of fotoTambahanKeys) {
        await deleteFromR2(oldKey);
      }
      fotoTambahanKeys = [];
      for (const file of extraFiles) {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const key = await uploadToR2(buffer, 'berita', file.name);
          fotoTambahanKeys.push(key);
        }
      }
    }

    let isPublished = beritaOld.is_published;
    if (formData.has('is_published')) {
      isPublished = formData.get('is_published') === '1' || formData.get('is_published') === 'true' ? 1 : 0;
    }

    let createdAt = beritaOld.created_at;
    let publishedAt = beritaOld.published_at;

    if (publishedAtStr) {
      createdAt = new Date(publishedAtStr).toISOString();
      publishedAt = createdAt;
    } else if (isPublished && !publishedAt) {
      publishedAt = new Date().toISOString();
    }

    await db.execute({
      sql: `UPDATE berita SET 
            judul = ?, slug = ?, konten = ?, kategori = ?, penulis = ?, excerpt = ?, 
            thumbnail = ?, foto_tambahan = ?, is_published = ?, published_at = ?, created_at = ?, updated_at = DATETIME('now')
            WHERE id = ?`,
      args: [
        judul,
        slug,
        konten,
        kategori,
        penulis,
        excerpt,
        thumbnailKey,
        JSON.stringify(fotoTambahanKeys),
        isPublished,
        publishedAt,
        createdAt,
        id
      ]
    });

    return NextResponse.json({
      id: Number(id),
      judul,
      slug,
      konten,
      kategori,
      penulis,
      thumbnail: thumbnailKey,
      foto_tambahan: fotoTambahanKeys,
      is_published: Boolean(isPublished),
      published_at: publishedAt,
      created_at: createdAt
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
    if (item.thumbnail) await deleteFromR2(item.thumbnail);

    if (item.foto_tambahan) {
      try {
        const extras = typeof item.foto_tambahan === 'string' ? JSON.parse(item.foto_tambahan) : item.foto_tambahan;
        for (const k of extras) await deleteFromR2(k);
      } catch {}
    }

    await db.execute({ sql: 'DELETE FROM berita WHERE id = ?', args: [id] });

    return NextResponse.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
