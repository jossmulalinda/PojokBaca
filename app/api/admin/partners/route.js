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
    const result = await db.execute('SELECT * FROM partners ORDER BY urutan ASC, created_at DESC');
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
    const nama = formData.get('nama');
    const link = formData.get('link') || null;
    const urutan = parseInt(formData.get('urutan') || '0');

    if (!nama) {
      return NextResponse.json({ message: 'Nama partner wajib diisi' }, { status: 422 });
    }

    let logoKey = '';
    const logoFile = formData.get('logo');
    if (logoFile && typeof logoFile === 'object' && typeof logoFile.arrayBuffer === 'function' && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      logoKey = await uploadToR2(buffer, 'partners', logoFile.name || 'partner.jpg');
    }

    const db = getDb();
    const insertResult = await db.execute({
      sql: 'INSERT INTO partners (nama, logo, link, urutan, created_at, updated_at) VALUES (?, ?, ?, ?, DATETIME("now"), DATETIME("now"))',
      args: [nama, logoKey, link, urutan]
    });

    return NextResponse.json({
      id: Number(insertResult.lastInsertRowid),
      nama,
      logo: logoKey,
      link,
      urutan
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
