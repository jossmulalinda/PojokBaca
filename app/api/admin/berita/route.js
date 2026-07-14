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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * perPage;

    let countSql = 'SELECT COUNT(*) as total FROM berita';
    let querySql = 'SELECT * FROM berita';
    const args = [];

    if (search) {
      countSql += ' WHERE judul LIKE ? OR kategori LIKE ?';
      querySql += ' WHERE judul LIKE ? OR kategori LIKE ?';
      args.push(`%${search}%`, `%${search}%`);
    }

    querySql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const countResult = await db.execute({ sql: countSql, args });
    const total = countResult.rows[0].total;

    const result = await db.execute({ sql: querySql, args: [...args, perPage, offset] });

    const data = result.rows.map(item => {
      let fotoTambahan = [];
      if (item.foto_tambahan) {
        try {
          fotoTambahan = typeof item.foto_tambahan === 'string' ? JSON.parse(item.foto_tambahan) : item.foto_tambahan;
        } catch {
          fotoTambahan = [];
        }
      }
      return {
        ...item,
        gambar: item.thumbnail,
        foto_tambahan: fotoTambahan
      };
    });

    return NextResponse.json({
      data,
      current_page: page,
      per_page: perPage,
      total,
      last_page: Math.ceil(total / perPage)
    });
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
    const konten = formData.get('konten');
    const kategori = formData.get('kategori') || 'berita-umum';
    const penulis = formData.get('penulis') || user.username || 'Super Mimin';
    const excerpt = formData.get('excerpt') || '';
    const isPublished = formData.get('is_published') === '1' || formData.get('is_published') === 'true';
    const publishedAtStr = formData.get('published_at');

    if (!judul || !konten) {
      return NextResponse.json({ message: 'Judul dan konten berita wajib diisi' }, { status: 422 });
    }

    const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Upload thumbnail
    let thumbnailKey = '';
    const thumbnailFile = formData.get('thumbnail');
    if (thumbnailFile && thumbnailFile.size > 0) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      thumbnailKey = await uploadToR2(buffer, 'berita', thumbnailFile.name);
    }

    // Upload foto tambahan
    const fotoTambahanKeys = [];
    const extraFiles = formData.getAll('foto_tambahan[]');
    for (const file of extraFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const key = await uploadToR2(buffer, 'berita', file.name);
        fotoTambahanKeys.push(key);
      }
    }

    const createdAt = publishedAtStr ? new Date(publishedAtStr).toISOString() : new Date().toISOString();
    const publishedAt = isPublished ? createdAt : null;

    const db = getDb();
    const insertResult = await db.execute({
      sql: `INSERT INTO berita (judul, slug, konten, kategori, penulis, excerpt, thumbnail, foto_tambahan, is_published, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        judul,
        slug,
        konten,
        kategori,
        penulis,
        excerpt,
        thumbnailKey,
        JSON.stringify(fotoTambahanKeys),
        isPublished ? 1 : 0,
        publishedAt,
        createdAt,
        createdAt
      ]
    });

    return NextResponse.json({
      id: Number(insertResult.lastInsertRowid),
      judul,
      slug,
      konten,
      kategori,
      penulis,
      thumbnail: thumbnailKey,
      foto_tambahan: fotoTambahanKeys,
      is_published: isPublished,
      published_at: publishedAt,
      created_at: createdAt
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
