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
    const existing = await db.execute({ sql: 'SELECT * FROM partners WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Partner tidak ditemukan' }, { status: 404 });
    }

    const partnerOld = existing.rows[0];
    const formData = await request.formData();

    const nama = formData.get('nama') || partnerOld.nama;
    const link = formData.has('link') ? formData.get('link') : partnerOld.link;
    const urutan = formData.has('urutan') ? parseInt(formData.get('urutan')) : partnerOld.urutan;

    let logoKey = partnerOld.logo;
    const logoFile = formData.get('logo');
    if (logoFile && logoFile.size > 0) {
      if (partnerOld.logo) await deleteFromR2(partnerOld.logo);
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      logoKey = await uploadToR2(buffer, 'partners', logoFile.name);
    }

    await db.execute({
      sql: 'UPDATE partners SET nama = ?, logo = ?, link = ?, urutan = ?, updated_at = DATETIME("now") WHERE id = ?',
      args: [nama, logoKey, link, urutan, id]
    });

    return NextResponse.json({ id: Number(id), nama, logo: logoKey, link, urutan });
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
    const existing = await db.execute({ sql: 'SELECT * FROM partners WHERE id = ? LIMIT 1', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ message: 'Partner tidak ditemukan' }, { status: 404 });
    }

    const item = existing.rows[0];
    if (item.logo) await deleteFromR2(item.logo);

    await db.execute({ sql: 'DELETE FROM partners WHERE id = ?', args: [id] });

    return NextResponse.json({ message: 'Partner berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
