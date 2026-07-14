import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  try {
    const { periode } = await request.json();
    if (!periode) {
      return NextResponse.json({ message: 'Periode wajib diisi' }, { status: 422 });
    }

    const db = getDb();
    await db.execute({
      sql: 'UPDATE pengurus SET periode = ?, updated_at = DATETIME("now")',
      args: [periode]
    });

    return NextResponse.json({ message: 'Periode berhasil diperbarui', periode });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
