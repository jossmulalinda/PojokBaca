import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM bidang ORDER BY urutan ASC, id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const { nama_bidang, urutan } = await request.json();
    if (!nama_bidang) {
      return NextResponse.json({ message: 'Nama bidang wajib diisi' }, { status: 422 });
    }

    const db = getDb();
    const insertResult = await db.execute({
      sql: 'INSERT INTO bidang (nama_bidang, urutan, created_at, updated_at) VALUES (?, ?, DATETIME("now"), DATETIME("now"))',
      args: [nama_bidang, urutan || 0]
    });

    return NextResponse.json({ id: Number(insertResult.lastInsertRowid), nama_bidang, urutan: urutan || 0 }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
